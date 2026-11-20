// Layout principal de la App Móvil (Expo Router Stack Navigation)

import React, { useEffect } from 'react';
import { Stack, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppLoadingScreen } from '@/components/feedback';

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

  if (loading) {
    return <AppLoadingScreen message="Iniciando sesión segura..." />;
  }

  return (
    <>
      <StatusBar style="dark" />
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
