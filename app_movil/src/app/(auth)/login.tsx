/**
 * login.tsx
 * Pantalla Principal de Inicio de Sesión de ClinicalCase (Módulo D1).
 * Diseño neumórfico con Bodoni Moda + DM Sans.
 * Construido exclusivamente con tokens y componentes de `@/ui/Neu`.
 * Estados: Normal, Error de Credenciales (D1.2), Cargando, Bloqueo Temporal.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/authErrors';
import {
  Wordmark,
  AccentBar,
  Heading,
  Subtitle,
  NeuCard,
  NeuInput,
  NeuButton,
  GoogleButton,
  OrDivider,
  NeuLink,
  ErrorBanner,
  SecureFooter,
  MailIcon,
  LockIcon,
  colors,
  fonts,
} from '@/components/ui';

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_SECONDS = 60;

export default function LoginScreen() {
  const { signInWithGoogle, signInWithPassword, session } = useAuth();
  const pathname = usePathname();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados de error y bloqueo
  const [isCredentialError, setIsCredentialError] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockCountdown, setBlockCountdown] = useState(0);
  const [errorBanner, setErrorBanner] = useState<{ title: string; text?: string } | null>(null);

  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Redirigir al home únicamente si ya hay sesión autenticada activa y se encuentra en /login
  useEffect(() => {
    if (session && pathname === '/login') {
      router.replace('/');
    }
  }, [session, pathname]);

  // Manejo del contador regresivo en estado de bloqueo temporal
  useEffect(() => {
    if (isBlocked && blockCountdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setBlockCountdown((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttemptsLeft(MAX_ATTEMPTS);
            setErrorBanner(null);
            setIsCredentialError(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [isBlocked, blockCountdown]);

  const triggerHaptic = (type: Haptics.NotificationFeedbackType) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(type).catch(() => {});
    }
  };

  const handleGoogleLogin = async () => {
    if (isBlocked) return;
    setErrorBanner(null);
    setIsCredentialError(false);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        triggerHaptic(Haptics.NotificationFeedbackType.Error);
        setErrorBanner({
          title: 'Error de autenticación',
          text: result.error,
        });
      } else {
        triggerHaptic(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setErrorBanner({
        title: 'Error con Google',
        text: err?.message || 'No fue posible completar el inicio de sesión.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (isBlocked) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setErrorBanner({
        title: 'Datos incompletos',
        text: 'Por favor ingresa tu correo electrónico y tu contraseña.',
      });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setErrorBanner({
        title: 'Formato inválido',
        text: 'Por favor ingresa un correo electrónico institucional o personal válido.',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithPassword(trimmedEmail, password);

      if (result.success) {
        triggerHaptic(Haptics.NotificationFeedbackType.Success);
        setErrorBanner(null);
        setIsCredentialError(false);
        setAttemptsLeft(MAX_ATTEMPTS);
        router.replace('/');
        return;
      }

      // Si el correo no ha sido verificado, redirigir a verificación OTP (D4)
      if (result.isEmailNotConfirmed) {
        triggerHaptic(Haptics.NotificationFeedbackType.Warning);
        router.push({
          pathname: '/verify-otp',
          params: {
            email: trimmedEmail,
            type: 'signup',
          },
        } as any);
        return;
      }

      triggerHaptic(Haptics.NotificationFeedbackType.Error);

      const errLower = (result.error || '').toLowerCase();
      const isCredFail =
        errLower.includes('correo o contraseña') ||
        errLower.includes('invalid login credentials') ||
        errLower.includes('invalid_credentials') ||
        errLower.includes('credenciales');

      const isRateLimit =
        errLower.includes('rate limit') ||
        errLower.includes('demasiadas solicitudes') ||
        errLower.includes('over_request_rate_limit');

      if (isRateLimit) {
        setIsBlocked(true);
        setBlockCountdown(BLOCK_DURATION_SECONDS);
        setErrorBanner({
          title: 'Acceso bloqueado temporalmente',
          text: `Demasiadas solicitudes. Por seguridad, espera ${BLOCK_DURATION_SECONDS} segundos antes de volver a intentar.`,
        });
        return;
      }

      if (isCredFail) {
        const remaining = attemptsLeft - 1;
        if (remaining <= 0) {
          setIsBlocked(true);
          setBlockCountdown(BLOCK_DURATION_SECONDS);
          setIsCredentialError(true);
          setErrorBanner({
            title: 'Acceso bloqueado temporalmente',
            text: `Has superado el límite de intentos. Por seguridad, espera ${BLOCK_DURATION_SECONDS} segundos.`,
          });
        } else {
          setAttemptsLeft(remaining);
          setIsCredentialError(true);
          setErrorBanner({
            title: 'Correo o contraseña incorrectos',
            text: `Revisa tus datos. Te ${remaining === 1 ? 'queda 1 intento' : `quedan ${remaining} intentos`} antes de un bloqueo temporal.`,
          });
        }
      } else {
        setErrorBanner({
          title: 'Error de inicio de sesión',
          text: result.error || 'Ocurrió un error al verificar tus datos.',
        });
      }
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setErrorBanner({
        title: 'Error de conexión',
        text: err?.message || 'No se pudo conectar al servidor.',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCredentialError = () => {
    if (isCredentialError) {
      setIsCredentialError(false);
    }
    if (errorBanner && !isBlocked) {
      setErrorBanner(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrap}>
            {/* ── Encabezado de Marca (Wordmark + Subtítulo) ── */}
            <View style={styles.brandContainer}>
              <Wordmark size={55} />
              <Text style={styles.brandSubtitle}>
                Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
              </Text>
            </View>

            {/* ── Tarjeta Neumórfica (D1 / D1.2) ── */}
            <NeuCard style={styles.cardContainer}>
              {/* Barra de acento */}
              <AccentBar />

              {/* Título: Bienvenido/a */}
              <Heading accent="/a">Bienvenido</Heading>

              <View style={styles.cardSubtitleWrap}>
                <Subtitle>
                  Accede a las herramientas perinatales y a los módulos clínicos.
                </Subtitle>
              </View>

              {/* Banner de error / aviso (D1.2 o bloqueo) */}
              {errorBanner && (
                <View style={styles.bannerWrap}>
                  <ErrorBanner
                    title={errorBanner.title}
                    text={
                      isBlocked && blockCountdown > 0
                        ? `${errorBanner.text} (${blockCountdown}s restantes)`
                        : errorBanner.text
                    }
                  />
                </View>
              )}

              {/* Botón de Google y Separador (Solo visible en estado normal sin error de credenciales) */}
              {!isCredentialError && (
                <>
                  <View style={styles.googleWrap}>
                    <GoogleButton
                      onPress={handleGoogleLogin}
                      title="Continuar con Google"
                    />
                  </View>

                  <View style={styles.dividerWrap}>
                    <OrDivider text="o con tu correo" />
                  </View>
                </>
              )}

              {/* Campos de Entrada */}
              <View
                style={[
                  styles.formWrap,
                  isCredentialError ? styles.formWrapError : styles.formWrapNormal,
                ]}
              >
                <NeuInput
                  label="Correo institucional o personal"
                  icon={<MailIcon />}
                  placeholder="nombre@ulagos.cl"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    clearCredentialError();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />

                <NeuInput
                  label="Contraseña"
                  icon={
                    <LockIcon
                      color={isCredentialError ? colors.errorDark : colors.muted}
                    />
                  }
                  placeholder="Tu contraseña"
                  secure
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    clearCredentialError();
                  }}
                  autoComplete="current-password"
                  rightLabel={
                    <NeuLink
                      italic
                      onPress={() => router.push('/forgot-password')}
                    >
                      ¿Olvidaste tu contraseña?
                    </NeuLink>
                  }
                  error={isCredentialError ? 'Contraseña incorrecta' : undefined}
                />
              </View>

              {/* Botón Principal de Inicio de Sesión */}
              <View style={styles.submitWrap}>
                <NeuButton
                  title={isBlocked ? `Bloqueado (${blockCountdown}s)` : 'Iniciar sesión'}
                  onPress={handleEmailLogin}
                  loading={loading}
                  disabled={isBlocked || loading}
                />
              </View>

              {/* Enlace Crear una Cuenta (Flujo D2) */}
              <View style={styles.footerLinkWrap}>
                <Text style={styles.footerLinkText}>
                  ¿No tienes una cuenta?{' '}
                  <NeuLink onPress={() => router.push('/register')}>
                    Crear una cuenta
                  </NeuLink>
                </Text>
              </View>
            </NeuCard>
          </View>

          {/* ── Pie de Página Cifrado y Seguro ── */}
          <View style={styles.footerWrap}>
            <SecureFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
    gap: 26,
    paddingVertical: 10,
  },
  brandContainer: {
    alignItems: 'center',
    gap: 8,
  },
  brandSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 270,
  },
  cardContainer: {
    width: '100%',
  },
  cardSubtitleWrap: {
    marginTop: 8,
  },
  bannerWrap: {
    marginTop: 18,
  },
  googleWrap: {
    marginTop: 20,
  },
  dividerWrap: {
    marginTop: 20,
  },
  formWrap: {
    gap: 16,
  },
  formWrapNormal: {
    marginTop: 20,
  },
  formWrapError: {
    marginTop: 18,
  },
  submitWrap: {
    marginTop: 24,
  },
  footerLinkWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerLinkText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  footerWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
});
