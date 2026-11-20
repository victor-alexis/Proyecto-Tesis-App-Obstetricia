import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { session, loading, isRecovering } = useAuth();

  // Guardián de sesión: protege pantallas privadas.
  // Se omite la redirección si:
  //  - loading: aún inicializando la sesión.
  //  - isRecovering: flujo de recuperación de contraseña activo (no forzar /login).
  useEffect(() => {
    if (!loading && !session && !isRecovering) {
      router.replace('/login');
    }
  }, [session, loading, isRecovering]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}
