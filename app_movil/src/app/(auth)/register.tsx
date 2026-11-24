/**
 * register.tsx
 * Pantalla de Registro de ClinicalCase (Módulo D2 · Crear Cuenta).
 * Diseño neumórfico con Bodoni Moda + DM Sans.
 * Construido exclusivamente con tokens y componentes de `@/ui/Neu`.
 * Estados: Normal, Correo ya registrado, Contraseña débil, Términos sin aceptar, Cargando.
 */

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/authErrors';
import {
  AccentBar,
  Heading,
  Subtitle,
  NeuCard,
  BackButton,
  NeuInput,
  NeuButton,
  GoogleButton,
  OrDivider,
  NeuCheckbox,
  NeuLink,
  InlineError,
  ErrorBanner,
  StrengthMeter,
  Requirement,
  UserIcon,
  MailIcon,
  LockIcon,
  SoftBackground,
  At,
  useScreenTimeline,
  useKeyboardAwareScroll,
  T_FAST,
  colors,
  fonts,
} from '@/components/ui';

export default function RegisterScreen() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const t = useScreenTimeline();
  const { scrollRef, keyboardHeight, scrollToInput } = useKeyboardAwareScroll();
  const emailInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados de error por campo
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [termsError, setTermsError] = useState<string | undefined>(undefined);
  const [bannerError, setBannerError] = useState<{ title: string; text?: string } | null>(null);

  // Requisitos dinámicos de contraseña (alineado con reset-password.tsx)
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Medidor de seguridad (0 a 4)
  const computeStrength = () => {
    if (!password) return { level: 0, label: 'Baja' };
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;

    switch (score) {
      case 0:
      case 1:
        return { level: 1, label: 'Baja' };
      case 2:
        return { level: 2, label: 'Media' };
      case 3:
        return { level: 3, label: 'Fuerte' };
      case 4:
      default:
        return { level: 4, label: 'Muy fuerte' };
    }
  };

  const { level: strengthLevel, label: strengthLabel } = computeStrength();

  const triggerHaptic = (type: Haptics.NotificationFeedbackType) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(type).catch(() => {});
    }
  };

  const handleGoogleRegister = async () => {
    setBannerError(null);
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success && result.error) {
        triggerHaptic(Haptics.NotificationFeedbackType.Error);
        setBannerError({
          title: 'Error con Google',
          text: result.error,
        });
      } else {
        triggerHaptic(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setBannerError({
        title: 'Error con Google',
        text: err?.message || 'No fue posible completar el registro con Google.',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validación Nombre
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setNameError('Por favor ingresa tu nombre completo');
      isValid = false;
    } else {
      setNameError(undefined);
    }

    // Validación Correo
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Por favor ingresa tu correo institucional o personal');
      isValid = false;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError('Formato de correo electrónico no válido');
      isValid = false;
    } else {
      setEmailError(undefined);
    }

    // Validación Contraseña (criterios unificados con reset-password: 8+ chars, mayúscula, número)
    if (!password) {
      setPasswordError('Por favor ingresa una contraseña');
      isValid = false;
    } else if (!hasMinLength || !hasUppercase || !hasNumber) {
      setPasswordError('La contraseña no cumple con los requisitos de seguridad');
      isValid = false;
    } else {
      setPasswordError(undefined);
    }

    // Validación Términos y Condiciones
    if (!acceptedTerms) {
      setTermsError('Debes aceptar los términos de uso y la política de privacidad');
      isValid = false;
    } else {
      setTermsError(undefined);
    }

    return isValid;
  };

  const handleRegister = async () => {
    setBannerError(null);

    if (!validateForm()) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    setLoading(true);

    try {
      const result = await signUpWithEmail(trimmedEmail, password, trimmedName);

      if (!result.success) {
        triggerHaptic(Haptics.NotificationFeedbackType.Error);
        const errLower = (result.error || '').toLowerCase();

        if (
          errLower.includes('already registered') ||
          errLower.includes('already in use') ||
          errLower.includes('ya existe')
        ) {
          setEmailError('Ya existe una cuenta registrada con este correo');
        } else if (errLower.includes('weak') || errLower.includes('password')) {
          setPasswordError('La contraseña es demasiado débil o no cumple los requisitos');
        } else {
          setBannerError({
            title: 'Error al crear cuenta',
            text: result.error || 'No se pudo completar el registro.',
          });
        }
        return;
      }

      triggerHaptic(Haptics.NotificationFeedbackType.Success);

      // Si la sesión se inició inmediatamente (sin confirmación requerida)
      if (result.session) {
        router.replace('/');
        return;
      }

      // Si requiere confirmación por correo (Flujo D4 con type: 'signup')
      router.push({
        pathname: '/verify-otp',
        params: {
          email: trimmedEmail,
          type: 'signup',
        },
      } as any);
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setBannerError({
        title: 'Error inesperado',
        text: err?.message || 'Ocurrió un error al procesar el registro.',
      });
    } finally {
      setLoading(false);
    }
  };

  const showTerms = () => {
    Alert.alert(
      'Términos de uso',
      'ClinicalCase es una plataforma de apoyo clínico obstétrico. La información médica proporcionada debe ser validada por profesionales de la salud capacitados.',
      [{ text: 'Entendido' }]
    );
  };

  const showPrivacy = () => {
    Alert.alert(
      'Política de Privacidad',
      'Tus datos y registros clínicos se encuentran cifrados bajo rigurosos estándares de seguridad y protección de datos médicos.',
      [{ text: 'Entendido' }]
    );
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
            ref={scrollRef as any}
            contentContainerStyle={[
              styles.scrollContent,
              keyboardHeight > 0 && { paddingBottom: keyboardHeight + 40 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          >
            <View style={styles.topWrap}>
              {/* ── Barra Superior con Botón Volver ── */}
              <At t={t} start={T_FAST.topBar} dy={8}>
                <View style={styles.topBar}>
                  <BackButton onPress={() => router.back()} />
                  <View style={styles.topBarSpacer} />
                </View>
              </At>

              {/* ── Tarjeta Neumórfica (D2) ── */}
              <At t={t} start={T_FAST.card} dur={0.45} dy={24}>
                <NeuCard style={styles.cardContainer}>
                  {/* Barra de acento y título */}
                  <At t={t} start={T_FAST.header}>
                    <AccentBar />
                    <Heading accent="cuenta">Crea tu </Heading>
                  </At>

                  <At t={t} start={T_FAST.subtitle} style={styles.subtitleWrap}>
                    <Subtitle>
                      Regístrate para acceder a las herramientas perinatales y a los módulos clínicos.
                    </Subtitle>
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

                  {/* Botón de Google */}
                  <At t={t} start={T_FAST.google} style={styles.googleWrap}>
                    <GoogleButton
                      onPress={handleGoogleRegister}
                      title="Continuar con Google"
                    />
                  </At>

                  {/* Separador */}
                  <At t={t} start={T_FAST.divider} style={styles.dividerWrap}>
                    <OrDivider text="o con tu correo" />
                  </At>

                  {/* Formulario */}
                  <View style={styles.formWrap}>
                    {/* Nombre completo */}
                    <At t={t} start={T_FAST.field1}>
                      <NeuInput
                        label="Nombre completo"
                        icon={<UserIcon />}
                        placeholder="Nombre y apellido"
                        value={fullName}
                        onChangeText={(val) => {
                          setFullName(val);
                          if (nameError) setNameError(undefined);
                        }}
                        autoCapitalize="words"
                        autoComplete="name"
                        returnKeyType="next"
                        onFocus={() => scrollToInput(120)}
                        onSubmitEditing={() => emailInputRef.current?.focus()}
                        error={nameError}
                      />
                    </At>

                    {/* Correo institucional o personal */}
                    <At t={t} start={T_FAST.field2}>
                      <NeuInput
                        ref={emailInputRef}
                        label="Correo institucional o personal"
                        icon={<MailIcon />}
                        placeholder="nombre@ulagos.cl"
                        value={email}
                        onChangeText={(val) => {
                          setEmail(val);
                          if (emailError) setEmailError(undefined);
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        returnKeyType="next"
                        onFocus={() => scrollToInput(200)}
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                        error={emailError}
                      />
                    </At>

                    {/* Contraseña */}
                    <At t={t} start={T_FAST.field3}>
                      <NeuInput
                        ref={passwordInputRef}
                        label="Contraseña"
                        icon={<LockIcon />}
                        placeholder="Mínimo 8 caracteres"
                        secure
                        value={password}
                        onChangeText={(val) => {
                          setPassword(val);
                          if (passwordError) setPasswordError(undefined);
                        }}
                        autoComplete="new-password"
                        returnKeyType="done"
                        onFocus={() => scrollToInput(300)}
                        onSubmitEditing={handleRegister}
                        error={passwordError}
                      />
                    </At>
                  </View>

                  {/* Medidor de Seguridad dinámico */}
                  {password.length > 0 && (
                    <At t={t} start={T_FAST.meter} style={styles.strengthWrap}>
                      <StrengthMeter level={strengthLevel} label={strengthLabel} />
                    </At>
                  )}

                  {/* Lista de Requisitos de Contraseña en tiempo real */}
                  <At t={t} start={T_FAST.checkbox - 0.04} style={styles.requirementsWrap}>
                    <Requirement ok={hasMinLength}>Mínimo 8 caracteres</Requirement>
                    <Requirement ok={hasUppercase}>Una letra mayúscula</Requirement>
                    <Requirement ok={hasNumber}>Un número</Requirement>
                  </At>

                  {/* Checkbox de Términos y Condiciones */}
                  <At t={t} start={T_FAST.checkbox} style={styles.checkboxWrap}>
                    <NeuCheckbox
                      checked={acceptedTerms}
                      onChange={(val) => {
                        setAcceptedTerms(val);
                        if (termsError) setTermsError(undefined);
                      }}
                    >
                      Acepto los{' '}
                      <NeuLink onPress={showTerms}>términos de uso</NeuLink> y la{' '}
                      <NeuLink onPress={showPrivacy}>política de privacidad</NeuLink>.
                    </NeuCheckbox>

                    {termsError && (
                      <View style={styles.termsErrorWrap}>
                        <InlineError>{termsError}</InlineError>
                      </View>
                    )}
                  </At>

                  {/* Botón Crear Cuenta */}
                  <At t={t} start={T_FAST.button} style={styles.buttonWrap}>
                    <NeuButton
                      title="Crear cuenta"
                      onPress={handleRegister}
                      loading={loading}
                      disabled={loading}
                    />
                  </At>

                  {/* Enlace Iniciar Sesión (Flujo D1) */}
                  <At t={t} start={T_FAST.footer} dy={8} style={styles.footerLinkWrap}>
                    <Text style={styles.footerLinkText}>
                      ¿Ya tienes una cuenta?{' '}
                      <NeuLink onPress={() => router.push('/login')}>
                        Inicia sesión
                      </NeuLink>
                    </Text>
                  </At>
                </NeuCard>
              </At>
            </View>
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
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  topWrap: {
    flex: 1,
    gap: 22,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarSpacer: {
    width: 46,
  },
  cardContainer: {
    width: '100%',
  },
  subtitleWrap: {
    marginTop: 8,
  },
  bannerWrap: {
    marginTop: 16,
  },
  googleWrap: {
    marginTop: 20,
  },
  dividerWrap: {
    marginTop: 18,
  },
  formWrap: {
    marginTop: 18,
    gap: 14,
  },
  strengthWrap: {
    marginTop: 14,
  },
  requirementsWrap: {
    marginTop: 14,
    gap: 8,
  },
  checkboxWrap: {
    marginTop: 16,
  },
  termsErrorWrap: {
    marginTop: 6,
  },
  buttonWrap: {
    marginTop: 18,
  },
  footerLinkWrap: {
    marginTop: 18,
    alignItems: 'center',
  },
  footerLinkText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
});
