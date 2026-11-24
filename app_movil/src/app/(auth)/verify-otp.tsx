/**
 * verify-otp.tsx
 * Pantalla de Verificación de Identidad por Código OTP de 6 dígitos (Módulo D4 y D4.2).
 * Diseño neumórfico con Bodoni Moda + DM Sans.
 * Construido exclusivamente con tokens y componentes de `@/ui/Neu`.
 * Soporta flujos de:
 * - 'signup': Confirmación de registro de usuario nuevo.
 * - 'recovery': Verificación para restablecer contraseña (D3).
 * Estados: Normal (D4), Código Incorrecto (D4.2 con aro rojo y badge error), Código Vencido, Cooldown de reenvío.
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
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/context/AuthContext';
import {
  BackButton,
  IconPlate,
  AccentBar,
  Heading,
  Subtitle,
  NeuCard,
  NeuButton,
  NeuLink,
  OtpInput,
  SecureFooter,
  ShieldIcon,
  InfoIcon,
  SoftBackground,
  At,
  useScreenTimeline,
  T_FAST,
  colors,
  fonts,
} from '@/components/ui';

const MAX_ATTEMPTS = 3;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ email?: string; type?: string }>();
  const email = params.email || '';
  const type = params.type === 'recovery' ? 'recovery' : 'signup';
  const isRecovery = type === 'recovery';
  const t = useScreenTimeline();

  const {
    verifySignupOtp,
    resendSignupOtp,
    verifyRecoveryOtp,
    sendPasswordResetOtp,
  } = useAuth();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpError, setIsOtpError] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Temporizador de reenvío
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setTimeout(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  const triggerHaptic = (hapticType: Haptics.NotificationFeedbackType) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(hapticType).catch(() => {});
    }
  };

  const obfuscateEmail = (emailStr: string) => {
    if (!emailStr) return 'tu correo';
    const parts = emailStr.split('@');
    if (parts.length !== 2) return emailStr;
    const [user, domain] = parts;
    if (user.length <= 1) return `${user}•••••@${domain}`;
    return `${user[0]}•••••@${domain}`;
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleVerify = async () => {
    if (code.length < 6) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setErrorMessage('Por favor ingresa los 6 dígitos del código.');
      setIsOtpError(true);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      if (isRecovery) {
        const result = await verifyRecoveryOtp(email, code);

        if (!result.success) {
          triggerHaptic(Haptics.NotificationFeedbackType.Error);
          handleVerificationFailure(result.error);
          return;
        }

        triggerHaptic(Haptics.NotificationFeedbackType.Success);
        // Flujo D3.2: definir nueva contraseña
        router.replace('/reset-password');
      } else {
        const result = await verifySignupOtp(email, code);

        if (!result.success) {
          triggerHaptic(Haptics.NotificationFeedbackType.Error);
          handleVerificationFailure(result.error);
          return;
        }

        triggerHaptic(Haptics.NotificationFeedbackType.Success);
        // Cuenta confirmada con éxito, ingresar al Home
        router.replace('/');
      }
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(err?.message || 'Error al validar el código.');
      setIsOtpError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationFailure = (errorStr?: string) => {
    const errLower = (errorStr || '').toLowerCase();

    if (errLower.includes('expired') || errLower.includes('venció') || errLower.includes('caducado')) {
      setIsOtpError(true);
      setErrorMessage('El código ha caducado. Por favor solicita uno nuevo.');
      return;
    }

    const remaining = attemptsLeft - 1;
    setAttemptsLeft(remaining);
    setIsOtpError(true);

    if (remaining <= 0) {
      setErrorMessage('Has superado el límite de intentos. Por favor solicita un nuevo código.');
    } else {
      setErrorMessage(
        `Código incorrecto. Te ${remaining === 1 ? 'queda 1 intento' : `quedan ${remaining} intentos`}.`
      );
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setErrorMessage(null);
    setIsOtpError(false);
    setAttemptsLeft(MAX_ATTEMPTS);
    setCode('');

    try {
      if (isRecovery) {
        const res = await sendPasswordResetOtp(email);
        if (!res.success) {
          triggerHaptic(Haptics.NotificationFeedbackType.Error);
          setErrorMessage(res.error || 'No se pudo reenviar el código.');
          return;
        }
      } else {
        const res = await resendSignupOtp(email);
        if (!res.success) {
          triggerHaptic(Haptics.NotificationFeedbackType.Error);
          setErrorMessage(res.error || 'No se pudo reenviar el código.');
          return;
        }
      }

      triggerHaptic(Haptics.NotificationFeedbackType.Success);
      setSuccessNotice('¡Nuevo código enviado a tu bandeja de entrada!');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(err?.message || 'Error al solicitar el reenvío.');
    }
  };

  return (
    <View style={styles.root}>
      <SoftBackground />

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
            {/* ── Barra Superior con Botón Volver ── */}
            <At t={t} start={T_FAST.topBar} dy={8}>
              <View style={styles.topBar}>
                <BackButton onPress={() => router.back()} />
                <View style={styles.topBarSpacer} />
              </View>
            </At>

            {/* ── Tarjeta Neumórfica Central (D4 / D4.2) ── */}
            <View style={styles.cardWrapper}>
              <At t={t} start={T_FAST.card} dur={0.45} dy={24}>
                <NeuCard style={styles.card}>
                  {/* Placa con escudo: insignia accent en estado normal, error en D4.2 */}
                  <At t={t} start={T_FAST.plate}>
                    <IconPlate badge={isOtpError ? 'error' : 'accent'}>
                      <ShieldIcon size={30} color={colors.text} />
                    </IconPlate>
                  </At>

                  {/* Título y subtítulo */}
                  <At t={t} start={T_FAST.header} style={styles.headerWrap}>
                    <AccentBar center />
                    <Heading accent="identidad" center>
                      Verifica tu{' '}
                    </Heading>
                    <View style={styles.subtitleWrap}>
                      <Subtitle center>
                        Ingresa el código de 6 dígitos que enviamos a{' '}
                        <Text style={styles.emailHighlight}>
                          {obfuscateEmail(email)}
                        </Text>
                        .
                      </Subtitle>
                    </View>
                  </At>

                  {/* Entrada OTP de 6 dígitos */}
                  <At t={t} start={T_FAST.field1} style={styles.otpWrap}>
                    <OtpInput
                      value={code}
                      onChange={(val) => {
                        setCode(val);
                        if (isOtpError) {
                          setIsOtpError(false);
                          setErrorMessage(null);
                        }
                      }}
                      length={6}
                      error={isOtpError}
                    />
                  </At>

                  {/* Mensaje de estado: expiración o error (D4.2) */}
                  <At t={t} start={T_FAST.field2} style={styles.statusWrap}>
                    {errorMessage ? (
                      <View style={styles.errorInline}>
                        <InfoIcon size={15} color={colors.errorDark} />
                        <Text style={styles.errorInlineText}>{errorMessage}</Text>
                      </View>
                    ) : successNotice ? (
                      <Text style={styles.successNoticeText}>{successNotice}</Text>
                    ) : (
                      <Text style={styles.expireText}>
                        El código vence en 10 minutos.
                      </Text>
                    )}
                  </At>

                  {/* Botón Verificar Código */}
                  <At t={t} start={T_FAST.button} style={styles.buttonWrap}>
                    <NeuButton
                      title="Verificar código"
                      onPress={handleVerify}
                      loading={loading}
                      disabled={code.length !== 6 || loading}
                    />
                  </At>

                  {/* Bloque Reenviar código y Cambiar correo */}
                  <At t={t} start={T_FAST.footer} dy={8} style={styles.resendBlock}>
                    <View style={styles.resendRow}>
                      <Text style={styles.resendPrompt}>
                        ¿No recibiste el código?{' '}
                      </Text>
                      <NeuLink onPress={handleResend}>Reenviar</NeuLink>
                    </View>

                    {cooldown > 0 && (
                      <Text style={styles.cooldownText}>
                        Podrás reenviarlo en {formatCountdown(cooldown)}
                      </Text>
                    )}

                    <View style={styles.changeEmailWrap}>
                      <NeuLink onPress={() => router.back()}>Cambiar correo</NeuLink>
                    </View>
                  </At>
                </NeuCard>
              </At>
            </View>

            {/* ── Pie de Página Cifrado y Seguro ── */}
            <At t={t} start={T_FAST.footer + 0.04} dy={8} style={styles.footerWrap}>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarSpacer: {
    width: 46,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  card: {
    width: '100%',
    paddingTop: 34,
    paddingBottom: 22,
    paddingHorizontal: 26,
  },
  headerWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
  subtitleWrap: {
    marginTop: 10,
  },
  emailHighlight: {
    fontFamily: fonts.bodyBold,
    fontStyle: 'normal',
    color: colors.ink,
  },
  otpWrap: {
    marginTop: 28,
  },
  statusWrap: {
    marginTop: 14,
    alignItems: 'center',
    minHeight: 22,
    justifyContent: 'center',
  },
  expireText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.muted,
    textAlign: 'center',
  },
  errorInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  errorInlineText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.errorDark,
    textAlign: 'center',
  },
  successNoticeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12.5,
    color: colors.ink,
    textAlign: 'center',
  },
  buttonWrap: {
    marginTop: 22,
  },
  resendBlock: {
    marginTop: 12,
    alignItems: 'center',
    gap: 3,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendPrompt: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  cooldownText: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.muted,
  },
  changeEmailWrap: {
    marginTop: 4,
  },
  footerWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
});
