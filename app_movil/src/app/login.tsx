import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { ShineBorder } from '../components/ui';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithPassword, session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirigir al dashboard si ya hay sesión
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

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    const result = await signInWithPassword(email, password);
    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Fondos de luz ambiental (Glow Orbs) */}
      <View style={styles.ambientTopLeft} />
      <View style={styles.ambientMiddleRight} />
      <View style={styles.ambientBottomCenter} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera / Branding: ClinicalCase con Sparkles */}
        <View style={styles.header}>
          {/* Botón flotante superior derecho (Moon icon del mockup) */}
          <View style={styles.themeTogglePlaceholder}>
            <View style={styles.themeCircle}>
              <Ionicons name="moon" size={14} color="#2563EB" />
            </View>
          </View>

          {/* Título de la app con destellos */}
          <View style={styles.titleContainer}>
            <Text style={styles.sparkleTopRight}>✦</Text>
            <Text style={styles.sparkleBottomLeft}>✦</Text>
            <Text style={styles.brandTitle}>ClinicalCase</Text>
          </View>

          {/* Subtítulo clínico */}
          <Text style={styles.subtitle}>
            Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
          </Text>
        </View>

        {/* Tarjeta de Inicio de Sesión con ShineBorder */}
        <ShineBorder
          borderRadius={26}
          borderWidth={2}
          duration={9}
          colors={['#60A5FA', '#93C5FD', '#38BDF8', '#60A5FA']}
          style={styles.shineWrapper}
          contentStyle={styles.cardContent}
        >
          {/* Título y descripción de la tarjeta */}
          <Text style={styles.cardTitle}>Bienvenido/a</Text>
          <Text style={styles.cardDescription}>
            Para acceder a las herramientas perinatales y módulos clínicos, inicia sesión con tu cuenta.
          </Text>

          {/* Mensaje de Error si ocurre */}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={14} color="#DC2626" style={styles.errorIcon} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Botón oficial de Google Sign-In */}
          <TouchableOpacity
            style={[styles.googleButton, (loading || authLoading) && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={loading || authLoading}
            activeOpacity={0.88}
          >
            <View style={styles.googleIconBadge}>
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  fill="#4285F4"
                />
                <Path
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  fill="#34A853"
                />
                <Path
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  fill="#FBBC05"
                />
                <Path
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  fill="#EA4335"
                />
              </Svg>
            </View>
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          {/* Separador "O INGRESA CON TU CORREO" */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O INGRESA CON TU CORREO</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Campo Correo Institucional / Personal */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo institucional / personal</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="usuario@gmail.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={16} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { paddingRight: 36 }]}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
                activeOpacity={0.7}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={16}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón Primario: Iniciar Sesión → */}
          <TouchableOpacity
            style={[styles.submitButton, (loading || authLoading) && styles.buttonDisabled]}
            onPress={handleEmailLogin}
            disabled={loading || authLoading}
            activeOpacity={0.88}
          >
            {loading || authLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.submitContent}>
                <Text style={styles.submitButtonText}>Iniciar Sesión</Text>
                <Text style={styles.submitArrow}>→</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Badge Informativo de Cuentas */}
          <View style={styles.infoBadge}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.infoBadgeText}>
              Admite cuentas <Text style={styles.boldText}>institucionales</Text> y <Text style={styles.boldText}>personales</Text>
            </Text>
          </View>

          {/* Enlace: Crear una cuenta → */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>¿No tienes una cuenta?</Text>
            <TouchableOpacity style={styles.registerLinkContainer} activeOpacity={0.7}>
              <Text style={styles.registerLinkText}>Crear una cuenta</Text>
              <Text style={styles.registerArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </ShineBorder>

        {/* Pie de Página: Seguridad y Créditos de Tesis */}
        <View style={styles.footer}>
          <View style={styles.securityRow}>
            <Ionicons name="lock-closed" size={12} color="#EAB308" />
            <Text style={styles.securityText}>Conexión clínica cifrada y segura</Text>
          </View>
          <Text style={styles.authorText}>
            Design by Victor Gonzalez & Benjamin Torres
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F7FC',
    position: 'relative',
  },
  // Orbes ambientales tenues de fondo
  ambientTopLeft: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(190, 24, 93, 0.05)',
  },
  ambientMiddleRight: {
    position: 'absolute',
    top: '30%',
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
  },
  ambientBottomCenter: {
    position: 'absolute',
    bottom: -40,
    left: '25%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(56, 189, 248, 0.04)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    position: 'relative',
    width: '100%',
  },
  themeTogglePlaceholder: {
    position: 'absolute',
    top: -4,
    right: 0,
    zIndex: 10,
  },
  themeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E4F2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: -6,
    right: -14,
    fontSize: 13,
    color: '#FDE047',
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -14,
    fontSize: 11,
    color: '#FDA4AF',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#0F2444',
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 12.5,
    color: '#627D98',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 4,
  },
  shineWrapper: {
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 5,
    marginVertical: 6,
  },
  cardContent: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
  },
  googleButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  googleIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 9.5,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  inputGroup: {
    marginBottom: 13,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  forgotPasswordText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#2563EB',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    paddingVertical: 0,
    height: '100%',
  },
  eyeIconContainer: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: '#0D5C91',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00446E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 6,
    marginBottom: 14,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  submitArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
  },
  infoBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  checkmark: {
    color: '#047857',
    fontWeight: '700',
    marginRight: 6,
    fontSize: 12,
  },
  infoBadgeText: {
    fontSize: 11,
    color: '#047857',
  },
  boldText: {
    fontWeight: '700',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  registerPrompt: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 5,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D5C91',
  },
  registerArrow: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D5C91',
    marginLeft: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 14,
    paddingBottom: 4,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  authorText: {
    fontSize: 10,
    color: '#8E7D9E',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
