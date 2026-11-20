/**
 * OtpInput.tsx
 * Componente especializado para ingreso de código OTP de 6 dígitos.
 * - Soporta autocompletado SMS/Email nativo (oneTimeCode).
 * - Pegado (paste) automático en Web, iOS y Android.
 * - 6 casilleros visuales con resaltado dinámico de foco y estilo institucional ClinicalCase.
 * - Temporizador de enfriamiento regresivo (60s) para reenvío de código.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { RefreshCw, ArrowRight } from 'lucide-react-native';

interface OtpInputProps {
  codeLength?: number;
  onCodeComplete: (code: string) => void;
  onResendCode?: () => Promise<boolean>;
  loading?: boolean;
  errorMessage?: string | null;
  resendCooldownSeconds?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  codeLength = 6,
  onCodeComplete,
  onResendCode,
  loading = false,
  errorMessage,
  resendCooldownSeconds = 60,
}) => {
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [timer, setTimer] = useState(resendCooldownSeconds);
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef<any>(null);

  // Manejador del temporizador regresivo de reenvío
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleTextChange = (text: string) => {
    // Filtrar solo caracteres numéricos
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, codeLength);
    setCode(cleaned);

    if (cleaned.length === codeLength) {
      onCodeComplete(cleaned);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !onResendCode || isResending) return;
    try {
      setIsResending(true);
      const ok = await onResendCode();
      if (ok) {
        setTimer(resendCooldownSeconds);
        setCode('');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      {/* ── Casilleros Visuales ── */}
      <Pressable onPress={handleContainerPress} style={styles.slotsRow}>
        {Array.from({ length: codeLength }).map((_, index) => {
          const char = code[index] || '';
          const isCurrent = index === code.length && isFocused;
          const isFilled = Boolean(code[index]);

          return (
            <View
              key={index}
              style={[
                styles.slot,
                isCurrent && styles.slotFocused,
                isFilled && styles.slotFilled,
                Boolean(errorMessage) && styles.slotError,
              ]}
            >
              <Text style={styles.slotText}>{char}</Text>
              {isCurrent && <View style={styles.cursor} />}
            </View>
          );
        })}
      </Pressable>

      {/* ── Input Real (Cubre el área de casilleros con opacidad mínima para activar QuickType / Autofill nativo) ── */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleTextChange}
        keyboardType="number-pad"
        maxLength={codeLength}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        autoFocus
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.hiddenInput}
        caretHidden
      />

      {/* ── Mensaje de Error si Aplica ── */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠ {errorMessage}</Text>
        </View>
      )}

      {/* ── Botón de Confirmación Manual (si ya ingresó los 6 dígitos) ── */}
      <TouchableOpacity
        style={[
          styles.verifyBtn,
          (code.length < codeLength || loading) && styles.verifyBtnDisabled,
        ]}
        onPress={() => onCodeComplete(code)}
        disabled={code.length < codeLength || loading}
        activeOpacity={0.88}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.btnContent}>
            <Text style={styles.verifyBtnText}>Verificar Código</Text>
            <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </View>
        )}
      </TouchableOpacity>

      {/* ── Sección de Reenvío con Temporizador ── */}
      {onResendCode && (
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.cooldownText}>
              ¿No recibiste el código? Reenviar en{' '}
              <Text style={styles.cooldownSeconds}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending}
              style={styles.resendBtn}
              activeOpacity={0.7}
            >
              {isResending ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <View style={styles.resendContent}>
                  <RefreshCw size={13} color="#2563EB" style={{ marginRight: 6 }} />
                  <Text style={styles.resendBtnText}>Reenviar nuevo código</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  slotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  slot: {
    flex: 1,
    height: 52,
    maxWidth: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  slotFilled: {
    borderColor: '#93C5FD',
    backgroundColor: '#F0F6FD',
  },
  slotError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  slotText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  cursor: {
    position: 'absolute',
    bottom: 10,
    width: 16,
    height: 2.5,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    opacity: 0.01,
    color: 'transparent',
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  verifyBtn: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#0D5C91',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#00446E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyBtnDisabled: {
    opacity: 0.6,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  resendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
  },
  cooldownText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  cooldownSeconds: {
    fontWeight: '700',
    color: '#0D5C91',
  },
  resendBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resendContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
