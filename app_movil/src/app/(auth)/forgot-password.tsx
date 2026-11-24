/**
 * forgot-password.tsx
 * Pantalla de Recuperación de Contraseña de ClinicalCase (Módulo D3).
 * Diseño neumórfico con Bodoni Moda + DM Sans.
 * Construido exclusivamente con tokens y componentes de `@/ui/Neu`.
 * Pide el correo institucional/personal y envía el código de seguridad de 6 dígitos.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/authErrors';
import {
  BackButton,
  IconPlate,
  AccentBar,
  Heading,
  Subtitle,
  NeuCard,
  NeuInput,
  NeuButton,
  NeuLink,
  ErrorBanner,
  SecureFooter,
  KeyIcon,
  MailIcon,
  SoftBackground,
  At,
  useScreenTimeline,
  KeyboardScrollContext,
  useKeyboardAwareScroll,
  T_FAST,
  colors,
  fonts,
} from '@/components/ui';

export default function ForgotPasswordScreen() {
  const { sendPasswordResetOtp } = useAuth();
  const t = useScreenTimeline();
  const kb = useKeyboardAwareScroll();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [bannerError, setBannerError] = useState<{ title: string; text?: string } | null>(null);

  const triggerHaptic = (type: Haptics.NotificationFeedbackType) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(type).catch(() => {});
    }
  };

  const handleSendCode = async () => {
    setBannerError(null);
    setEmailError(undefined);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setEmailError('Por favor ingresa tu correo institucional o personal');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      setEmailError('Por favor ingresa un correo con formato válido');
      return;
    }

    setLoading(true);

    try {
      const result = await sendPasswordResetOtp(trimmedEmail);

      if (!result.success) {
        triggerHaptic(Haptics.NotificationFeedbackType.Error);
        const errLower = (result.error || '').toLowerCase();

        if (errLower.includes('rate limit') || errLower.includes('demasiadas solicitudes')) {
          setBannerError({
            title: 'Límite de intentos',
            text: 'Has realizado demasiadas solicitudes. Por seguridad, espera 60 segundos antes de intentar nuevamente.',
          });
        } else {
          setBannerError({
            title: 'Error de envío',
            text: result.error || 'No se pudo enviar el código de seguridad.',
          });
        }
        return;
      }

      triggerHaptic(Haptics.NotificationFeedbackType.Success);

      // Redirigir a la pantalla de verificación OTP para recuperación (Flujo D4 con type: 'recovery')
      router.push({
        pathname: '/verify-otp',
        params: {
          email: trimmedEmail,
          type: 'recovery',
        },
      } as any);
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setBannerError({
        title: 'Error inesperado',
        text: err?.message || 'Ocurrió un error al procesar la solicitud.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardScrollContext.Provider value={kb}>
      <View style={styles.root}>
        <SoftBackground />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
          >
            <ScrollView
              ref={kb.scrollRef as any}
              contentContainerStyle={[
                styles.scrollContent,
                kb.isKeyboardVisible && { paddingBottom: kb.keyboardHeight + 60 },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
            >
              {/* ── Barra Superior con Botón Volver ── */}
              <At t={t} start={T_FAST.topBar} dy={8}>
                <View style={styles.topBar}>
                  <BackButton onPress={() => router.back()} />
                  <View style={styles.topBarSpacer} />
                </View>
              </At>

              {/* ── Contenedor Central con Tarjeta Neumórfica (D3) ── */}
              <View style={[styles.cardWrapper, kb.isKeyboardVisible && { justifyContent: 'flex-start' }]}>
              <At t={t} start={T_FAST.card} dur={0.45} dy={24}>
                <NeuCard style={styles.card}>
                  {/* Placa circular con icono de Llave */}
                  <At t={t} start={T_FAST.plate}>
                    <IconPlate badge="accent">
                      <KeyIcon size={30} color={colors.text} />
                    </IconPlate>
                  </At>

                  {/* Título centrado */}
                  <At t={t} start={T_FAST.header} style={styles.headerWrap}>
                    <AccentBar center />
                    <Heading accent="contraseña" center>
                      Recupera tu{' '}
                    </Heading>
                    <View style={styles.subtitleWrap}>
                      <Subtitle center>
                        Ingresa tu correo y te enviaremos un código de seguridad para restablecerla.
                      </Subtitle>
                    </View>
                  </At>

                  {/* Banner de error general si ocurre */}
                  {bannerError && (
                    <View style={styles.bannerWrap}>
                      <ErrorBanner
                        title={bannerError.title}
                        text={bannerError.text}
                      />
                    </View>
                  )}

                  {/* Campo Correo */}
                  <At t={t} start={T_FAST.field1} style={styles.inputWrap}>
                    <NeuInput
                      label="Correo institucional o personal"
                      icon={<MailIcon />}
                      placeholder="nombre@ulagos.cl"
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        if (emailError) setEmailError(undefined);
                        if (bannerError) setBannerError(null);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="off"
                      textContentType="none"
                      returnKeyType="send"
                      onSubmitEditing={handleSendCode}
                      error={emailError}
                    />
                  </At>

                  {/* Botón Enviar Código */}
                  <At t={t} start={T_FAST.button} style={styles.buttonWrap}>
                    <NeuButton
                      title="Enviar código"
                      onPress={handleSendCode}
                      loading={loading}
                      disabled={loading}
                    />
                  </At>

                  {/* Enlace Volver a Iniciar Sesión (D1) */}
                  <At t={t} start={T_FAST.footer} dy={8} style={styles.footerLinkWrap}>
                    <Text style={styles.footerLinkText}>
                      ¿La recordaste?{' '}
                      <NeuLink onPress={() => router.replace('/login')}>
                        Volver a iniciar sesión
                      </NeuLink>
                    </Text>
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
    </KeyboardScrollContext.Provider>
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
    paddingBottom: 26,
    paddingHorizontal: 26,
  },
  headerWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
  subtitleWrap: {
    marginTop: 10,
  },
  bannerWrap: {
    marginTop: 20,
  },
  inputWrap: {
    marginTop: 26,
  },
  buttonWrap: {
    marginTop: 22,
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
