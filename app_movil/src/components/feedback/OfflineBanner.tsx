/**
 * OfflineBanner.tsx
 * Banner sutil e inteligente para detección de conectividad en centros de salud.
 * Notifica al personal médico cuando se pierde internet sin bloquear el uso local de la app.
 */

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    // Suscripción al estado de red multiplataforma
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOffline) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -80,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, slideAnim]);

  if (!isOffline && Platform.OS === 'web' && typeof window !== 'undefined' && window.navigator.onLine) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bannerContainer,
        {
          paddingTop: Math.max(insets.top, 8),
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.badgeContent}>
        <WifiOff size={14} color="#991B1B" style={{ marginRight: 6 }} />
        <Text style={styles.bannerText}>
          Sin conexión a internet • Consultas RAG requieren red activa
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    shadowColor: '#991B1B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bannerText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#991B1B',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
