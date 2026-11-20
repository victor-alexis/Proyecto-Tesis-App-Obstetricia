/**
 * verify-otp.tsx
 * Pantalla centralizada para verificación de códigos OTP de 6 dígitos.
 * Soporta flujos de:
 * - 'signup': Confirmación de correo para nuevo registro.
 * - 'recovery': Verificación para restablecer contraseña.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import {
  LoginBackground,
  LoginBrand,
  LoginFooter,
  OtpInput,
} from '@/components/auth';
import { useAuth } from '@/context/AuthContext';

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ email?: string; type?: string }>();
  const email = params.email || '';
  const type = params.type === 'recovery' ? 'recovery' : 'signup';

  const {
    verifySignupOtp,
    resendSignupOtp,
    verifyRecoveryOtp,
    sendPasswordResetOtp,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isRecovery = type === 'recovery';

  const handleVerifyCode = async (code: string) => {
    if (code.length < 6) {
      setErrorMessage('Por favor ingresa los 6 dígitos completos del código.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      if (isRecovery) {
        // Flujo de recuperación de contraseña
        const result = await verifyRecoveryOtp(email, code);
        if (!result.success) {
          setErrorMessage(result.error || 'Código incorrecto o expirado.');
          return;
        }

        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }

        // Navegar a la pantalla para ingresar la nueva contraseña
        router.replace('/reset-password');
      } else {
        // Flujo de confirmación de registro
        const result = await verifySignupOtp(email, code);
        if (!result.success) {
          setErrorMessage(result.error || 'Código incorrecto o expirado.');
          return;
        }

        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }

        // Cuenta confirmada con éxito, ingresar al Home
        router.replace('/');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al validar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (): Promise<boolean> => {
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      if (isRecovery) {
        const res = await sendPasswordResetOtp(email);
        if (!res.success) {
          setErrorMessage(res.error || 'No se pudo reenviar el código.');
          return false;
        }
      } else {
        const res = await resendSignupOtp(email);
        if (!res.success) {
          setErrorMessage(res.error || 'No se pudo reenviar el código.');
          return false;
        }
      }

      setSuccessNotice('¡Nuevo código enviado a tu bandeja de entrada!');
      return true;
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al solicitar el reenvío.');
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <LoginBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.scrollContent}>
            <LoginBrand />

            {/* ── Tarjeta de Verificación OTP ── */}
            <View style={styles.card}>
              <View style={styles.iconCircle}>
                <MailCheck size={28} color="#2563EB" />
              </View>

              <Text style={styles.cardTitle}>Verificación Requerida</Text>
              <Text style={styles.cardDescription}>
                Hemos enviado un código de 6 dígitos a:{'\n'}
                <Text style={styles.emailHighlight}>{email || 'tu correo'}</Text>
              </Text>

              {/* Aviso de Reenvío Exitoso */}
              {successNotice && (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>✓ {successNotice}</Text>
                </View>
              )}

              {/* ── Componente OTP con 6 casilleros y timer ── */}
              <OtpInput
                codeLength={6}
                onCodeComplete={handleVerifyCode}
                onResendCode={handleResend}
                loading={loading}
                errorMessage={errorMessage}
                resendCooldownSeconds={60}
              />

              {/* ── Enlaces de Retorno y Cambio de Correo ── */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backLinkTouch}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backLinkText}>
                    {isRecovery ? '← Cambiar correo' : '← Corregir correo'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.replace('/login')}
                  style={styles.backLinkTouch}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLinkText}>Ir a Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>

            <LoginFooter />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FC',
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#D8E4F2',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  emailHighlight: {
    fontWeight: '700',
    color: '#0D5C91',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  successBox: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  successText: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  backLinkTouch: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  backLinkText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  loginLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D5C91',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
