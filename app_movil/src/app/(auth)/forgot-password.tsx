/**
 * forgot-password.tsx
 * Pantalla de Recuperación de Contraseña de ClinicalCase.
 * Envía un código OTP de recuperación de 6 dígitos mediante Supabase Auth.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, KeyRound } from 'lucide-react-native';
import { router } from 'expo-router';

import { LoginBackground, LoginBrand, AuthInput, LoginFooter } from '@/components/auth';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/authErrors';

export default function ForgotPasswordScreen() {
  const { sendPasswordResetOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Por favor ingresa tu correo institucional o personal.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Por favor ingresa un formato de correo electrónico válido.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const result = await sendPasswordResetOtp(trimmedEmail);

      if (!result.success) {
        setErrorMessage(result.error || 'Error al procesar la solicitud.');
        return;
      }

      // Redirigir a la pantalla de verificación OTP para recuperación
      router.push({
        pathname: '/verify-otp',
        params: {
          email: trimmedEmail,
          type: 'recovery',
        },
      } as any);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error inesperado al solicitar el código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoginBackground />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
          >
            <LoginBrand />

            {/* ── Tarjeta de Recuperación ── */}
            <View style={styles.card}>
              <View style={styles.iconCircle}>
                <KeyRound size={26} color="#2563EB" />
              </View>

              <Text style={styles.cardTitle}>Recuperar Contraseña</Text>
              <Text style={styles.cardDescription}>
                Ingresa tu correo institucional o personal. Te enviaremos un código de 6 dígitos para restablecer tu acceso.
              </Text>

              {/* Mensajes de Error */}
              {errorMessage && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠ {errorMessage}</Text>
                </View>
              )}

              {/* Formulario */}
              <AuthInput
                label="Correo institucional / personal"
                iconType="mail"
                placeholder="usuario@gmail.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />

              {/* Botón Principal */}
              <TouchableOpacity
                style={[styles.submitButtonTouch, loading && styles.disabled]}
                onPress={handleResetPassword}
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
                      <Text style={styles.submitText}>Enviar código de seguridad</Text>
                      <ArrowRight size={17} color="#FFFFFF" style={styles.submitArrow} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Enlace de Retorno */}
              <View style={styles.loginRow}>
                <TouchableOpacity
                  onPress={() => router.replace('/login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLink}>← Volver a Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>

            <LoginFooter />
          </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  cardDescription: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
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
  submitButtonTouch: {
    width: '100%',
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: '#00446E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  submitGradient: {
    height: 48,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  loginLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0D5C91',
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
