import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { accentA, colors, fonts, radius, shadows } from './tokens';
import { ArrowLeftIcon, ArrowRightIcon, GoogleIcon } from './icons';

/** Botón principal: píldora con perilla oscura, flecha y aro de acento */
export const NeuButton = ({
  title,
  onPress,
  loading,
  disabled,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
    disabled={disabled || loading}
    onPress={onPress}
    style={({ pressed }) => [
      s.primary,
      {
        boxShadow: pressed ? shadows.pressed : shadows.raised,
        opacity: disabled ? 0.55 : 1,
      },
    ]}
  >
    <Text style={s.primaryText}>{loading ? 'Procesando…' : title}</Text>
    <LinearGradient
      colors={[colors.knobFrom, colors.knobTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.knob}
    >
      <ArrowRightIcon />
    </LinearGradient>
  </Pressable>
);

export const GoogleButton = ({
  onPress,
  title = 'Continuar con Google',
}: {
  onPress: () => void;
  title?: string;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      s.google,
      { boxShadow: pressed ? shadows.pressed : shadows.raisedSm },
    ]}
  >
    <GoogleIcon />
    <Text style={s.googleText}>{title}</Text>
  </Pressable>
);

export const BackButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Volver"
    onPress={onPress}
    style={({ pressed }) => [
      s.back,
      { boxShadow: pressed ? shadows.pressed : shadows.raisedXs },
    ]}
  >
    <ArrowLeftIcon />
  </Pressable>
);

/** Enlace en negrita con subrayado de acento */
export const NeuLink = ({
  children,
  onPress,
  italic,
}: {
  children: ReactNode;
  onPress: () => void;
  italic?: boolean;
}) => (
  <Text
    accessibilityRole="link"
    onPress={onPress}
    style={{
      fontFamily: italic ? fonts.bodyItalic : fonts.bodyBold,
      color: colors.inkStrong,
      textDecorationLine: 'underline',
      textDecorationColor: accentA(0.5),
    }}
  >
    {children}
  </Text>
);

const s = StyleSheet.create({
  primary: {
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    paddingLeft: 28,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryText: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink },
  knob: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.knob,
  },
  google: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.inkStrong },
  back: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
