import { ReactNode, useRef, useState } from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { accentA, colors, errorA, fonts, radius, shadows } from './tokens';
import {
  AlertIcon, ArrowLeftIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, GoogleIcon, InfoIcon, LockIcon,
} from './icons';

/* ───────────── Marca y tipografía ───────────── */

/** "ClinicalCase" + punto de acento */
export const Wordmark = ({ size = 55 }: { size?: number }) => {
  const d = Math.round(size * 0.14);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Text
        style={{
          fontFamily: fonts.displayItalic, fontSize: size, lineHeight: size * 1.1,
          letterSpacing: -0.01 * size, color: colors.wordmark,
        }}
      >
        ClinicalCase
      </Text>
      <View
        style={{
          width: d, height: d, borderRadius: d / 2, marginLeft: size * 0.05, marginBottom: size * 0.2,
          backgroundColor: colors.accent, boxShadow: `0 0 0 ${Math.round(size * 0.06)}px ${accentA(0.12)}`,
        }}
      />
    </View>
  );
};

/** Barra corta de acento sobre el título */
export const AccentBar = ({ center }: { center?: boolean }) => (
  <View style={{ alignSelf: center ? 'center' : 'flex-start', width: 30, height: 3, borderRadius: 3, backgroundColor: colors.accent, marginBottom: 12 }} />
);

/** Título con acento en cursiva gris: <Heading accent="cuenta">Crea tu </Heading> */
export const Heading = ({ children, accent, center }: { children: ReactNode; accent: string; center?: boolean }) => (
  <Text
    accessibilityRole="header"
    style={{ fontFamily: fonts.display, fontSize: 30, lineHeight: 34, color: colors.ink, textAlign: center ? 'center' : 'left' }}
  >
    {children}
    <Text style={{ fontFamily: fonts.displayItalic, color: colors.accentGray }}>{accent}</Text>
  </Text>
);

export const Subtitle = ({ children, center }: { children: ReactNode; center?: boolean }) => (
  <Text style={{ fontFamily: fonts.bodyItalic, fontSize: 13.5, lineHeight: 20, color: colors.label, textAlign: center ? 'center' : 'left' }}>
    {children}
  </Text>
);

/** Pie: candado de acento + créditos */
export const SecureFooter = () => (
  <View style={{ alignItems: 'center', gap: 5 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <LockIcon size={13} color={colors.accent} />
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Conexión clínica cifrada y segura</Text>
    </View>
    <Text style={{ fontFamily: fonts.bodyItalic, fontSize: 12, color: colors.muted }}>Diseño de Víctor González y Benjamín Torres</Text>
  </View>
);

/* ───────────── Contenedores ───────────── */

export const NeuCard = ({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[s.card, style]}>{children}</View>
);

/** Placa circular (anillo elevado + centro hundido) con punto insignia. badge="error" para estados de fallo */
export const IconPlate = ({ children, badge = 'accent' }: { children: ReactNode; badge?: 'accent' | 'error' }) => (
  <View style={s.plateOuter}>
    <View style={s.plateInner}>{children}</View>
    <View style={[s.badge, { backgroundColor: badge === 'error' ? colors.error : colors.accent }]} />
  </View>
);

export const BackButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Volver"
    onPress={onPress}
    style={({ pressed }) => [s.back, { boxShadow: pressed ? shadows.pressed : shadows.raisedXs }]}
  >
    <ArrowLeftIcon />
  </Pressable>
);

/** Fila informativa o de pasos (usa `step` para el numeral en acento, o `icon`) */
export const ListRow = ({
  title, text, icon, step,
}: { title: string; text: string; icon?: ReactNode; step?: string }) => (
  <View style={s.row}>
    <View style={s.rowIcon}>
      {step ? <Text style={{ fontFamily: fonts.displayItalic, fontSize: 18, color: colors.accent }}>{step}</Text> : icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink }}>{title}</Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: colors.muted }}>{text}</Text>
    </View>
  </View>
);

/* ───────────── Formularios ───────────── */

