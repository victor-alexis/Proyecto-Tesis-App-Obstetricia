// Animaciones de ClinicalCase: splash + aparición escalonada de campos.
// Una sola línea de tiempo (segundos) en un shared value; cada elemento deriva su estilo de ella.
// Requiere react-native-reanimated.
import React, { ReactNode, useEffect, useRef } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, accentA } from './tokens';

/** Tiempos (s) del Splash Login inicial. */
export const T = {
  wordStart: 0.35,
  wordStep: 0.075, // letras del nombre
  dot: 1.55,
  tag: 1.95, // punto rojo y subtítulo
  move: 3.0,
  moveDur: 1.2, // el nombre sube a su lugar
  card: 3.8, // entra la tarjeta
  bar: 4.5,
  title: 4.6,
  sub: 4.78,
  google: 5.0,
  divider: 5.25,
  email: 5.5,
  pass: 5.75,
  button: 6.05,
  signup: 6.3,
  footer: 6.55,
  end: 7.4,
};

/** Tiempos rápidos (s) para pantallas de navegación individual (register, otp, forgot, reset). */
export const T_FAST = {
  topBar: 0.04,
  card: 0.1,
  plate: 0.14,
  header: 0.18,
  subtitle: 0.22,
  google: 0.26,
  divider: 0.3,
  field1: 0.34,
  field2: 0.4,
  field3: 0.46,
  meter: 0.5,
  checkbox: 0.52,
  button: 0.56,
  footer: 0.62,
  end: 0.75,
};

