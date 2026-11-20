/**
 * LoginCard.tsx
 * Tarjeta de autenticación principal de ClinicalCase fiel a Image 1 y code.html.
 * Card blanca con esquinas redondeadas, botón Google azul, separador, inputs, botón principal azul petróleo (#0D5C91),
 * badge de admisión institucional y enlace a registro.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Check, Fingerprint } from 'lucide-react-native';
import { router } from 'expo-router';

import { GoogleButton } from './GoogleButton';
import { AuthInput } from './AuthInput';

interface LoginCardProps {
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, pass: string) => void;
  onBiometricLogin?: () => void;
  biometricType?: string | null;
  loading: boolean;
  errorMessage: string | null;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  onGoogleLogin,
  onEmailLogin,
  onBiometricLogin,
  biometricType,
  loading,
  errorMessage,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onEmailLogin(email, password);
  };

  return (
    <View style={styles.card}>
      {/* ── Encabezado de la Tarjeta ── */}
      <Text style={styles.cardTitle}>Bienvenido/a</Text>
      <Text style={styles.cardDescription}>
        Para acceder a las herramientas perinatales y módulos clínicos, inicia sesión con tu cuenta.
      </Text>

      {/* ── Alerta de Error ── */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠ {errorMessage}</Text>
        </View>
      )}

      {/* ── Botón Google OAuth ── */}
      <GoogleButton onPress={onGoogleLogin} disabled={loading} />

      {/* ── Separador ── */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>O INGRESA CON TU CORREO</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* ── Campo de Correo ── */}
      <AuthInput
        label="Correo institucional / personal"
        iconType="mail"
        placeholder="usuario@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      {/* ── Campo de Contraseña ── */}
      <AuthInput
        label="Contraseña"
        iconType="lock"
        placeholder="••••••••"
        isPassword
        rightLinkText="¿Olvidaste tu contraseña?"
        onRightLinkPress={() => router.push('/forgot-password' as any)}
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      {/* ── Botón Principal: Iniciar Sesión ── */}
      <TouchableOpacity
        style={[styles.submitButtonTouch, loading && styles.disabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={['#00446E', '#0D5C91']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitGradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.submitContent}>
              <Text style={styles.submitText}>Iniciar Sesión</Text>
              <ArrowRight size={16} color="#FFFFFF" style={styles.submitArrow} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* ── Botón de Acceso Biométrico Rápido (Face ID / Huella si está soportado) ── */}
      {Boolean(biometricType) && onBiometricLogin && (
        <TouchableOpacity
          style={styles.biometricBtnTouch}
          onPress={onBiometricLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Fingerprint size={16} color="#0D5C91" style={{ marginRight: 8 }} />
          <Text style={styles.biometricBtnText}>Ingreso con {biometricType}</Text>
        </TouchableOpacity>
      )}

      {/* ── Franja de Cuentas Soportadas ── */}
      <View style={styles.badgeContainer}>
        <Check size={14} color="#047857" strokeWidth={2.6} style={styles.badgeIcon} />
        <Text style={styles.badgeText}>
          Admite cuentas{' '}
          <Text style={styles.badgeBold}>institucionales</Text> y{' '}
          <Text style={styles.badgeBold}>personales</Text>
        </Text>
      </View>

      {/* ── Enlace de Registro ── */}
      <View style={styles.registerRow}>
        <Text style={styles.registerPrompt}>¿No tienes una cuenta? </Text>
        <TouchableOpacity
          onPress={() => router.push('/register' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.registerLink}>Crear una cuenta →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#D8E4F2',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  cardDescription: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  errorBox: {
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
    fontFamily: 'PlusJakartaSans-Medium',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  submitButtonTouch: {
    marginTop: 4,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: '#00446E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  submitGradient: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  submitArrow: {
    marginLeft: 6,
  },
  disabled: {
    opacity: 0.7,
  },
  biometricBtnTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 14,
  },
  biometricBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D5C91',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  badgeContainer: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11.5,
    color: '#047857',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  badgeBold: {
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerPrompt: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  registerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D5C91',
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
