/**
 * LoginScreen — ClinicalCase
 * Réplica idéntica y pixel-perfect del diseño de Google Stitch.
 * Implementa fuentes oficiales Plus Jakarta Sans y Playfair Display,
 * orbes bioluminiscentes idénticos, borde luminiscente Shine Border y animación de título.
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

// ─── Ícono Oficial de Google en SVG ───────────────────────────────────────────
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
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
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </Svg>
);

// ─── Ícono Candado Footer ─────────────────────────────────────────────────────
const SecurityLockIcon: React.FC = () => (
  <Svg width={13} height={13} viewBox="0 0 20 20" fill="#FDE047">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
    />
  </Svg>
);

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInWithPassword, session, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const isLoading = loading;
  const c = isDarkMode ? DARK : LIGHT;

  return (
    <View style={[styles.outerContainer, { backgroundColor: c.bgCanvas }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ── Orbes Bioluminiscentes de Fondo (Warm Velvet Glow Orbs) ── */}
      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbTopLeft,
          {
            backgroundColor: isDarkMode ? 'rgba(190, 24, 93, 0.20)' : 'rgba(190, 24, 93, 0.15)',
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbMiddleRight,
          {
            backgroundColor: isDarkMode ? 'rgba(124, 58, 237, 0.20)' : 'rgba(124, 58, 237, 0.15)',
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.ambientOrb,
          styles.orbBottomCenter,
          {
            backgroundColor: isDarkMode ? 'rgba(251, 113, 133, 0.15)' : 'rgba(251, 113, 133, 0.10)',
          },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          {/* Contenedor Mockup de Teléfono (390px centrado) */}
          <View style={styles.phoneFrameContainer}>
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
                    <Sun size={16} color="#FDE047" />
                  ) : (
                    <Moon size={16} color="#2563EB" />
                  )}
                </TouchableOpacity>
              </View>

              {/* ── Cabecera de Marca (ClinicalCase + Sparkles) ── */}
              <View style={styles.header}>
                <View style={styles.brandTitleWrapper}>
                  {/* Sparkle Superior Derecho */}
                  <Text style={[styles.sparkleTopRight, Platform.OS === 'web' && ({ className: 'sparkle-icon' } as any)]}>
                    ✦
                  </Text>
                  {/* Sparkle Inferior Izquierdo */}
                  <Text style={[styles.sparkleBottomLeft, Platform.OS === 'web' && ({ className: 'sparkle-icon' } as any)]}>
                    ✦
                  </Text>

                  {/* Renderizado Web con CSS animado o SVG en Nativo */}
                  {Platform.OS === 'web' ? (
                    <Text
                      style={[
                        styles.brandTitleText,
                        {
                          fontFamily: 'PlayfairDisplay-ExtraBoldItalic',
                        },
                      ]}
                      // @ts-ignore
                      className={isDarkMode ? 'stitch-wave-text-dark' : 'stitch-wave-text'}
                    >
                      ClinicalCase
                    </Text>
                  ) : (
                    <Svg height={46} width={260} viewBox="0 0 260 46">
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
                        fontFamily="PlayfairDisplay-ExtraBoldItalic"
                        fontStyle="italic"
                        fontWeight="800"
                        letterSpacing="-0.5"
                        x="130"
                        y="34"
                        textAnchor="middle"
                      >
                        ClinicalCase
                      </SvgText>
                    </Svg>
                  )}
                </View>

                {/* Subtítulo Clínico */}
                <Text style={[styles.subtitle, { color: c.textSub }]}>
                  Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
                </Text>
              </View>

              {/* ── Tarjeta de Inicio de Sesión con Shine Border ── */}
              <View
                style={[
                  styles.shineCardContainer,
                  Platform.OS === 'web' && ({
                    className: isDarkMode ? 'stitch-shine-border stitch-shine-border-dark' : 'stitch-shine-border',
                  } as any),
                ]}
              >
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

                    {/* Mensaje de Error */}
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

                    {/* Separador */}
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
                      style={[styles.submitButtonTouch, isLoading && styles.disabled]}
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

                    {/* Badge Verde: Admite cuentas institucionales y personales */}
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
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;

// ─── Paletas Oficiales de Stitch ──────────────────────────────────────────────
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrameContainer: {
    width: '100%',
    maxWidth: 390,
    minHeight: Platform.OS === 'web' ? 820 : undefined,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    width: '100%',
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  // ── Orbes Bioluminiscentes ──
  ambientOrb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  orbTopLeft: {
    top: -96,
    left: -80,
    width: 256,
    height: 256,
  },
  orbMiddleRight: {
    top: '33%',
    right: -96,
    width: 288,
    height: 288,
  },
  orbBottomCenter: {
    bottom: -80,
    left: '25%',
    width: 240,
    height: 240,
  },

  // ── Theme Toggle ──
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 4,
    marginTop: Platform.OS === 'android' ? 24 : 4,
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

  // ── Header Branding ──
  header: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  brandTitleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: -4,
    right: -12,
    fontSize: 12,
    color: '#FDE047',
    zIndex: 5,
  },
  sparkleBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -12,
    fontSize: 10,
    color: '#FDA4AF',
    zIndex: 5,
  },
  brandTitleText: {
    fontSize: 34,
    fontFamily: 'PlayfairDisplay-ExtraBoldItalic',
    fontStyle: 'italic',
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 275,
    marginTop: 4,
    letterSpacing: -0.05,
  },

  // ── Tarjeta Modal ──
  shineCardContainer: {
    marginVertical: 6,
    borderRadius: 24,
    shadowColor: 'rgba(96, 165, 250, 0.28)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
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
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 21,
    letterSpacing: -0.2,
    marginBottom: 4,
    textAlign: 'left',
  },
  cardDescription: {
    fontFamily: 'PlusJakartaSans-Regular',
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
    fontFamily: 'PlusJakartaSans-Medium',
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
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
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
    fontFamily: 'PlusJakartaSans-Medium',
    paddingHorizontal: 10,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Campos de formulario
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12.5,
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotPasswordLink: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11.5,
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
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
    height: '100%',
  },
  eyeToggleButton: {
    padding: 6,
  },

  // Botón Submit Iniciar Sesión
  submitButtonTouch: {
    marginTop: 4,
    marginBottom: 14,
  },
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
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  submitBtnArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
  },

  // Badge Verde
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
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 12,
    marginRight: 6,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 11,
    lineHeight: 14,
  },
  badgeBold: {
    fontFamily: 'PlusJakartaSans-Bold',
  },

  // Crear Cuenta
  registerPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  registerPromptText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 12,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerLinkText: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 12,
  },
  registerLinkArrow: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 11,
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
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
  },
  creditsText: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 10,
    color: '#8E7D9E',
    letterSpacing: 0.3,
  },
});
