/**
 * AppLoadingScreen.tsx
 * Pantalla de carga clínica estilizada para transiciones sin parpadeos negros.
 * Mantiene la atmósfera #F3F7FC de ClinicalCase con pulso suave y estado de seguridad.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoginBackground } from '../auth/LoginBackground';

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
          toValue: 1.06,
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
      <LoginBackground />

      <View style={styles.content}>
        {/* Isotipo / Brand con animación de pulso sutil */}
        <Animated.View style={[styles.brandContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.iconCircle}>
            <Text style={styles.sparkle}>✦</Text>
          </View>
          <Text style={styles.brandTitle}>ClinicalCase</Text>
        </Animated.View>

        <Text style={styles.brandSubtitle}>Sistema Clínico Perinatal</Text>

        {/* Indicador de carga médica */}
        <View style={styles.loaderBox}>
          <ActivityIndicator size="small" color="#0D5C91" />
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  sparkle: {
    fontSize: 20,
    color: '#0D5C91',
    fontWeight: '700',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00446E',
    letterSpacing: -0.5,
    fontFamily: 'PlayfairDisplay-BoldItalic',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 32,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  loaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: '#D8E4F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#00446E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageText: {
    fontSize: 12.5,
    color: '#0D5C91',
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
