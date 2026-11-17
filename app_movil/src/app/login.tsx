/**
 * LoginScreen — ClinicalCase
 * Diseño fiel al mockup de Google Stitch.
 * Auth integrado con AuthContext (signInWithGoogle + signInWithPassword).
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// ─── Ícono SVG oficial de Google ─────────────────────────────────────────────
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </Svg>
);

// ─── Componente principal ─────────────────────────────────────────────────────
export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInWithPassword, session, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirigir si ya hay sesión
  React.useEffect(() => {
    if (session) router.replace('/');
  }, [session]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoading(true);
    const result = await signInWithGoogle();
    if (!result.success && result.error) setErrorMessage(result.error);
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
    if (!result.success && result.error) setErrorMessage(result.error);
    setLoading(false);
  };

  const isLoading = loading || authLoading;

  // ── Colores adaptativos según modo ────────────────────────────────────────
  const c = isDarkMode ? DARK : LIGHT;

  return (
    <View style={[styles.outerContainer, { backgroundColor: c.bgCanvas }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Gradiente ambiental de fondo */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#0a0b10', '#13111c', '#08090d']
            : ['#f8f9fe', '#f2f5fd', '#e9effc']
        }
        style={StyleSheet.absoluteFill}
      />

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
            {/* ── Botón flotante de tema ─────────────────────────────────── */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => setIsDarkMode(!isDarkMode)}
                activeOpacity={0.8}
                style={[
                  styles.themeButton,
                  { backgroundColor: c.cardBg, borderColor: c.cardBorder },
                ]}
              >
                {isDarkMode ? (
                  <Sun size={19} color="#FBBF24" />
                ) : (
                  <Moon size={19} color="#0d5c91" />
                )}
              </TouchableOpacity>
            </View>

            {/* ── Cabecera de marca ─────────────────────────────────────── */}
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.sparkleLeft}>✦</Text>
                <Text
                  style={[styles.brandTitle, { color: c.textTitle }]}
                >
                  ClinicalCase
                </Text>
                <Text style={styles.sparkleRight}>✦</Text>
              </View>
              <Text style={[styles.subtitle, { color: c.textSub }]}>
                Sistema de Soporte a la Decisión Clínica{'\n'}y Seguimiento Perinatal
              </Text>
            </View>

            {/* ── Tarjeta principal con borde gradiente ────────────────── */}
            <View style={styles.cardWrapper}>
              {/* Borde exterior (gradiente animado simulado con LinearGradient) */}
              <LinearGradient
                colors={['#60a5fa', '#818cf8', '#34d399', '#60a5fa']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradientBorder}
              >
                <View
                  style={[
                    styles.cardInner,
                    {
                      backgroundColor: c.cardBg,
                      shadowColor: isDarkMode ? '#be185d' : '#2563eb',
                    },
                  ]}
                >
                  {/* Título de bienvenida */}
                  <Text style={[styles.cardTitle, { color: c.textTitle }]}>
                    Bienvenido/a
                  </Text>
                  <Text style={[styles.cardDescription, { color: c.textSub }]}>
                    Para acceder a las herramientas perinatales y módulos clínicos, inicia sesión con tu cuenta.
                  </Text>

                  {/* Error */}
                  {errorMessage && (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>⚠ {errorMessage}</Text>
                    </View>
                  )}

                  {/* Botón de Google */}
                  <TouchableOpacity
                    style={[
                      styles.googleButton,
                      {
                        backgroundColor: c.btnGoogleBg,
                        borderColor: c.btnGoogleBorder,
                      },
                      isLoading && styles.disabled,
                    ]}
                    onPress={handleGoogleLogin}
                    disabled={isLoading}
                    activeOpacity={0.88}
                  >
                    <View style={styles.googleIconCircle}>
                      <GoogleIcon size={16} />
                    </View>
                    <Text style={[styles.googleButtonText, { color: c.btnGoogleText }]}>
                      Continuar con Google
                    </Text>
                  </TouchableOpacity>

                  {/* Separador */}
                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: c.divider }]} />
                    <Text style={[styles.dividerText, { color: c.textSub }]}>
                      O INGRESA CON TU CORREO
                    </Text>
                    <View style={[styles.dividerLine, { backgroundColor: c.divider }]} />
                  </View>

                  {/* Campo: Correo */}
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: c.textTitle }]}>
                      Correo institucional / personal
                    </Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        { backgroundColor: c.inputBg, borderColor: c.inputBorder },
                      ]}
                    >
                      <Mail size={15} color={c.textSub} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.textInput, { color: c.inputText }]}
                        placeholder="usuario@gmail.com"
                        placeholderTextColor={c.inputPlaceholder}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>

                  {/* Campo: Contraseña */}
                  <View style={styles.fieldGroup}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.fieldLabel, { color: c.textTitle }]}>
                        Contraseña
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.push('/forgot-password' as any)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        styles.inputWrapper,
                        { backgroundColor: c.inputBg, borderColor: c.inputBorder },
                      ]}
                    >
                      <Lock size={15} color={c.textSub} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.textInput, { color: c.inputText, paddingRight: 36 }]}
                        placeholder="••••••••"
                        placeholderTextColor={c.inputPlaceholder}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeBtn}
                        activeOpacity={0.7}
                      >
                        {showPassword ? (
                          <EyeOff size={15} color={c.inputPlaceholder} />
                        ) : (
                          <Eye size={15} color={c.inputPlaceholder} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Botón: Iniciar Sesión */}
                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.disabled]}
                    onPress={handleEmailLogin}
                    disabled={isLoading}
                    activeOpacity={0.88}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <View style={styles.submitRow}>
                        <Text style={styles.submitText}>Iniciar Sesión</Text>
                        <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Badge verde */}
                  <View style={styles.infoBadge}>
                    <ShieldCheck size={13} color="#047857" style={{ marginRight: 6 }} />
                    <Text style={styles.infoBadgeText}>
                      Admite cuentas{' '}
                      <Text style={styles.boldGreen}>institucionales</Text>
                      {' '}y{' '}
                      <Text style={styles.boldGreen}>personales</Text>
                    </Text>
                  </View>

                  {/* Crear cuenta */}
                  <View style={styles.registerRow}>
                    <Text style={[styles.registerPrompt, { color: c.textSub }]}>
                      ¿No tienes una cuenta?{'  '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push('/register' as any)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.registerLink}>Crear una cuenta →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* ── Pie de página ─────────────────────────────────────────── */}
            <View style={styles.footer}>
              <Text style={styles.footerSecurity}>🔒 Conexión clínica cifrada y segura</Text>
              <Text style={[styles.footerCredits, { color: c.footerText }]}>
                Design by Victor Gonzalez &amp; Benjamin Torres
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;

