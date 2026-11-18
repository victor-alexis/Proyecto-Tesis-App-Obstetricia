/**
 * forgot-password.tsx
 * Pantalla de Recuperación de Contraseña de ClinicalCase.
 * Envía un correo de restablecimiento seguro mediante Supabase Auth.
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Por favor ingresa tu correo institucional o personal.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Si el correo está registrado, recibirás un enlace de restablecimiento.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar la solicitud.');
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

            {/* ── Tarjeta de Recuperación ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recuperar Contraseña</Text>
              <Text style={styles.cardDescription}>
                Ingresa tu correo institucional o personal registrado y te enviaremos las instrucciones de recuperación.
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
                  colors={['#07536D', '#063D58']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <View style={styles.submitContent}>
                      <Text style={styles.submitText}>Enviar instrucciones</Text>
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
    paddingTop: 16,
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
  loginLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#07536D',
    fontFamily: 'PlusJakartaSans-Bold',
  },
});
