import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export interface ShineBorderProps {
  children: React.ReactNode;
  /** Ancho del borde animado en píxeles. Por defecto: 2 */
  borderWidth?: number;
  /** Radio de curvatura exterior. Por defecto: 18 */
  borderRadius?: number;
  /** Duración de la rotación completa en segundos. Por defecto: 8 */
  duration?: number;
  /** Colores del gradiente clínico. Por defecto: Paleta Obstétrica (Azul, Celeste, Blanco) */
  colors?: readonly [string, string, ...string[]];
  /** Color de fondo del contenedor interior. Por defecto: #FFFFFF */
  backgroundColor?: string;
  /** Estilos opcionales para el contenedor exterior */
  style?: StyleProp<ViewStyle>;
  /** Estilos opcionales para el contenedor del contenido */
  contentStyle?: StyleProp<ViewStyle>;
}

export const ShineBorder: React.FC<ShineBorderProps> = ({
  children,
  borderWidth = 2,
  borderRadius = 18,
  duration = 8,
  colors = ['#2B6CB0', '#63B3ED', '#EBF8FF', '#2B6CB0'] as const,
  backgroundColor = '#FFFFFF',
  style,
  contentStyle,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: duration * 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [duration, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height });
    }
  };

  // El tamaño del gradiente en rotación debe cubrir la diagonal del contenedor
  const maxDim = Math.max(dimensions.width, dimensions.height);
  const gradientSize = maxDim > 0 ? maxDim * 1.6 : 300;

  const innerRadius = Math.max(0, borderRadius - borderWidth);

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.outerContainer,
        {
          borderRadius,
        },
        style,
      ]}
    >
      {/* Halo del Gradiente Animado */}
      <View style={[StyleSheet.absoluteFill, styles.overflowHidden, { borderRadius }]}>
        <Animated.View
          style={[
            styles.gradientWrapper,
            {
              width: gradientSize,
              height: gradientSize,
              top: (dimensions.height - gradientSize) / 2,
              left: (dimensions.width - gradientSize) / 2,
            },
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Contenedor Interior donde vive el contenido hijo */}
      <View
        style={[
          styles.innerContainer,
          {
            margin: borderWidth,
            borderRadius: innerRadius,
            backgroundColor,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  gradientWrapper: {
    position: 'absolute',
  },
  innerContainer: {
    overflow: 'hidden',
    zIndex: 1,
  },
});

