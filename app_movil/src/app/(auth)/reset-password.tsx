/**
 * reset-password.tsx
 * Pantalla para definir la nueva contraseña tras verificar el código de recuperación.
 * Invoca supabase.auth.updateUser({ password }) y asegura el cambio de clave.
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
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

import {
  LoginBackground,
  LoginBrand,
  AuthInput,
  LoginFooter,
} from '@/components/auth';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordScreen() {
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Por favor completa ambos campos.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const result = await updatePassword(newPassword);

      if (!result.success) {
        setErrorMessage(result.error || 'No se pudo actualizar la contraseña.');
        return;
      }

      setSuccess(true);
      // Redirigir directamente al panel clínico principal (el usuario ya queda autenticado por Supabase)
      setTimeout(() => {
        router.replace('/');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error inesperado al cambiar contraseña.');
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

            {/* ── Tarjeta de Nueva Contraseña ── */}
            <View style={styles.card}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={28} color="#2563EB" />
              </View>

              <Text style={styles.cardTitle}>Nueva Contraseña</Text>
              <Text style={styles.cardDescription}>
                Ingresa y confirma tu nueva clave de acceso clínico.
              </Text>

              {/* Mensajes de Error */}
              {errorMessage && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠ {errorMessage}</Text>
                </View>
              )}

              {/* Mensaje de Éxito */}
              {success && (
                <View style={styles.successBox}>
                  <CheckCircle2 size={18} color="#047857" style={{ marginRight: 8 }} />
                  <Text style={styles.successText}>
                    ¡Contraseña actualizada con éxito! Ingresando a tu panel clínico...
                  </Text>
                </View>
              )}

              {/* Formulario */}
              <AuthInput
                label="Nueva contraseña"
                iconType="lock"
                placeholder="Mínimo 6 caracteres"
                isPassword
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading && !success}
              />

              <AuthInput
                label="Confirmar nueva contraseña"
                iconType="lock"
                placeholder="Repite tu contraseña"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading && !success}
              />

              {/* Botón Principal */}
              <TouchableOpacity
                style={[styles.submitButtonTouch, (loading || success) && styles.disabled]}
                onPress={handleUpdate}
                disabled={loading || success}
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
                      <Text style={styles.submitText}>Guardar Nueva Contraseña</Text>
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
                  <Text style={styles.loginLink}>← Cancelar y volver al Login</Text>
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
    paddingTop: 12,
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
    width: 54,
    height: 54,
    borderRadius: 27,
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
  successBox: {
    width: '100%',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans-SemiBold',
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
