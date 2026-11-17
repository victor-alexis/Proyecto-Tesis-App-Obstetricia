/**
 * LoginScreen — ClinicalCase
 * Réplica idéntica y pixel-perfect del diseño Google Stitch (HTML + Design Tokens)
 * Totalmente funcional con Supabase Auth (Google OAuth + Email/Password)
 */

import React, { useState, useEffect } from 'react';
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
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
  Path,
} from 'react-native-svg';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// ─── Logotipo oficial de Google en SVG ─────────────────────────────────────────
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </Svg>
);

// ─── Ícono de Candado de Seguridad Footer ───────────────────────────────────────
const SecurityLockIcon: React.FC = () => (
  <Svg width={13} height={13} viewBox="0 0 20 20" fill="#FDE047">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
    />
  </Svg>
);

// ─── Componente Principal ──────────────────────────────────────────────────────
export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInWithPassword, session, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirección si ya hay sesión activa
  useEffect(() => {
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

  const isLoading = loading || authLoading;
  const c = isDarkMode ? DARK : LIGHT;

  return (
    <View style={[styles.outerContainer, { backgroundColor: c.bgCanvas }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ── Orbes de Luz Ambiental (Warm Velvet Orbs del Stitch HTML) ── */}
      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbTopLeft,
          {
            backgroundColor: isDarkMode
              ? 'rgba(190, 24, 93, 0.20)'
              : 'rgba(190, 24, 93, 0.12)',
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbMiddleRight,
          {
            backgroundColor: isDarkMode
              ? 'rgba(124, 58, 237, 0.20)'
              : 'rgba(124, 58, 237, 0.12)',
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbBottomCenter,
          {
            backgroundColor: isDarkMode
              ? 'rgba(251, 113, 133, 0.15)'
              : 'rgba(251, 113, 133, 0.10)',
          },
        ]}
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
            {/* ── Botón Conmutador de Tema (Top Right) ── */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => setIsDarkMode(!isDarkMode)}
                activeOpacity={0.8}
                style={[
                  styles.themeToggleBtn,
                  {
                    backgroundColor: c.btnToggleBg,
                    borderColor: c.btnToggleBorder,
                  },
                ]}
              >
                {isDarkMode ? (
                  <Sun size={17} color="#FDE047" />
                ) : (
                  <Moon size={17} color="#2563EB" />
                )}
              </TouchableOpacity>
            </View>

            {/* ── Cabecera / Branding (ClinicalCase + Sparkles) ── */}
            <View style={styles.header}>
              <View style={styles.brandTitleWrapper}>
                {/* Sparkle Superior Derecho */}
                <Text style={styles.sparkleTopRight}>✦</Text>
                {/* Sparkle Inferior Izquierdo */}
                <Text style={styles.sparkleBottomLeft}>✦</Text>

                {/* Título "ClinicalCase" con Gradiente Wave Multicapa en SVG */}
                <Svg height={44} width={260} viewBox="0 0 260 44">
                  <Defs>
                    <SvgLinearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <Stop offset="0%" stopColor={isDarkMode ? '#FDA4AF' : '#00446e'} />
                      <Stop offset="22%" stopColor={isDarkMode ? '#FFFFFF' : '#2563eb'} />
                      <Stop offset="50%" stopColor={isDarkMode ? '#E879F9' : '#7c3aed'} />
                      <Stop offset="78%" stopColor={isDarkMode ? '#FDE047' : '#ec4899'} />
                      <Stop offset="100%" stopColor={isDarkMode ? '#FDA4AF' : '#0284c7'} />
                    </SvgLinearGradient>
                  </Defs>
                  <SvgText
                    fill="url(#waveGradient)"
                    fontSize={34}
                    fontFamily={Platform.OS === 'ios' ? 'Playfair Display' : 'serif'}
                    fontStyle="italic"
                    fontWeight="800"
                    letterSpacing="-0.5"
                    x="130"
                    y="33"
                    textAnchor="middle"
                  >
                    ClinicalCase
                  </SvgText>
                </Svg>
              </View>

              {/* Subtítulo Clínico */}
              <Text style={[styles.subtitle, { color: c.textSub }]}>
                Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
              </Text>
            </View>

            {/* ── Tarjeta Modal con Shine Border Perimetral ── */}
            <View
              style={[
                styles.shineCardContainer,
                {
                  shadowColor: isDarkMode ? '#BE185D' : '#60A5FA',
                },
              ]}
            >
              {/* Borde gradiente luminiscente de 1.5px */}
              <LinearGradient
                colors={c.shineColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shineBorderGradient}
              >
                <View style={[styles.cardInner, { backgroundColor: c.cardBg }]}>
                  {/* Título de la tarjeta */}
                  <Text style={[styles.cardTitle, { color: c.textTitle }]}>
                    Bienvenido/a
                  </Text>

                  {/* Subtítulo explicativo */}
                  <Text style={[styles.cardDescription, { color: c.textSub }]}>
                    Para acceder a las herramientas perinatales y módulos clínicos, inicia sesión con tu cuenta.
                  </Text>

                  {/* Mensaje de Error si aplica */}
                  {errorMessage && (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>⚠ {errorMessage}</Text>
                    </View>
                  )}

                  {/* Botón: Continuar con Google */}
                  <TouchableOpacity
                    style={[
                      styles.googleButton,
                      {
                        backgroundColor: c.btnGoogle,
                        borderColor: c.btnGoogleBorder,
                      },
                      isLoading && styles.disabled,
                    ]}
                    onPress={handleGoogleLogin}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <View style={styles.googleIconBadge}>
                      <GoogleIcon size={14} />
                    </View>
                    <Text style={[styles.googleButtonText, { color: c.btnGoogleText }]}>
                      Continuar con Google
                    </Text>
                  </TouchableOpacity>

                  {/* Separador "O INGRESA CON TU CORREO" */}
                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: c.dividerColor }]} />
                    <Text style={[styles.dividerText, { color: c.inputPlaceholder }]}>
                      O INGRESA CON TU CORREO
                    </Text>
                    <View style={[styles.dividerLine, { backgroundColor: c.dividerColor }]} />
                  </View>

                  {/* Campo: Correo Institucional / Personal */}
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: c.labelColor }]}>
                      Correo institucional / personal
                    </Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: c.inputBg,
                          borderColor: c.inputBorder,
                        },
                      ]}
                    >
                      <Mail size={16} color="#64748B" style={styles.inputLeftIcon} />
                      <TextInput
                        style={[styles.textInputField, { color: c.inputText }]}
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
                    <View style={styles.passwordLabelRow}>
                      <Text style={[styles.fieldLabel, { color: c.labelColor }]}>
                        Contraseña
                      </Text>
                      <TouchableOpacity
                        onPress={() => router.push('/forgot-password' as any)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.forgotPasswordLink, { color: c.accentBlue }]}>
                          ¿Olvidaste tu contraseña?
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: c.inputBg,
                          borderColor: c.inputBorder,
                        },
                      ]}
                    >
                      <Lock size={16} color="#64748B" style={styles.inputLeftIcon} />
                      <TextInput
                        style={[styles.textInputField, { color: c.inputText, paddingRight: 36 }]}
                        placeholder="••••••••"
                        placeholderTextColor={c.inputPlaceholder}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeToggleButton}
                        activeOpacity={0.7}
                      >
                        {showPassword ? (
                          <EyeOff size={16} color={c.inputPlaceholder} />
                        ) : (
                          <Eye size={16} color={c.inputPlaceholder} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Botón: Iniciar Sesión → */}
                  <TouchableOpacity
                    style={[isLoading && styles.disabled]}
                    onPress={handleEmailLogin}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={c.primaryBtnGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.submitBtnGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                      ) : (
                        <View style={styles.submitRow}>
                          <Text style={styles.submitBtnText}>Iniciar Sesión</Text>
                          <Text style={styles.submitBtnArrow}>→</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Badge de Información de Cuentas */}
                  <View
                    style={[
                      styles.supportedAccountsBadge,
                      {
                        backgroundColor: c.badgeBg,
                        borderColor: c.badgeBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeCheckmark, { color: c.badgeText }]}>✓</Text>
                    <Text style={[styles.badgeText, { color: c.badgeText }]}>
                      Admite cuentas{' '}
                      <Text style={[styles.badgeBold, { color: c.badgeText }]}>
                        institucionales
                      </Text>{' '}
                      y{' '}
                      <Text style={[styles.badgeBold, { color: c.badgeText }]}>
                        personales
                      </Text>
                    </Text>
                  </View>

                  {/* Enlace: Crear una Cuenta */}
                  <View style={styles.registerPromptRow}>
                    <Text style={[styles.registerPromptText, { color: c.textSub }]}>
                      ¿No tienes una cuenta?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push('/register' as any)}
                      activeOpacity={0.7}
                      style={styles.registerLinkContainer}
                    >
                      <Text style={[styles.registerLinkText, { color: c.primaryBtnColor }]}>
                        Crear una cuenta
                      </Text>
                      <Text style={[styles.registerLinkArrow, { color: c.primaryBtnColor }]}>
                        →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* ── Pie de Página (Seguridad y Créditos) ── */}
            <View style={styles.footer}>
              <View style={styles.securityNoticeRow}>
                <SecurityLockIcon />
                <Text style={[styles.securityNoticeText, { color: c.footerText }]}>
                  Conexión clínica cifrada y segura
                </Text>
              </View>
              <Text style={styles.creditsText}>
                Design by Victor Gonzalez & Benjamin Torres
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;

