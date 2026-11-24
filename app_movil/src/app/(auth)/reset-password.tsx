/**
 * reset-password.tsx
 * Pantalla para definir la nueva contraseña tras verificar el código OTP (Módulo D3.2 y D3.3).
 * Diseño neumórfico con Bodoni Moda + DM Sans.
 * Construido exclusivamente con tokens y componentes de `@/ui/Neu`.
 * Incluye:
 * - D3.2: Nueva contraseña + confirmación, medidor de seguridad dinámico y requisitos.
 * - D3.3: Confirmación de éxito con avisos de cuenta protegida y cierre de otras sesiones.
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
import { supabase } from '@/services/supabase';
import {
  BackButton,
  IconPlate,
  AccentBar,
  Heading,
  Subtitle,
  NeuCard,
  NeuInput,
  NeuButton,
  StrengthMeter,
  Requirement,
  ListRow,
  ErrorBanner,
  SecureFooter,
  LockIcon,
  CheckCircleIcon,
  ShieldIcon,
  DeviceIcon,
  SoftBackground,
  At,
  useScreenTimeline,
  T_FAST,
  colors,
  fonts,
} from '@/components/ui';

export default function ResetPasswordScreen() {
  const { updatePassword, signOut } = useAuth();
  const t = useScreenTimeline();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Errores
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmError, setConfirmError] = useState<string | undefined>(undefined);
  const [bannerError, setBannerError] = useState<{ title: string; text?: string } | null>(null);

  // Requisitos de contraseña
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Cálculo de medidor de seguridad (0 a 4)
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

  const handleSavePassword = async () => {
    setBannerError(null);
    setPasswordError(undefined);
    setConfirmError(undefined);

    let hasError = false;

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setPasswordError('La contraseña no cumple con los requisitos de seguridad');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmError('Por favor confirma tu nueva contraseña');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden');
      hasError = true;
    }

    if (hasError) {
      triggerHaptic(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(password);

      if (!result.success) {
        triggerHaptic(Haptics.NotificationFeedbackType.Error);
        const errLower = (result.error || '').toLowerCase();

        if (errLower.includes('same_password') || errLower.includes('igual a la anterior')) {
          setPasswordError('No puede ser igual a la anterior');
        } else {
          setBannerError({
            title: 'Error al actualizar',
            text: result.error || 'No fue posible guardar la nueva contraseña.',
          });
        }
        return;
      }

      // Cerrar las demás sesiones activas por seguridad clínica (D3.3)
      supabase.auth.signOut({ scope: 'others' }).catch(() => {});

      triggerHaptic(Haptics.NotificationFeedbackType.Success);
      setIsSuccess(true);
    } catch (err: any) {
      triggerHaptic(Haptics.NotificationFeedbackType.Error);
      setBannerError({
        title: 'Error inesperado',
        text: err?.message || 'Ocurrió un error al procesar el cambio de contraseña.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToLogin = async () => {
    await signOut();
    router.replace('/login');
  };

  // ──────────────────────────────────────────────
  // PANTALLA D3.3: Confirmación de Éxito
  // ──────────────────────────────────────────────
  if (isSuccess) {
    return (
      <View style={styles.root}>
        <SoftBackground />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.mainContainer}>
            {/* Barra Superior */}
            <At t={t} start={T_FAST.topBar} dy={8}>
              <View style={styles.topBar}>
                <BackButton onPress={handleReturnToLogin} />
                <View style={styles.topBarSpacer} />
              </View>
            </At>

            {/* Tarjeta de Éxito (D3.3) */}
            <View style={styles.cardWrapper}>
              <At t={t} start={T_FAST.card} dur={0.45} dy={24}>
                <NeuCard style={styles.cardSuccess}>
                  {/* Placa con Check Verde/Texto */}
                  <At t={t} start={T_FAST.plate}>
                    <IconPlate badge="accent">
                      <CheckCircleIcon size={30} color={colors.text} />
                    </IconPlate>
                  </At>

                  {/* Encabezado */}
                  <At t={t} start={T_FAST.header} style={styles.headerWrap}>
                    <AccentBar center />
                    <Heading accent="listo!" center>
                      ¡Todo{' '}
                    </Heading>
                    <View style={styles.subtitleWrap}>
                      <Subtitle center>
                        Tu contraseña se actualizó correctamente. Ya puedes ingresar con ella.
                      </Subtitle>
                    </View>
                  </At>

                  {/* Filas informativas de seguridad */}
                  <At t={t} start={T_FAST.field1} style={styles.listRowsWrap}>
                    <ListRow
                      icon={<ShieldIcon size={18} color={colors.text} />}
                      title="Cuenta protegida"
                      text="La contraseña anterior ya no es válida."
                    />
                    <ListRow
                      icon={<DeviceIcon size={18} color={colors.text} />}
                      title="Sesiones cerradas"
                      text="Cerramos los otros dispositivos con tu cuenta."
                    />
                  </At>

                  {/* Botón de Retorno al Login */}
                  <At t={t} start={T_FAST.button} style={styles.buttonWrapSuccess}>
                    <NeuButton
                      title="Volver a iniciar sesión"
                      onPress={handleReturnToLogin}
                    />
                  </At>
                </NeuCard>
              </At>
            </View>

            {/* Pie de página seguro */}
            <At t={t} start={T_FAST.footer} dy={8} style={styles.footerWrap}>
              <SecureFooter />
            </At>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ──────────────────────────────────────────────
  // PANTALLA D3.2: Formulario Nueva Contraseña
  // ──────────────────────────────────────────────
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
            {/* Barra Superior */}
            <At t={t} start={T_FAST.topBar} dy={8}>
              <View style={styles.topBar}>
                <BackButton onPress={() => router.back()} />
                <View style={styles.topBarSpacer} />
              </View>
            </At>

            {/* Tarjeta Neumórfica (D3.2) */}
            <View style={styles.cardWrapper}>
              <At t={t} start={T_FAST.card} dur={0.45} dy={24}>
                <NeuCard style={styles.cardForm}>
                  <At t={t} start={T_FAST.header}>
                    <AccentBar />
                    <Heading accent="contraseña">Nueva </Heading>
                  </At>

                  <At t={t} start={T_FAST.subtitle} style={styles.subtitleWrapLeft}>
                    <Subtitle>
                      Elige una contraseña segura que no uses en otros sitios.
                    </Subtitle>
                  </At>

                  {/* Banner de error si ocurre */}
                  {bannerError && (
                    <View style={styles.bannerWrap}>
                      <ErrorBanner
                        title={bannerError.title}
                        text={bannerError.text}
                      />
                    </View>
                  )}

                  {/* Campos de Contraseña */}
                  <View style={styles.inputsWrap}>
                    <At t={t} start={T_FAST.field1}>
                      <NeuInput
                        label="Nueva contraseña"
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
                    </At>

                    <At t={t} start={T_FAST.field2}>
                      <NeuInput
                        label="Confirmar contraseña"
                        icon={<LockIcon />}
                        placeholder="Repite tu contraseña"
                        secure
                        value={confirmPassword}
                        onChangeText={(val) => {
                          setConfirmPassword(val);
                          if (confirmError) setConfirmError(undefined);
                        }}
                        autoComplete="new-password"
                        error={confirmError}
                      />
                    </At>
                  </View>

                  {/* Medidor de Seguridad */}
                  <At t={t} start={T_FAST.meter} style={styles.strengthWrap}>
                    <StrengthMeter level={strengthLevel} label={strengthLabel} />
                  </At>

                  {/* Lista de Requisitos de Contraseña */}
                  <At t={t} start={T_FAST.checkbox} style={styles.requirementsWrap}>
                    <Requirement ok={hasMinLength}>Mínimo 8 caracteres</Requirement>
                    <Requirement ok={hasUppercase}>Una letra mayúscula</Requirement>
                    <Requirement ok={hasNumber}>Un número</Requirement>
                  </At>

                  {/* Botón Guardar Contraseña */}
                  <At t={t} start={T_FAST.button} style={styles.buttonWrapForm}>
                    <NeuButton
                      title="Guardar contraseña"
                      onPress={handleSavePassword}
                      loading={loading}
                      disabled={loading}
                    />
                  </At>
                </NeuCard>
              </At>
            </View>

            {/* Pie de página seguro */}
            <At t={t} start={T_FAST.footer} dy={8} style={styles.footerWrap}>
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
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
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
  cardForm: {
    width: '100%',
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 26,
  },
  cardSuccess: {
    width: '100%',
    paddingTop: 34,
    paddingBottom: 24,
    paddingHorizontal: 26,
  },
  headerWrap: {
    marginTop: 24,
    alignItems: 'center',
  },
  subtitleWrap: {
    marginTop: 10,
  },
  subtitleWrapLeft: {
    marginTop: 8,
  },
  bannerWrap: {
    marginTop: 16,
  },
  inputsWrap: {
    marginTop: 24,
    gap: 14,
  },
  strengthWrap: {
    marginTop: 16,
  },
  requirementsWrap: {
    marginTop: 16,
    gap: 10,
  },
  listRowsWrap: {
    marginTop: 24,
    gap: 12,
  },
  buttonWrapForm: {
    marginTop: 22,
  },
  buttonWrapSuccess: {
    marginTop: 24,
  },
  footerWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
});
