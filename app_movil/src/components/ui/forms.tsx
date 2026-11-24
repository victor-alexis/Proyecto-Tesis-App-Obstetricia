import React, { ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  InputAccessoryView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fonts, radius, shadows } from './tokens';
import { EyeIcon, EyeOffIcon, InfoIcon } from './icons';
import { useKeyboardScroll } from './motion';

const isWeb = Platform.OS === 'web';

function getDomInputElement(node: any): HTMLInputElement | null {
  if (!isWeb || !node) return null;
  if (typeof HTMLInputElement !== 'undefined' && node instanceof HTMLInputElement) return node;
  const nested = node?.querySelector?.('input');
  return typeof HTMLInputElement !== 'undefined' && nested instanceof HTMLInputElement ? nested : null;
}

/**
 * En Safari iOS PWA, aplica atributos DOM estables que React Native Web no expone
 * (sin regenerar `name` en cada pulsación de tecla ni romper el toggle de contraseña).
 */
function useWebInputRef(
  forwardedRef: React.ForwardedRef<any>,
  opts: { secure?: boolean; masked?: boolean; fieldId?: string; enterKeyHint?: string }
) {
  const internalRef = useRef<any>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const refCallback = useCallback(
    (node: any) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as any).current = node;

      const el = getDomInputElement(node);
      if (!el) return;

      el.setAttribute('autocomplete', opts.secure ? 'new-password-off' : 'cc-nope');
      if (!el.getAttribute('name')) {
        el.setAttribute('name', `cc_${opts.fieldId || 'field'}_${uid}`);
      }
      el.setAttribute('data-cc-field', 'true');
      el.setAttribute('data-lpignore', 'true');
      el.setAttribute('data-1p-ignore', 'true');
      el.setAttribute('data-form-type', 'other');
      if (opts.secure) {
        el.type = 'text';
        el.setAttribute('data-secure', opts.masked ? 'true' : 'false');
      }
      if (opts.enterKeyHint) {
        el.setAttribute('enterkeyhint', opts.enterKeyHint);
      }
      el.setAttribute('autocorrect', 'off');
      el.setAttribute('autocapitalize', 'off');
      el.setAttribute('spellcheck', 'false');
    },
    [forwardedRef, opts.secure, opts.masked, opts.fieldId, opts.enterKeyHint, uid]
  );

  useEffect(() => {
    const el = getDomInputElement(internalRef.current);
    if (!el || !opts.secure) return;
    el.type = 'text';
    el.setAttribute('data-secure', opts.masked ? 'true' : 'false');
  }, [opts.secure, opts.masked]);

  return { refCallback, internalRef };
}

export const EMPTY_ACCESSORY_ID = 'CC_EmptyAccessoryBar';
export const IOS_EMPTY_ACCESSORY_ID = Platform.OS === 'ios' ? EMPTY_ACCESSORY_ID : undefined;

/**
 * Accessory view global único (altura 0) para suprimir en iOS la barra blanca
 * predeterminada `< > (✓)` sin colisiones de `nativeID` duplicados.
 */
export const GlobalEmptyInputAccessory = () =>
  Platform.OS === 'ios' ? (
    <InputAccessoryView nativeID={EMPTY_ACCESSORY_ID} backgroundColor="transparent">
      <View style={{ height: 0, overflow: 'hidden' }} />
    </InputAccessoryView>
  ) : null;

export interface NeuInputProps extends TextInputProps {
  label: string;
  icon: ReactNode;
  secure?: boolean;
  error?: string;
  rightLabel?: ReactNode;
}