// ── funciones de tiempo (worklets: corren en el hilo de UI) ──
const clamp01 = (v: number) => {
  'worklet';
  return Math.min(1, Math.max(0, v));
};
export const easeOut = (x: number) => {
  'worklet';
  return 1 - Math.pow(1 - x, 3);
};
export const easeInOut = (x: number) => {
  'worklet';
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOutBack = (x: number) => {
  'worklet';
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** progreso 0→1 de un elemento que empieza en `start` y dura `dur` */
export const prog = (t: number, start: number, dur: number) => {
  'worklet';
  return easeOut(clamp01((t - start) / dur));
};

let alreadyPlayed = false; // el splash completo solo la primera vez por sesión

/** Línea de tiempo. Se salta si el usuario tiene "reducir movimiento" o ya se reprodujo. */
export function useTimeline(opts: { once?: boolean } = {}) {
  const reduce = useReducedMotion();
  const skip = reduce || (opts.once && alreadyPlayed);
  const t = useSharedValue(skip ? T.end : 0);

  useEffect(() => {
    if (skip) return;
    t.value = withTiming(T.end, { duration: T.end * 1000, easing: Easing.linear });
    alreadyPlayed = true;
  }, [skip, t]);

  return t;
}

/** Línea de tiempo rápida para pantallas individuales y navegación fluida. */
export function useScreenTimeline(duration: number = T_FAST.end) {
  const reduce = useReducedMotion();
  const t = useSharedValue(reduce ? duration : 0);

  useEffect(() => {
    if (reduce) return;
    t.value = withTiming(duration, {
      duration: duration * 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [reduce, t, duration]);

  return t;
}

/** Aparición escalonada: envuelve cualquier campo/botón y dale su `start` (ver T). */
export function At({
  t,
  start,
  dur = 0.6,
  dy = 14,
  style,
  children,
}: {
  t: SharedValue<number>;
  start: number;
  dur?: number;
  dy?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const a = useAnimatedStyle(() => {
    const k = prog(t.value, start, dur);
    return { opacity: k, transform: [{ translateY: (1 - k) * dy }] };
  });
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

function Letter({
  ch,
  i,
  t,
  size,
}: {
  ch: string;
  i: number;
  t: SharedValue<number>;
  size: number;
}) {
  const a = useAnimatedStyle(() => {
    const k = prog(t.value, T.wordStart + i * T.wordStep, 0.7);
    return { opacity: k, transform: [{ translateY: (1 - k) * 12 }] };
  });
  return (
    <Animated.Text
      style={[
        {
          fontFamily: fonts.displayItalic,
          fontSize: size,
          lineHeight: size * 1.1,
          letterSpacing: -0.01 * size,
          color: colors.wordmark,
        },
        a,
      ]}
    >
      {ch}
    </Animated.Text>
  );
}

/** Nombre animado: aparece letra a letra en el centro y luego sube a su lugar en el login. */
export function AnimatedWordmark({
  t,
  size = 55,
}: {
  t: SharedValue<number>;
  size?: number;
}) {
  const { height } = useWindowDimensions();
  const ref = useRef<View>(null);
  const off = useSharedValue(0); // distancia centro → posición final
  const d = Math.round(size * 0.14);

  const onLayout = (_: LayoutChangeEvent) => {
    (ref.current as any)?.measureInWindow?.((_x: number, y: number, _w: number, h: number) => {
      off.value = height * 0.48 - (y + h / 2);
    });
  };
  const move = useAnimatedStyle(() => {
    const k = easeInOut(Math.min(1, Math.max(0, (t.value - T.move) / T.moveDur)));
    return {
      transform: [
        { translateY: off.value * (1 - k) },
        { scale: 1 + 0.12 * (1 - k) },
      ],
    };
  });
  const dot = useAnimatedStyle(() => {
    const k = prog(t.value, T.dot, 0.5);
    const kk = Math.min(1, Math.max(0, (t.value - T.dot) / 0.5));
    return {
      opacity: Math.min(1, (t.value - T.dot) / 0.15),
      transform: [{ scale: easeOutBack(kk) }],
    };
  });
  const ring = useAnimatedStyle(() => {
    const k = Math.min(1, Math.max(0, (t.value - (T.dot + 0.07)) / 1.0));
    return {
      opacity: k > 0 && k < 1 ? 0.7 * (1 - k) : 0,
      transform: [{ scale: 1 + k * 3.4 }],
    };
  });
  const tag = useAnimatedStyle(() => {
    const k = prog(t.value, T.tag, 0.8);
    return { opacity: k, transform: [{ translateY: (1 - k) * 8 }] };
  });

  return (
    <Animated.View
      ref={ref as any}
      onLayout={onLayout}
      style={[{ alignItems: 'center', gap: 8 }, move]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        {[...'ClinicalCase'].map((c, i) => (
          <Letter key={i} ch={c} i={i} t={t} size={size} />
        ))}
        <Animated.View
          style={[
            {
              width: d,
              height: d,
              borderRadius: d / 2,
              marginLeft: 3,
              marginBottom: size * 0.2,
              backgroundColor: colors.accent,
            },
            dot,
          ]}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: d,
                height: d,
                borderRadius: d / 2,
                borderWidth: 1.5,
                borderColor: accentA(0.6),
              },
              ring,
            ]}
          />
        </Animated.View>
      </View>
      <Animated.Text
        style={[
          {
            fontFamily: fonts.body,
            fontSize: 12,
            lineHeight: 18,
            color: colors.muted,
            textAlign: 'center',
            maxWidth: 270,
          },
          tag,
        ]}
      >
        Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
      </Animated.Text>
    </Animated.View>
  );
}

/** Fondo perlado con olas que se mueven muy despacio. */
export function SoftBackground() {
  const s = useSharedValue(0);
  useEffect(() => {
    s.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [s]);

  const w1 = useAnimatedStyle(() => ({
    transform: [{ translateX: (s.value - 0.5) * 28 }],
  }));
  const w2 = useAnimatedStyle(() => ({
    transform: [{ translateX: (0.5 - s.value) * 36 }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={['#F4F6F9', '#E9EEF4', '#F3EEEE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: -60,
            right: -60,
            bottom: 0,
            height: 320,
          },
          w2,
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 510 320" preserveAspectRatio="none">
          <Path
            d="M0 90 C 100 20, 210 170, 320 100 S 480 20, 510 80 L510 320 L0 320Z"
            fill="#CBD5E1"
            fillOpacity={0.3}
          />
        </Svg>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: -60,
            right: -60,
            bottom: 0,
            height: 220,
          },
          w1,
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 510 220" preserveAspectRatio="none">
          <Path
            d="M0 70 C 110 10, 230 130, 350 60 S 480 10, 510 60 L510 220 L0 220Z"
            fill="#FFFFFF"
            fillOpacity={0.55}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
