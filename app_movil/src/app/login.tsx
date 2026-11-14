import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signInWithGoogle, session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Si ya existe sesión, redirigir al inicio
  React.useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session]);

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoading(true);

    const result = await signInWithGoogle();

    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Cabecera / Branding Clínico */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🩺</Text>
          </View>
          <Text style={styles.badge}>PROYECTO DE TESIS</Text>
          <Text style={styles.title}>App Obstetricia</Text>
          <Text style={styles.subtitle}>
            Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
          </Text>
        </View>

        {/* Tarjeta de Inicio de Sesión */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenido/a</Text>
          <Text style={styles.cardDescription}>
            Para acceder a las herramientas perinatales y módulos clínicos, inicia sesión con tu cuenta de Google.
          </Text>

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.googleButton, (loading || authLoading) && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={loading || authLoading}
            activeOpacity={0.8}
          >
            {loading || authLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.googleIconText}>G</Text>
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>
              ✓ Admite cuentas <Text style={styles.boldText}>institucionales</Text> (.edu, .cl) y <Text style={styles.boldText}>personales</Text> (@gmail.com)
            </Text>
          </View>
        </View>

        {/* Pie de página ético y de privacidad clínica */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔒 Entorno seguro. Los datos perinatales se gestionan bajo estándares de confidencialidad ética médica y Row Level Security (RLS).
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EBF8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BEE3F8',
  },
  iconText: {
    fontSize: 34,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2B6CB0',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 320,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#2B6CB0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B6CB0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    marginRight: 10,
    backgroundColor: '#1A365D',
    width: 26,
    height: 26,
    borderRadius: 13,
    textAlign: 'center',
    lineHeight: 26,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBadge: {
    marginTop: 16,
    backgroundColor: '#F0FFF4',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C6F6D5',
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#22543D',
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginBottom: 14,
  },
  errorText: {
    color: '#C53030',
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 11,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 340,
  },
});

