import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { accentA, colors, fonts } from './tokens';
import { LockIcon } from './icons';

/** "ClinicalCase" + punto de acento */
export const Wordmark = ({ size = 55 }: { size?: number }) => {
  const d = Math.round(size * 0.14);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Text
        style={{
          fontFamily: fonts.displayItalic,
          fontSize: size,
          lineHeight: size * 1.1,
          letterSpacing: -0.01 * size,
          color: colors.wordmark,
        }}
      >
        ClinicalCase
      </Text>
      <View
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          marginLeft: size * 0.05,
          marginBottom: size * 0.2,
          backgroundColor: colors.accent,
          boxShadow: `0 0 0 ${Math.round(size * 0.06)}px ${accentA(0.12)}`,
        }}
      />
    </View>
  );
};

/** Barra corta de acento sobre el título */
export const AccentBar = ({ center }: { center?: boolean }) => (
  <View
    style={{
      alignSelf: center ? 'center' : 'flex-start',
      width: 30,
      height: 3,
      borderRadius: 3,
      backgroundColor: colors.accent,
      marginBottom: 12,
    }}
  />
);

/** Título con acento en cursiva gris: <Heading accent="cuenta">Crea tu </Heading> */
export const Heading = ({
  children,
  accent,
  center,
}: {
  children: ReactNode;
  accent: string;
  center?: boolean;
}) => (
  <Text
    accessibilityRole="header"
    style={{
      fontFamily: fonts.display,
      fontSize: 30,
      lineHeight: 34,
      color: colors.ink,
      textAlign: center ? 'center' : 'left',
    }}
  >
    {children}
    <Text style={{ fontFamily: fonts.displayItalic, color: colors.accentGray }}>
      {accent}
    </Text>
  </Text>
);

export const Subtitle = ({
  children,
  center,
}: {
  children: ReactNode;
  center?: boolean;
}) => (
  <Text
    style={{
      fontFamily: fonts.bodyItalic,
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.label,
      textAlign: center ? 'center' : 'left',
    }}
  >
    {children}
  </Text>
);

/** Pie: candado de acento + créditos */
export const SecureFooter = () => (
  <View style={{ alignItems: 'center', gap: 5 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <LockIcon size={13} color={colors.accent} />
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>
        Conexión clínica cifrada y segura
      </Text>
    </View>
    <Text style={{ fontFamily: fonts.bodyItalic, fontSize: 12, color: colors.muted }}>
      Diseño de Víctor González y Benjamín Torres
    </Text>
  </View>
);
