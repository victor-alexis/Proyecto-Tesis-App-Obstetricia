/* Importar Cliente Oficial de Supabase */
import { createClient } from '@supabase/supabase-js';
/* Importar Async: Almacenamiento Local persistente para App Móvil */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/* Obtener las variables de entorno */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/* Adaptador de almacenamiento seguro para SSR (Static Site Generation / Node) */
const ssrSafeStorage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

/* Verificar que las variables de entorno estén definidas */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Mobile] Advertencia: EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY no están definidos en app_movil/.env'
  );
}

/* Crear el cliente de Supabase */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ssrSafeStorage,
    autoRefreshToken: Platform.OS !== 'web' || typeof window !== 'undefined',
    persistSession: Platform.OS !== 'web' || typeof window !== 'undefined',
    detectSessionInUrl: Platform.OS === 'web' && typeof window !== 'undefined',
  },
});