// ─── Paletas Oficiales del Design System (Light & Dark) ────────────────────────
const LIGHT = {
  bgCanvas: '#F3F7FC',
  cardBg: '#FFFFFF',
  cardBorder: '#D8E4F2',
  textTitle: '#0F172A',
  textSub: '#64748B',
  labelColor: '#1E293B',
  accentBlue: '#2563EB',
  btnGoogle: '#2563EB',
  btnGoogleText: '#FFFFFF',
  btnGoogleBorder: 'transparent',
  dividerColor: '#E2E8F0',
  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputText: '#1E293B',
  inputPlaceholder: '#94A3B8',
  badgeBg: '#ECFDF5',
  badgeBorder: '#A7F3D0',
  badgeText: '#047857',
  primaryBtnGradient: ['#00446e', '#0d5c91'] as const,
  primaryBtnColor: '#0d5c91',
  btnToggleBg: '#FFFFFF',
  btnToggleBorder: '#D8E4F2',
  footerText: '#64748B',
  shineColors: ['#60a5fa', '#93c5fd', '#818cf8', '#38bdf8', '#60a5fa'] as const,
};

const DARK = {
  bgCanvas: '#130F1A',
  cardBg: '#1C1527',
  cardBorder: '#3A2449',
  textTitle: '#FDF2F8',
  textSub: '#D1B3DB',
  labelColor: '#F1F5F9',
  accentBlue: '#F472B6',
  btnGoogle: '#2A1D3B',
  btnGoogleText: '#FDF2F8',
  btnGoogleBorder: '#4A2C5E',
  dividerColor: '#3A2449',
  inputBg: '#181122',
  inputBorder: '#4A2C5E',
  inputText: '#F1F5F9',
  inputPlaceholder: '#9481A4',
  badgeBg: 'rgba(244, 114, 182, 0.12)',
  badgeBorder: 'rgba(244, 114, 182, 0.3)',
  badgeText: '#F472B6',
  primaryBtnGradient: ['#BE185D', '#7C3AED'] as const,
  primaryBtnColor: '#F472B6',
  btnToggleBg: '#221631',
  btnToggleBorder: '#4A2C5E',
  footerText: '#8E7D9E',
  shineColors: ['#FB7185', '#C084FC', '#FDE047', '#FB7185'] as const,
};