// ─── Paletas de color ─────────────────────────────────────────────────────────
const LIGHT = {
  bgCanvas: '#F3F7FC',
  cardBg: '#FFFFFF',
  cardBorder: '#D8E4F2',
  textTitle: '#0F1D38',
  textSub: '#526581',
  btnGoogleBg: '#2563EB',
  btnGoogleText: '#FFFFFF',
  btnGoogleBorder: 'transparent',
  divider: '#E2E8F0',
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputText: '#0F1D38',
  inputPlaceholder: '#94A3B8',
  footerText: '#64748B',
};

const DARK = {
  bgCanvas: '#130F1A',
  cardBg: '#1C1527',
  cardBorder: '#3A2449',
  textTitle: '#FDF2F8',
  textSub: '#D1B3DB',
  btnGoogleBg: '#2A1D3B',
  btnGoogleText: '#FDF2F8',
  btnGoogleBorder: '#4A2C5E',
  divider: '#3A2449',
  inputBg: '#181122',
  inputBorder: '#4A2C5E',
  inputText: '#F1F5F9',
  inputPlaceholder: '#9481A4',
  footerText: '#8E7D9E',
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
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
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    minHeight: '100%',
    justifyContent: 'space-between',
  },

  // Top bar (tema)
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 4,
    marginTop: Platform.OS === 'android' ? 32 : 4,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Encabezado / branding
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sparkleLeft: {
    fontSize: 16,
    color: '#FDA4AF',
    marginTop: 6,
  },
  sparkleRight: {
    fontSize: 14,
    color: '#FDE047',
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
    maxWidth: 270,
  },

  // Tarjeta con borde gradiente
  cardWrapper: {
    marginVertical: 4,
    borderRadius: 26,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 6,
  },
  cardGradientBorder: {
    borderRadius: 26,
    padding: 1.5,
  },
  cardInner: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 18,
  },

  // Error
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
  },

  // Botón Google
  googleButton: {
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
    gap: 10,
  },
  googleIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: { opacity: 0.65 },

  // Separador
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.8,
  },

  // Campos de entrada
  fieldGroup: { marginBottom: 13 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#2563EB',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: { marginRight: 10 },
  textInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
    height: '100%',
  },
  eyeBtn: { padding: 6 },

  // Botón: Iniciar Sesión
  submitButton: {
    backgroundColor: '#0D5C91',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00446E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
    marginTop: 4,
    marginBottom: 14,
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },

  // Badge verde
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
  infoBadgeText: {
    fontSize: 11,
    color: '#047857',
  },
  boldGreen: {
    fontWeight: '700',
    color: '#047857',
  },

  // Crear cuenta
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  registerPrompt: {
    fontSize: 12,
  },
  registerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D5C91',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 14,
    paddingBottom: 4,
    gap: 3,
  },
  footerSecurity: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  footerCredits: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
