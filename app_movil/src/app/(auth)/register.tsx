/**
 * register.tsx
 * Pantalla de Registro de ClinicalCase (Módulo D2 · Crear Cuenta).
 * Diseño neumórfico con Bodoni Moda + DM Sans.
 * Construido exclusivamente con tokens y componentes de `@/ui/Neu`.
 * Estados: Normal, Correo ya registrado, Contraseña débil, Términos sin aceptar, Cargando.
 */

import React, { useState } from 'react';
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
} from '@/ui/Neu';
import { UserIcon, MailIcon, LockIcon } from '@/ui/icons';
import { colors, fonts } from '@/ui/tokens';

export default function RegisterScreen() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();

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

    // Validación Contraseña (mínimo 8 caracteres según D2)
    if (!password) {
      setPasswordError('Por favor ingresa una contraseña');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
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
          <View style={styles.topWrap}>
            {/* ── Barra Superior con Botón Volver ── */}
            <View style={styles.topBar}>
              <BackButton onPress={() => router.back()} />
              <View style={styles.topBarSpacer} />
            </View>

            {/* ── Tarjeta Neumórfica (D2) ── */}
            <NeuCard style={styles.cardContainer}>
              {/* Barra de acento */}
              <AccentBar />

              {/* Título: Crea tu cuenta */}
              <Heading accent="cuenta">Crea tu </Heading>

              <View style={styles.subtitleWrap}>
                <Subtitle>
                  Regístrate para acceder a las herramientas perinatales y a los módulos clínicos.
                </Subtitle>
              </View>

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
              <View style={styles.googleWrap}>
                <GoogleButton
                  onPress={handleGoogleRegister}
                  title="Continuar con Google"
                />
              </View>

              {/* Separador */}
              <View style={styles.dividerWrap}>
                <OrDivider text="o con tu correo" />
              </View>

              {/* Formulario */}
              <View style={styles.formWrap}>
                {/* Nombre completo */}
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
                  error={nameError}
                />

                {/* Correo institucional o personal */}
                <NeuInput
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
                  error={emailError}
                />

                {/* Contraseña */}
                <NeuInput
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
                  error={passwordError}
                />
              </View>

              {/* Checkbox de Términos y Condiciones */}
              <View style={styles.checkboxWrap}>
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
              </View>

              {/* Botón Crear Cuenta */}
              <View style={styles.buttonWrap}>
                <NeuButton
                  title="Crear cuenta"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                />
              </View>

              {/* Enlace Iniciar Sesión (Flujo D1) */}
              <View style={styles.footerLinkWrap}>
                <Text style={styles.footerLinkText}>
                  ¿Ya tienes una cuenta?{' '}
                  <NeuLink onPress={() => router.push('/login')}>
                    Inicia sesión
                  </NeuLink>
                </Text>
              </View>
            </NeuCard>
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
  checkboxWrap: {
    marginTop: 14,
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
