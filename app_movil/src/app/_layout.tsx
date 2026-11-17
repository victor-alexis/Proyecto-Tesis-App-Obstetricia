// Layout principal de la App Móvil (Verifica si existe sesión)

import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View, ActivityIndicator } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/feedback';
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F7FC' }}>
        <ActivityIndicator size="large" color="#0D5C91" />
      </View>
    );
  }

  // Si no hay sesión activa, muestra la pantalla de Login
  if (!session) {
    return <LoginScreen />;
  }

  // Si el usuario está autenticado, tiene acceso a las pantallas principales
  return <AppTabs />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <RootNavigationGate />
      </AuthProvider>
    </ThemeProvider>
  );
}