// ─── Estilos Tipográficos y Estructurales ───────────────────────────────────────
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 20,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  // ── Luces Ambientales (Orbes) ──
  ambientOrb: {
    position: 'absolute',
    borderRadius: 200,
  },
  orbTopLeft: {
    top: -80,
    left: -70,
    width: 260,
    height: 260,
  },
  orbMiddleRight: {
    top: '28%',
    right: -80,
    width: 290,
    height: 290,
  },
  orbBottomCenter: {
    bottom: -60,
    left: '20%',
    width: 250,
    height: 250,
  },

  // ── Botón Top Right (Theme Toggle) ──
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 2,
    marginTop: Platform.OS === 'android' ? 28 : 2,
    zIndex: 30,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

  // ── Header / Branding ──
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  brandTitleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 2,
    right: 8,
    fontSize: 12,
    color: '#FDE047',
    zIndex: 5,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    fontSize: 10,
    color: '#FDA4AF',
    zIndex: 5,
  },
  subtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
    maxWidth: 275,
    marginTop: 2,
    letterSpacing: -0.1,
  },

  // ── Shine Card Wrapper ──
  shineCardContainer: {
    marginVertical: 4,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 25,
    elevation: 8,
  },
  shineBorderGradient: {
    borderRadius: 24,
    padding: 1.5,
  },
  cardInner: {
    borderRadius: 22.5,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
    textAlign: 'left',
  },
  cardDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 18,
    textAlign: 'left',
  },

  // Error Alert
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 16,
    gap: 10,
  },
  googleIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.65,
  },

  // Separador
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Campos de formulario
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotPasswordLink: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
    height: '100%',
  },
  eyeToggleButton: {
    padding: 6,
  },

  // Botón Submit Iniciar Sesión
  submitBtnGradient: {
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00446E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
    marginTop: 2,
    marginBottom: 14,
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtnArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
  },

  // Badge de Cuentas Soportadas
  supportedAccountsBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeCheckmark: {
    fontWeight: '700',
    fontSize: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
  },
  badgeBold: {
    fontWeight: '700',
  },

  // Enlace Crear Cuenta
  registerPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  registerPromptText: {
    fontSize: 12,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 12,
    fontWeight: '600',
  },
  registerLinkArrow: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },

  // ── Footer ──
  footer: {
    alignItems: 'center',
    marginTop: 12,
    paddingBottom: 6,
  },
  securityNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  securityNoticeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  creditsText: {
    fontSize: 10,
    color: '#8E7D9E',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
