// Layout principal de la App Móvil (Muestra LoginScreen directamente sin bloqueos)

import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AppTabs } from '@/components/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginScreen from '@/app/login';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigationGate() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loading]);

  // Si no hay sesión activa (o mientras verifica en segundo plano),
  // se muestra inmediatamente la pantalla de Login sin spinners bloqueantes
  if (!session) {
    return <LoginScreen />;
  }

  // Si el usuario ya está autenticado, ingresa a la aplicación
  return <AppTabs />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigationGate />
      </AuthProvider>
    </ThemeProvider>
  );
}
