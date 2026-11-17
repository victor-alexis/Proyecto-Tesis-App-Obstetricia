// Layout principal de la App Móvil (Carga de fuentes oficiales + Verificación de Sesión)

import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  PlayfairDisplay_600SemiBold_Italic,
  PlayfairDisplay_700Bold_Italic,
  PlayfairDisplay_800ExtraBold_Italic,
} from '@expo-google-fonts/playfair-display';

import { AnimatedSplashOverlay } from '@/components/feedback';
import { AppTabs } from '@/components/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginScreen from '@/app/login';

SplashScreen.preventAutoHideAsync();

function RootNavigationGate() {
  const { session, loading } = useAuth();

  // Carga de fuentes oficiales de Google Fonts para garantizar idéntica estética al Stitch
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
    'PlayfairDisplay-SemiBoldItalic': PlayfairDisplay_600SemiBold_Italic,
    'PlayfairDisplay-BoldItalic': PlayfairDisplay_700Bold_Italic,
    'PlayfairDisplay-ExtraBoldItalic': PlayfairDisplay_800ExtraBold_Italic,
  });

  useEffect(() => {
    if (!loading && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loading, fontsLoaded]);

  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F7FC' }}>
        <ActivityIndicator size="large" color="#0D5C91" />
      </View>
    );
  }

  // Si no hay sesión activa, muestra el LoginScreen idéntico
  if (!session) {
    return <LoginScreen />;
  }

  // Si el usuario está autenticado, tiene acceso a las pantallas principales de la app
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
