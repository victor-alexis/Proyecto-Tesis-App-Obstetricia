import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, errorA, fonts, shadows } from './tokens';
import { AlertIcon } from './icons';

/** Banner de error hundido con barra lateral */
export const ErrorBanner = ({ title, text }: { title: string; text?: string }) => (
  <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.banner}>
    <View style={s.bannerBar} />
    <AlertIcon />
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.errorDark }}>
        {title}
      </Text>
      {!!text && (
        <Text
          style={{
            fontFamily: fonts.body,
            fontSize: 12.5,
            lineHeight: 18,
            color: colors.label,
            marginTop: 2,
          }}
        >
          {text}
        </Text>
      )}
    </View>
  </View>
);

/** Requisito de contraseña: cumplido (punto oscuro con check) o pendiente (anillo de error) */
export const Requirement = ({ ok, children }: { ok: boolean; children: string }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
    {ok ? (
      <LinearGradient colors={[colors.knobFrom, colors.knobTo]} style={s.reqDot}>
        <Text style={{ color: '#fff', fontSize: 11, fontFamily: fonts.bodyBold }}>✓</Text>
      </LinearGradient>
    ) : (
      <View
        style={[
          s.reqDot,
          {
            backgroundColor: colors.bg,
            boxShadow: `inset 2px 2px 4px rgba(163,177,198,0.6), inset -2px -2px 4px rgba(255,255,255,0.95), 0 0 0 1.5px ${errorA(0.55)}`,
          },
        ]}
      >
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.error }} />
      </View>
    )}
    <Text
      style={{
        fontFamily: ok ? fonts.body : fonts.bodyBold,
        fontSize: 13,
        color: ok ? colors.text : colors.errorDark,
      }}
    >
      {children}
    </Text>
  </View>
);

/** Medidor de seguridad: level 0–4 */
export const StrengthMeter = ({ level, label }: { level: number; label: string }) => (
  <View style={{ gap: 8 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={s.label}>Seguridad</Text>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.errorDark }}>
        {label}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 6,
            backgroundColor: i <= level ? colors.knobTo : colors.bg,
            boxShadow:
              i <= level
                ? '0 1px 2px rgba(30,34,40,0.3)'
                : 'inset 2px 2px 3px rgba(163,177,198,0.6), inset -2px -2px 3px rgba(255,255,255,0.95)',
          }}
        />
      ))}
    </View>
  </View>
);

const s = StyleSheet.create({
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.26,
    textTransform: 'uppercase',
    color: colors.label,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 20,
    paddingRight: 16,
    borderRadius: 18,
    backgroundColor: colors.bg,
    boxShadow: shadows.inset,
  },
  bannerBar: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
  reqDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
