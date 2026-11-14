/* Importar Cliente Oficial de Supabase */
import { createClient } from '@supabase/supabase-js';
/* Importar Async: Alamacenamiento Local persistente para App Movil */
import AsyncStorage from '@react-native-async-storage/async-storage';

/* Obtener las variables de entorno */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

/* Verificar que las variables de entorno estén definidas */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase Mobile] Advertencia: EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY no están definidos en app_movil/.env'
  );
}

/* Crear el cliente de Supabase */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,       /* Almacenamiento Local*/
    autoRefreshToken: true,      /* Auto-actualización del token*/
    persistSession: true,        /* Persistencia de la sesión*/
    detectSessionInUrl: false,   /* No detectar sesión en la URL*/
  },
});

