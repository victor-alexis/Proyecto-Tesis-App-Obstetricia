// Layout principal de la App Móvil (Expo Router Stack Navigation)

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppLoadingScreen, OfflineBanner } from '@/components/feedback';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Tema Clínico Personalizado: Fondo #F3F7FC permanente para evitar parpadeos negros nativos
const ClinicalTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F3F7FC',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#D8E4F2',
  },
};

function RootNavigator() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  // Blindaje absoluto en Web: fijar pantalla 100%, anular pinch-to-zoom y bloquear desplazamientos por teclado
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content =
        'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover';

      const preventZoom = (e: TouchEvent) => {
        if (e.touches && e.touches.length > 1) {
          e.preventDefault();
        }
      };
      const preventGesture = (e: Event) => e.preventDefault();
      document.addEventListener('touchstart', preventZoom, { passive: false });
      document.addEventListener('gesturestart', preventGesture);
      document.addEventListener('gesturechange', preventGesture);
      document.addEventListener('gestureend', preventGesture);

      const styleId = 'clinicalcase-screen-lock';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          html, body, #root {
            overflow: hidden !important;
            height: 100% !important;
            width: 100% !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overscroll-behavior: none !important;
            -webkit-overscroll-behavior: none !important;
            touch-action: manipulation !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            background-color: #F3F7FC !important;
          }
          input, textarea, select {
            font-size: 16px !important;
          }
        `;
        document.head.appendChild(style);
      }

      const resetScroll = () => {
        if (window.scrollX !== 0 || window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      };
      window.addEventListener('scroll', resetScroll);

      return () => {
        document.removeEventListener('touchstart', preventZoom);
        document.removeEventListener('gesturestart', preventGesture);
        document.removeEventListener('gesturechange', preventGesture);
        document.removeEventListener('gestureend', preventGesture);
        window.removeEventListener('scroll', resetScroll);
      };
    }
  }, []);

  if (loading) {
    return <AppLoadingScreen message="Iniciando sesión segura..." />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={ClinicalTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
