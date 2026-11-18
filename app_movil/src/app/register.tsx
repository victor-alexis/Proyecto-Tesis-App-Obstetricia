/**
 * register.tsx
 * Pantalla de Registro de ClinicalCase.
 * Permite a nuevos profesionales registrarse con correo institucional/personal y contraseña en Supabase.
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
import { ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';

import { LoginBackground, LoginBrand, AuthInput, LoginFooter } from '../components/auth';
import { supabase } from '../services/supabase';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('¡Cuenta creada exitosamente! Revisa tu correo para verificar tu cuenta.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar el registro.');
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
            keyboardShouldPersistTaps="handled"
          >
            <LoginBrand />

            {/* ── Tarjeta de Registro ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Crear Cuenta</Text>
              <Text style={styles.cardDescription}>
                Regístrate con tu correo para acceder al asistente RAG y herramientas perinatales.
              </Text>

              {/* Mensajes de Estado */}
              {errorMessage && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠ {errorMessage}</Text>
                </View>
              )}

              {successMessage && (
                <View style={styles.successBox}>
                  <CheckCircle2 size={16} color="#0F8B66" style={{ marginRight: 8 }} />
                  <Text style={styles.successText}>{successMessage}</Text>
                </View>
              )}

              {/* Formulario */}
              <AuthInput
                label="Nombre completo"
                iconType="mail"
                placeholder="Dra. María González"
                value={fullName}
                onChangeText={setFullName}
                editable={!loading}
              />

              <AuthInput
                label="Correo institucional / personal"
                iconType="mail"
                placeholder="usuario@gmail.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />

              <AuthInput
                label="Contraseña"
                iconType="lock"
                placeholder="Mínimo 6 caracteres"
                isPassword
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />

              {/* Botón Principal */}
              <TouchableOpacity
                style={[styles.submitButtonTouch, loading && styles.disabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={['#07536D', '#063D58']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.submitContent}>
                      <Text style={styles.submitText}>Crear mi cuenta</Text>
                      <ArrowRight size={17} color="#FFFFFF" style={styles.submitArrow} />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Enlace de Retorno */}
              <View style={styles.loginRow}>
                <Text style={styles.loginPrompt}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity
                  onPress={() => router.replace('/login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginLink}>Iniciar Sesión →</Text>
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
    paddingTop: 10,
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 22,
    shadowColor: '#07536D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E6EFF7',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#063D58',
    marginBottom: 4,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  cardDescription: {
    fontSize: 12.5,
    color: '#5A738E',
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
  successBox: {
    backgroundColor: '#EDFAF4',
    borderWidth: 1,
    borderColor: '#BCE8D3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successText: {
    fontSize: 12,
    color: '#0F8B66',
    flex: 1,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  submitButtonTouch: {
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: '#07536D',
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
  loginPrompt: {
    fontSize: 12.5,
    color: '#5A738E',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  loginLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#07536D',
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