/** Campo hundido. `error` muestra aro y mensaje de error accesible. */
export const NeuInput = ({
  label, icon, secure, error, rightLabel, ...props
}: TextInputProps & { label: string; icon: ReactNode; secure?: boolean; error?: string; rightLabel?: ReactNode }) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  const shadow = error ? shadows.invalid : focused ? shadows.focus : shadows.inset;
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={s.label}>{label}</Text>
        {rightLabel}
      </View>
      <View style={s.fieldWrap}>
        <View style={s.fieldIcon} pointerEvents="none">{icon}</View>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.muted}
          secureTextEntry={hidden}
          autoCapitalize="none"
          selectionColor={colors.accent}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          {...props}
          style={[s.input, { boxShadow: shadow, paddingRight: secure ? 52 : 20 }, props.style]}
        />
        {secure && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
            onPress={() => setHidden((h) => !h)}
            style={s.eye}
          >
            {hidden ? <EyeIcon /> : <EyeOffIcon />}
          </Pressable>
        )}
      </View>
      {!!error && <InlineError>{error}</InlineError>}
    </View>
  );
};

export const InlineError = ({ children }: { children: string }) => (
  <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 18 }}>
    <InfoIcon />
    <Text style={{ fontFamily: fonts.bodySemi, fontSize: 12, color: colors.errorDark }}>{children}</Text>
  </View>
);

/** Banner de error hundido con barra lateral */
export const ErrorBanner = ({ title, text }: { title: string; text?: string }) => (
  <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={s.banner}>
    <View style={s.bannerBar} />
    <AlertIcon />
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.errorDark }}>{title}</Text>
      {!!text && <Text style={{ fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: colors.label, marginTop: 2 }}>{text}</Text>}
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
      <View style={[s.reqDot, { backgroundColor: colors.bg, boxShadow: `inset 2px 2px 4px rgba(163,177,198,0.6), inset -2px -2px 4px rgba(255,255,255,0.95), 0 0 0 1.5px ${errorA(0.55)}` }]}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.error }} />
      </View>
    )}
    <Text style={{ fontFamily: ok ? fonts.body : fonts.bodyBold, fontSize: 13, color: ok ? colors.text : colors.errorDark }}>{children}</Text>
  </View>
);

/** Medidor de seguridad: level 0–4 */
export const StrengthMeter = ({ level, label }: { level: number; label: string }) => (
  <View style={{ gap: 8 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={s.label}>Seguridad</Text>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.errorDark }}>{label}</Text>
    </View>
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            flex: 1, height: 6, borderRadius: 6, backgroundColor: i <= level ? colors.knobTo : colors.bg,
            boxShadow: i <= level ? '0 1px 2px rgba(30,34,40,0.3)' : 'inset 2px 2px 3px rgba(163,177,198,0.6), inset -2px -2px 3px rgba(255,255,255,0.95)',
          }}
        />
      ))}
    </View>
  </View>
);

/** Botón principal: píldora con perilla oscura, flecha y aro de acento */
export const NeuButton = ({
  title, onPress, loading, disabled,
}: { title: string; onPress: () => void; loading?: boolean; disabled?: boolean }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
    disabled={disabled || loading}
    onPress={onPress}
    style={({ pressed }) => [s.primary, { boxShadow: pressed ? shadows.pressed : shadows.raised, opacity: disabled ? 0.55 : 1 }]}
  >
    <Text style={s.primaryText}>{loading ? 'Procesando…' : title}</Text>
    <LinearGradient colors={[colors.knobFrom, colors.knobTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.knob}>
      <ArrowRightIcon />
    </LinearGradient>
  </Pressable>
);

export const GoogleButton = ({ onPress, title = 'Continuar con Google' }: { onPress: () => void; title?: string }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [s.google, { boxShadow: pressed ? shadows.pressed : shadows.raisedSm }]}
  >
    <GoogleIcon />
    <Text style={s.googleText}>{title}</Text>
  </Pressable>
);

export const OrDivider = ({ text = 'o con tu correo' }: { text?: string }) => (
  <View style={s.divider}>
    <View style={s.line} />
    <Text style={s.dividerText}>{text}</Text>
    <View style={s.line} />
  </View>
);

/** Enlace en negrita con subrayado de acento */
export const NeuLink = ({ children, onPress, italic }: { children: string; onPress: () => void; italic?: boolean }) => (
  <Text
    accessibilityRole="link"
    onPress={onPress}
    style={{
      fontFamily: italic ? fonts.bodyItalic : fonts.bodyBold, color: colors.inkStrong,
      textDecorationLine: 'underline', textDecorationColor: accentA(0.5),
    }}
  >
    {children}
  </Text>
);