/** Campo hundido. `error` muestra aro y mensaje de error accesible. Soporta ref para navegación por teclado. Suprime barras de accesorios de iOS nativo y popups de AutoFill de Safari PWA. */
export const NeuInput = React.forwardRef<any, NeuInputProps>(
  (
    {
      label,
      icon,
      secure,
      error,
      rightLabel,
      keyboardType,
      inputMode,
      autoComplete,
      textContentType,
      returnKeyType,
      style,
      onFocus,
      onBlur,
      ...props
    },
    forwardedRef
  ) => {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(!!secure);
    const containerRef = useRef<any>(null);
    const kb = useKeyboardScroll();
    const shadow = error ? shadows.invalid : focused ? shadows.focus : shadows.inset;

    // Map returnKeyType a enterkeyhint para Web
    const enterKeyHint =
      returnKeyType === 'next'
        ? 'next'
        : returnKeyType === 'go'
          ? 'go'
          : returnKeyType === 'send'
            ? 'send'
            : returnKeyType === 'done'
              ? 'done'
              : 'done';

    const { refCallback } = useWebInputRef(forwardedRef, {
      secure,
      masked: hidden,
      fieldId: label.replace(/\s+/g, '_').toLowerCase(),
      enterKeyHint,
    });

    // En Web/Safari iOS: usar inputMode="email" en lugar de type="email" y -webkit-text-security en lugar de type="password"
    // evita que Safari dispare los popups nativos de "contraseña de este sitio" y "¿Usar contraseña segura?".
    const resolvedKeyboardType =
      isWeb && keyboardType === 'email-address' ? undefined : keyboardType;
    const resolvedInputMode =
      inputMode ?? (keyboardType === 'email-address' ? 'email' : undefined);

    return (
      <View ref={containerRef as any} style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={s.label}>{label}</Text>
          {rightLabel}
        </View>
        <View style={s.fieldWrap}>
          <View style={s.fieldIcon} pointerEvents="none">
            {icon}
          </View>
          <TextInput
            ref={refCallback as any}
            accessibilityLabel={label}
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            selectionColor={colors.accent}
            spellCheck={false}
            autoCorrect={false}
            {...props}
            keyboardType={resolvedKeyboardType}
            inputMode={resolvedInputMode}
            returnKeyType={returnKeyType}
            secureTextEntry={isWeb ? false : hidden}
            inputAccessoryViewID={IOS_EMPTY_ACCESSORY_ID}
            autoComplete={autoComplete ?? 'off'}
            textContentType={textContentType ?? (secure ? 'oneTimeCode' : 'none')}
            onFocus={(e) => {
              setFocused(true);
              kb?.scrollToField(containerRef);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[
              s.input,
              { boxShadow: shadow, paddingRight: secure ? 52 : 20 },
              isWeb && hidden ? ({ WebkitTextSecurity: 'disc' } as any) : null,
              style,
            ]}
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
  }
);
NeuInput.displayName = 'NeuInput';

export const InlineError = ({ children }: { children: string }) => (
  <View
    accessibilityRole="alert"
    accessibilityLiveRegion="polite"
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginLeft: 18,
      marginTop: 2,
    }}
  >
    <InfoIcon />
    <Text style={{ fontFamily: fonts.bodySemi, fontSize: 12, color: colors.errorDark }}>
      {children}
    </Text>
  </View>
);

export const OrDivider = ({ text = 'o con tu correo' }: { text?: string }) => (
  <View style={s.divider}>
    <View style={s.line} />
    <Text style={s.dividerText}>{text}</Text>
    <View style={s.line} />
  </View>
);

export const NeuCheckbox = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) => (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    onPress={() => onChange(!checked)}
    style={s.checkRow}
  >
    <View style={[s.check, { boxShadow: shadows.check }]}>
      {checked && <View style={s.tick} />}
    </View>
    <Text style={s.checkText}>{children}</Text>
  </Pressable>
);

/** Código OTP de 6 dígitos (pegado, borrado, autocompletado). `error` pinta el aro de error. */
export const OtpInput = ({
  value,
  onChange,
  length = 6,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: boolean;
}) => {
  const refs = useRef<Array<any>>([]);
  const containerRef = useRef<any>(null);
  const otpUid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const kb = useKeyboardScroll();
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
    <View
      ref={containerRef as any}
      accessibilityLabel={`Código de seguridad de ${length} dígitos`}
      style={{ flexDirection: 'row', gap: 8 }}
    >
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            refs.current[i] = r;
            const el = getDomInputElement(r);
            if (el && !el.dataset.ccOtpBound) {
              el.dataset.ccOtpBound = '1';
              el.setAttribute('autocomplete', i === 0 ? 'one-time-code' : 'cc-nope');
              el.setAttribute('name', `cc_otp_${otpUid}_${i}`);
              el.setAttribute('data-cc-field', 'true');
              el.setAttribute('enterkeyhint', i === length - 1 ? 'done' : 'next');
            }
          }}
          value={d}
          onChangeText={(t) => handle(i, t)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !d && i > 0) refs.current[i - 1]?.focus();
          }}
          onFocus={() => {
            setFocus(i);
            kb?.scrollToField(containerRef);
          }}
          onBlur={() => setFocus(null)}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={i === 0 ? length : 1}
          inputAccessoryViewID={IOS_EMPTY_ACCESSORY_ID}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          textContentType={i === 0 ? 'oneTimeCode' : 'none'}
          accessibilityLabel={`Dígito ${i + 1} de ${length}`}
          selectionColor={colors.accent}
          style={[
            s.otp,
            {
              boxShadow: error ? shadows.invalid : focus === i ? shadows.focus : shadows.inset,
              color: error ? colors.errorDark : colors.ink,
            },
          ]}
        />
      ))}
    </View>
  );
};

const s = StyleSheet.create({
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.26,
    textTransform: 'uppercase',
    color: colors.label,
  },
  fieldWrap: { justifyContent: 'center' },
  fieldIcon: { position: 'absolute', left: 18, zIndex: 1 },
  input: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    paddingLeft: 46,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
  },
  eye: {
    position: 'absolute',
    right: 4,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 2, borderRadius: 2, backgroundColor: 'rgba(163,177,198,0.5)' },
  dividerText: {
    fontFamily: fonts.bodySemi,
    fontSize: 10.5,
    letterSpacing: 1.47,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.check,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    width: 11,
    height: 6,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.ink,
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
  checkText: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 18, color: colors.label },
  otp: {
    flex: 1,
    minWidth: 0,
    height: 56,
    borderRadius: radius.otp,
    backgroundColor: colors.bg,
    textAlign: 'center',
    fontFamily: fonts.bodyBold,
    fontSize: 22,
    padding: 0,
  },
});
