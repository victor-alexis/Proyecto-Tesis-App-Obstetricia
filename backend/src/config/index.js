// ============================================================
// backend/src/config/index.js
// Módulo central de configuración del servidor.
// Lee las variables de entorno desde el archivo .env y las
// exporta como un objeto tipado y seguro para usar en toda
// la aplicación sin repetir process.env en cada módulo.
// ============================================================

// --- IMPORTACIONES DE MÓDULOS DEL SISTEMA ---

// dotenv: Librería que lee el archivo .env y carga cada línea
// como una variable disponible en process.env
import dotenv from 'dotenv';

// path: Módulo nativo de Node.js para construir rutas de
// carpetas y archivos de forma segura entre distintos
// sistemas operativos (Windows, Linux, macOS)
import path from 'path';

// fileURLToPath: Convierte la URL del módulo actual
// (import.meta.url) a una ruta de archivo reconocible
// por el sistema. Necesario porque los módulos ES (ESM)
// no tienen __dirname ni __filename por defecto
import { fileURLToPath } from 'url';


// ============================================================
// COMPATIBILIDAD CON __dirname EN MÓDULOS ES (ESM)
// ============================================================
// En Node.js tradicional (CommonJS) existía la variable
// global __dirname que apuntaba a la carpeta del archivo
// actual. En ESM (con "type": "module" en package.json)
// esa variable no existe, por lo que se reconstruye así:
//
//   import.meta.url        → ej: "file:///C:/...backend/src/config/index.js"
//   fileURLToPath(...)     → "C:\...\backend\src\config\index.js"
//   path.dirname(...)      → "C:\...\backend\src\config"
//
// Resultado: __dirname apunta a backend/src/config/
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// ============================================================
// CARGA DE VARIABLES DE ENTORNO DESDE .env
// ============================================================

// ESTRATEGIA 1 — Ruta relativa al archivo de configuración:
// Resuelve la ruta del .env subiendo 3 niveles desde la
// carpeta actual (config → src → backend → raíz del backend).
// Esto funciona sin importar desde qué directorio se arranque
// el servidor (ej: desde la raíz del proyecto o desde backend/)
//
//   __dirname = backend/src/config
//   ../../../backend/.env = backend/.env   ✓
dotenv.config({ path: path.resolve(__dirname, '../../../backend/.env') });

// ESTRATEGIA 2 — Directorio de trabajo actual (CWD):
// Si la estrategia 1 no encuentra el .env (porque la variable
// SUPABASE_URL ya fue inyectada por Vercel en producción, por
// ejemplo), este segundo intento no sobreescribe los valores
// ya cargados. Funciona como red de seguridad local.
dotenv.config();


// ============================================================
// OBJETO DE CONFIGURACIÓN CENTRAL — Exportado a toda la app
// ============================================================
// En lugar de llamar process.env.XXX en cada archivo del
// proyecto, todos los módulos importan este objeto config.
// Ventajas:
//   - Un único punto donde se definen valores por defecto
//   - Fácil de rastrear si falta alguna variable de entorno
//   - Elimina errores tipográficos al repetir strings de env
export const config = {

  // Puerto donde escuchará el servidor Express.
  // Si no está definido en .env, usa 3000 como fallback.
  // Vercel inyecta su propio PORT automáticamente en producción.
  port: process.env.PORT || 3000,

  // Variables de Supabase agrupadas bajo su propio namespace
  supabase: {

    // URL base del proyecto Supabase.
    // Ejemplo: https://exwhibdfhajcwhdmpgez.supabase.co
    url: process.env.SUPABASE_URL || '',

    // Clave service_role: Privilegios máximos (God Mode).
    // Solo se usa en el servidor para operaciones
    // administrativas como indexar embeddings o validar tokens.
    // NUNCA debe exponerse en el frontend o en Git.
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

    // Clave anon: Pública con permisos restringidos por RLS.
    // El servidor puede usarla en endpoints de solo lectura
    // general donde no se requiere acceso administrativo.
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },

  // Variables de los servicios de Inteligencia Artificial
  ai: {

    // API Key de Google Gemini para generación de embeddings
    // y síntesis de respuestas clínicas en el motor RAG.
    // Si está vacía, el sistema usa el vector mock local.
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },
};