export const NeuCheckbox = ({
  checked, onChange, children,
}: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) => (
  <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => onChange(!checked)} style={s.checkRow}>
    <View style={[s.check, { boxShadow: shadows.check }]}>{checked && <View style={s.tick} />}</View>
    <Text style={s.checkText}>{children}</Text>
  </Pressable>
);

/** Código OTP de 6 dígitos (pegado, borrado, autocompletado). `error` pinta el aro de error. */
export const OtpInput = ({
  value, onChange, length = 6, error,
}: { value: string; onChange: (v: string) => void; length?: number; error?: boolean }) => {
  const refs = useRef<Array<any>>([]);
  const [focus, setFocus] = useState<number | null>(null);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const handle = (i: number, t: string) => {
    const clean = t.replace(/\D/g, '');
    if (clean.length > 1) {
      const next = clean.slice(0, length);
      onChange(next);
      refs.current[Math.min(next.length, length - 1)]?.focus();
      return;
    }
    const arr = digits.slice();
    arr[i] = clean;
    onChange(arr.join(''));
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <View accessibilityLabel={`Código de seguridad de ${length} dígitos`} style={{ flexDirection: 'row', gap: 8 }}>
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(r) => { refs.current[i] = r; }}
          value={d}
          onChangeText={(t) => handle(i, t)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !d && i > 0) refs.current[i - 1]?.focus();
          }}
          onFocus={() => setFocus(i)}
          onBlur={() => setFocus(null)}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={i === 0 ? length : 1}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          textContentType={i === 0 ? 'oneTimeCode' : 'none'}
          accessibilityLabel={`Dígito ${i + 1} de ${length}`}
          selectionColor={colors.accent}
          style={[
            s.otp,
            { boxShadow: error ? shadows.invalid : focus === i ? shadows.focus : shadows.inset, color: error ? colors.errorDark : colors.ink },
          ]}
        />
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.bg, borderRadius: radius.card, paddingHorizontal: 26, paddingTop: 28, paddingBottom: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)', boxShadow: shadows.card,
  },
  plateOuter: {
    alignSelf: 'center', width: 88, height: 88, borderRadius: 44, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center', boxShadow: shadows.plate,
  },
  plateInner: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center', boxShadow: shadows.inset,
  },
  badge: { position: 'absolute', top: 8, right: 8, width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: colors.bg },
  back: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: radius.row, backgroundColor: colors.bg, boxShadow: shadows.row },
  rowIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', boxShadow: shadows.insetSm },
  label: { fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1.26, textTransform: 'uppercase', color: colors.label },
  fieldWrap: { justifyContent: 'center' },
  fieldIcon: { position: 'absolute', left: 18, zIndex: 1 },
  input: { height: 52, borderRadius: radius.pill, backgroundColor: colors.bg, paddingLeft: 46, fontFamily: fonts.body, fontSize: 15, color: colors.text },
  eye: { position: 'absolute', right: 4, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  banner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14, paddingLeft: 20, paddingRight: 16,
    borderRadius: 18, backgroundColor: colors.bg, boxShadow: shadows.inset,
  },
  bannerBar: { position: 'absolute', left: 0, top: 12, bottom: 12, width: 3, borderRadius: 3, backgroundColor: colors.error },
  reqDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  primary: {
    height: 60, borderRadius: radius.pill, backgroundColor: colors.bg, paddingLeft: 28, paddingRight: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  primaryText: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink },
  knob: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', boxShadow: shadows.knob },
  google: { height: 52, borderRadius: radius.pill, backgroundColor: colors.bg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  googleText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.inkStrong },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 2, borderRadius: 2, backgroundColor: 'rgba(163,177,198,0.5)' },
  dividerText: { fontFamily: fonts.bodySemi, fontSize: 10.5, letterSpacing: 1.47, textTransform: 'uppercase', color: colors.muted },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  check: { width: 24, height: 24, borderRadius: radius.check, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  tick: { width: 11, height: 6, borderLeftWidth: 2.5, borderBottomWidth: 2.5, borderColor: colors.ink, transform: [{ rotate: '-45deg' }, { translateY: -1 }] },
  checkText: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: colors.label },
  otp: { flex: 1, minWidth: 0, height: 56, borderRadius: radius.otp, backgroundColor: colors.bg, textAlign: 'center', fontFamily: fonts.bodyBold, fontSize: 22, padding: 0 },
});
