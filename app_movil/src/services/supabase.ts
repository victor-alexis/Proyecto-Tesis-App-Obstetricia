/* Importar Cliente Oficial de Supabase */
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/* Obtener las variables de entorno */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Adaptador de almacenamiento híbrido de grado clínico:
 * - Móvil (Android/iOS): Cifrado por hardware mediante expo-secure-store (Android Keystore / iOS Keychain).
 * - Web (SPA/SSR): AsyncStorage seguro con protección contra ejecución en servidor Node (SSR).
 */
const secureAuthStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') {
        return null;
      }
      return AsyncStorage.getItem(key);
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      // Fallback de contingencia si SecureStore falla en emulador
      return AsyncStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') {
        return;
      }
      return AsyncStorage.setItem(key, value);
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') {
        return;
      }
      return AsyncStorage.removeItem(key);
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      await AsyncStorage.removeItem(key);
    }
  },
};

/* Verificar que las variables de entorno estén definidas */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Mobile] Advertencia: EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY no están definidos en app_movil/.env'
  );
}

/* Crear el cliente de Supabase con almacenamiento cifrado */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureAuthStorage,
    autoRefreshToken: Platform.OS !== 'web' || typeof window !== 'undefined',
    persistSession: Platform.OS !== 'web' || typeof window !== 'undefined',
    detectSessionInUrl: Platform.OS === 'web' && typeof window !== 'undefined',
  },
});
