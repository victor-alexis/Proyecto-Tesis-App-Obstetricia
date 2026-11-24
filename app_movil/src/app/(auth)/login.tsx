/**
 * login.tsx
 * Pantalla Principal de Inicio de Sesión de ClinicalCase (Módulo D1).
 * Diseño neumórfico con Bodoni Moda + DM Sans.
 * Construido exclusivamente con tokens y componentes de `@/components/ui`.
 * Animaciones fluidas de inicio (Splash + entrada escalonada) con Reanimated.
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
  SoftBackground,
  AnimatedWordmark,
  At,
  T,
  useTimeline,
  useKeyboardAwareScroll,
  colors,
  fonts,
} from '@/components/ui';

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_SECONDS = 60;

export default function LoginScreen() {
  const { signInWithGoogle, signInWithPassword, session, isRecovering } = useAuth();
  const pathname = usePathname();
  const t = useTimeline({ once: true }); // Animación completa solo la primera vez por sesión
  const { scrollRef, keyboardHeight, scrollToInput } = useKeyboardAwareScroll();
  const passwordInputRef = useRef<any>(null);

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

  // Redirigir al home únicamente si ya hay sesión autenticada activa y no está en recuperación
  useEffect(() => {
    if (session && pathname === '/login' && !isRecovering) {
      router.replace('/');
    }
  }, [session, pathname, isRecovering]);

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

    try {
      setLoading(true);
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        triggerHaptic(Haptics.NotificationFeedbackType.Error);
        setErrorBanner({
          title: 'Error con Google',
          text: result.error,
        });
      }
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setErrorBanner({
        title: 'Error inesperado',
        text: err?.message || 'No se pudo completar el inicio de sesión con Google.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (isBlocked) return;

    // Validación preliminar de correo
    if (!email.trim()) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setErrorBanner({
        title: 'Correo requerido',
        text: 'Por favor ingresa tu correo institucional o personal.',
      });
      return;
    }

    if (!isValidEmail(email)) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setErrorBanner({
        title: 'Formato de correo no válido',
        text: 'Ingresa una dirección de correo válida (ejemplo: usuario@ulagos.cl).',
      });
      return;
    }

    if (!password) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setErrorBanner({
        title: 'Contraseña requerida',
        text: 'Por favor ingresa tu contraseña.',
      });
      return;
    }

    try {
      setLoading(true);
      setErrorBanner(null);

      const result = await signInWithPassword(email.trim(), password);

      if (result.success) {
        triggerHaptic(Haptics.NotificationFeedbackType.Success);
        // Redirección manejada por AuthContext o useEffect
        router.replace('/');
        return;
      }

      // Manejo específico de errores devueltos
      triggerHaptic(Haptics.NotificationFeedbackType.Error);

      if (result.isEmailNotConfirmed) {
        // Redirigir a verificación OTP (Pantalla D4)
        router.push({
          pathname: '/verify-otp',
          params: { email: email.trim(), returnTo: '/login' },
        });
        return;
      }

      const errText = result.error || '';
      const isRateLimit = errText.toLowerCase().includes('demasiadas solicitudes');
      const isInvalidCredentials =
        errText.toLowerCase().includes('correo o contraseña incorrectos') ||
        errText.toLowerCase().includes('credenciales');

      if (isRateLimit) {
        setErrorBanner({
          title: 'Demasiadas solicitudes',
          text: 'Has superado el límite de intentos permitidos por el servidor. Por favor espera unos minutos antes de volver a intentar.',
        });
        return;
      }

      if (isInvalidCredentials) {
        // Estado D1.2: Error de credenciales y contador de intentos
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
    <View style={styles.root}>
      {/* Fondo suave perlado con olas sutiles */}
      <SoftBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef as any}
            contentContainerStyle={[
              styles.scrollContent,
              keyboardHeight > 0 && { paddingBottom: keyboardHeight + 30 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            <View style={[styles.contentWrap, keyboardHeight > 0 && { justifyContent: 'flex-start' }]}>
              {/* ── Encabezado de Marca Animado (Wordmark letra a letra + Subtítulo) ── */}
              <AnimatedWordmark t={t} size={55} />

              {/* ── Tarjeta Neumórfica (D1 / D1.2) con entrada animada ── */}
              <At t={t} start={T.card} dur={1} dy={70}>
                <NeuCard style={styles.cardContainer}>
                  {/* Barra de acento */}
                  <At t={t} start={T.bar}>
                    <AccentBar />
                  </At>

                  {/* Título: Bienvenido/a */}
                  <At t={t} start={T.title}>
                    <Heading accent="/a">Bienvenido</Heading>
                  </At>

                  <At t={t} start={T.sub} style={styles.cardSubtitleWrap}>
                    <Subtitle>
                      Accede a las herramientas perinatales y a los módulos clínicos.
                    </Subtitle>
                  </At>

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
                      <At t={t} start={T.google} style={styles.googleWrap}>
                        <GoogleButton
                          onPress={handleGoogleLogin}
                          title="Continuar con Google"
                        />
                      </At>

                      <At t={t} start={T.divider} style={styles.dividerWrap}>
                        <OrDivider text="o con tu correo" />
                      </At>
                    </>
                  )}

                  {/* Campos de Entrada con aparición escalonada */}
                  <View
                    style={[
                      styles.formWrap,
                      isCredentialError ? styles.formWrapError : styles.formWrapNormal,
                    ]}
                  >
                    <At t={t} start={T.email}>
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
                        returnKeyType="next"
                        onFocus={() => scrollToInput(120)}
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                      />
                    </At>

                    <At t={t} start={T.pass}>
                      <NeuInput
                        ref={passwordInputRef}
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
                        returnKeyType="go"
                        onFocus={() => scrollToInput(220)}
                        onSubmitEditing={handleEmailLogin}
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
                    </At>
                  </View>

                  {/* Botón Principal de Inicio de Sesión */}
                  <At t={t} start={T.button} style={styles.submitWrap}>
                    <NeuButton
                      title={isBlocked ? `Bloqueado (${blockCountdown}s)` : 'Iniciar sesión'}
                      onPress={handleEmailLogin}
                      loading={loading}
                      disabled={isBlocked || loading}
                    />
                  </At>

                  {/* Enlace Crear una Cuenta (Flujo D2) */}
                  <At t={t} start={T.signup} dy={10} style={styles.footerLinkWrap}>
                    <Text style={styles.footerLinkText}>
                      ¿No tienes una cuenta?{' '}
                      <NeuLink onPress={() => router.push('/register')}>
                        Crear una cuenta
                      </NeuLink>
                    </Text>
                  </At>
                </NeuCard>
              </At>
            </View>

            {/* ── Pie de Página Cifrado y Seguro ── */}
            <At t={t} start={T.footer} dy={8} style={styles.footerWrap}>
              <SecureFooter />
            </At>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safeArea: {
    flex: 1,
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
