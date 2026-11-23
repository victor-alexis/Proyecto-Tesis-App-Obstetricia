/**
 * AppLoadingScreen.tsx
 * Pantalla de carga clínica estilizada para transiciones sin parpadeos negros.
 * Mantiene la atmósfera neumórfica #EEF2F6 de ClinicalCase con pulso suave y estado de seguridad.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Wordmark, colors, fonts } from '@/components/ui';

interface AppLoadingScreenProps {
  message?: string;
}

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  message = 'Cargando entorno clínico seguro...',
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Isotipo / Brand con animación de pulso sutil */}
        <Animated.View style={[styles.brandContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Wordmark size={46} />
        </Animated.View>

        <Text style={styles.brandSubtitle}>
          Sistema de Soporte a la Decisión Clínica y Seguimiento Perinatal
        </Text>

        {/* Indicador de carga médica */}
        <View style={styles.loaderBox}>
          <ActivityIndicator size={16} color={colors.accent} />
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    fontFamily: fonts.body,
    textAlign: 'center',
    maxWidth: 270,
    marginBottom: 32,
  },
  loaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    boxShadow: '6px 6px 14px rgba(163,177,198,0.6), -6px -6px 14px rgba(255,255,255,0.95)',
  },
  messageText: {
    fontSize: 13,
    color: colors.ink,
    fontFamily: fonts.bodySemi,
    marginLeft: 10,
  },
});
