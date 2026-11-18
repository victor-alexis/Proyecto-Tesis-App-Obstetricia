/**
 * login.tsx
 * Pantalla Principal de Inicio de Sesión de ClinicalCase.
 * Reestructurada modularmente bajo estándares Senior UI/UX.
 * Orquesta LoginBackground, LoginBrand, LoginCard y LoginFooter integrados con Supabase Auth.
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
import { router } from 'expo-router';

import {
  LoginBackground,
  LoginBrand,
  LoginCard,
  LoginFooter,
} from '../components/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithPassword, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirigir al inicio si ya hay sesión autenticada activa
  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session]);

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
    if (!email.trim() || !pass) {
      setErrorMessage('Por favor ingresa tu correo institucional o personal y contraseña.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      const result = await signInWithPassword(email.trim(), pass);
      if (!result.success && result.error) {
        setErrorMessage(result.error);
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

      {/* ── Fondo Institucional con Curvas Orgánicas en Esquina Superior Derecha ── */}
      <LoginBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Encabezado: Corazón Maternal + ClinicalCase + Subtítulo ── */}
            <LoginBrand />

            {/* ── Tarjeta Blanca de Autenticación ── */}
            <LoginCard
              onGoogleLogin={handleGoogleLogin}
              onEmailLogin={handleEmailLogin}
              loading={loading}
              errorMessage={errorMessage}
            />

            {/* ── Pie de Página: Fotografía Maternal + Aviso de Seguridad + Créditos ── */}
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
    backgroundColor: '#F1F7FD',
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
