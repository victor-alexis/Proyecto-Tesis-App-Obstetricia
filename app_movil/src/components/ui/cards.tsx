import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radius, shadows } from './tokens';

export const NeuCard = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => <View style={[s.card, style]}>{children}</View>;

/** Placa circular (anillo elevado + centro hundido) con punto insignia. badge="error" para estados de fallo */
export const IconPlate = ({
  children,
  badge = 'accent',
}: {
  children: ReactNode;
  badge?: 'accent' | 'error';
}) => (
  <View style={s.plateOuter}>
    <View style={s.plateInner}>{children}</View>
    <View
      style={[
        s.badge,
        { backgroundColor: badge === 'error' ? colors.error : colors.accent },
      ]}
    />
  </View>
);

/** Fila informativa o de pasos (usa `step` para el numeral en acento, o `icon`) */
export const ListRow = ({
  title,
  text,
  icon,
  step,
}: {
  title: string;
  text: string;
  icon?: ReactNode;
  step?: string;
}) => (
  <View style={s.row}>
    <View style={s.rowIcon}>
      {step ? (
        <Text style={{ fontFamily: fonts.displayItalic, fontSize: 18, color: colors.accent }}>
          {step}
        </Text>
      ) : (
        icon
      )}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink }}>
        {title}
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: colors.muted }}>
        {text}
      </Text>
    </View>
  </View>
);

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.bg,
    borderRadius: radius.card,
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    boxShadow: shadows.card,
  },
  plateOuter: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.plate,
  },
  plateInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.inset,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: radius.row,
    backgroundColor: colors.bg,
    boxShadow: shadows.row,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.insetSm,
  },
});
