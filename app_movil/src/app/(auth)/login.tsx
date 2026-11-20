/**
 * login.tsx
 * Pantalla Principal de Inicio de Sesión de ClinicalCase.
 * Reestructurada modularmente bajo estándares Senior UI/UX.
 * Orquesta LoginBackground, LoginBrand, LoginCard y LoginFooter integrados con Supabase Auth.
 * Blindada con validación RFC 5322 y redirección automática para confirmación de correo.
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';

import {
  LoginBackground,
  LoginBrand,
  LoginCard,
  LoginFooter,
} from '@/components/auth';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/authErrors';
import { BiometricsService } from '@/services/biometrics';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithPassword, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const pathname = usePathname();

  // Detección de disponibilidad biométrica (Face ID / Huella) en dispositivo nativo
  useEffect(() => {
    BiometricsService.isAvailable().then((available) => {
      if (available) {
        BiometricsService.getBiometryTypeName().then(setBiometricType);
      }
    });
  }, []);

  // Redirigir al inicio ÚNICAMENTE si ya hay sesión autenticada activa y el usuario está efectivamente en /login
  // Esto evita que interrumpa flujos en segundo plano como recuperación de contraseña (/verify-otp -> /reset-password)
  useEffect(() => {
    if (session && pathname === '/login') {
      router.replace('/');
    }
  }, [session, pathname]);

  const handleBiometricLogin = async () => {
    setErrorMessage(null);
    const success = await BiometricsService.authenticate(
      `Confirma tu ${biometricType || 'identidad'} para acceder a ClinicalCase`
    );
    if (success) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      router.replace('/');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        setErrorMessage(result.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error durante la autenticación con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (email: string, pass: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !pass) {
      setErrorMessage('Por favor ingresa tu correo institucional o personal y contraseña.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Por favor ingresa un formato de correo electrónico válido.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      const result = await signInWithPassword(trimmedEmail, pass);

      if (!result.success) {
        if (result.isEmailNotConfirmed) {
          // Si el correo no ha sido verificado, redirigir directamente al OTP de verificación
          router.push({
            pathname: '/verify-otp',
            params: {
              email: trimmedEmail,
              type: 'signup',
            },
          } as any);
          return;
        }

        setErrorMessage(result.error || 'Credenciales inválidas.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al iniciar sesión con correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ── Fondo Institucional Clínico ── */}
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
            {/* ── Encabezado: ClinicalCase + Subtítulo ── */}
            <LoginBrand />

            {/* ── Tarjeta Blanca de Autenticación ── */}
            <LoginCard
              onGoogleLogin={handleGoogleLogin}
              onEmailLogin={handleEmailLogin}
              onBiometricLogin={handleBiometricLogin}
              biometricType={biometricType}
              loading={loading}
              errorMessage={errorMessage}
            />

            {/* ── Pie de Página: Aviso de Seguridad + Créditos ── */}
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
    paddingTop: 8,
    paddingBottom: 16,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});
