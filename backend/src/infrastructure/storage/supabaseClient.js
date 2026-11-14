/* Cliente para la base de datos Supabase */
import { createClient } from '@supabase/supabase-js';
/* Importar configuración */
import { config } from '../../config/index.js';

// Cliente global
let supabaseClient = null; 

/**
 * Obtiene el cliente de Supabase para operaciones de backend.
 * Si las credenciales no están configuradas en .env, advierte en consola
 * sin detener abruptamente el servidor para facilitar el desarrollo local.
 */

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }
  //
  const { url, serviceRoleKey, anonKey } = config.supabase;
  const key = serviceRoleKey || anonKey;

  if (!url || !key) {
    console.warn(
      '[Supabase] Advertencia: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados en .env. El cliente se ejecutará en modo dummy/no conectado.'
    );
    return null;
  }

  supabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseClient;
}

