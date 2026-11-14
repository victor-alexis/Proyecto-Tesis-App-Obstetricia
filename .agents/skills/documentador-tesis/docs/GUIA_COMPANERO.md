# Guía de Inducción para Compañeros de Equipo (Onboarding)

¡Bienvenido al proyecto de tesis **App Obstetricia**! Este documento está diseñado para que puedas clonar el repositorio, levantar el proyecto en tu computadora en menos de 5 minutos y entender qué se ha hecho y qué falta por hacer.

---

## 1. Visión General del Proyecto

Esta solución tecnológica busca asistir en la toma de decisiones clínicas y en el seguimiento perinatal mediante dos partes principales:
1. **`app_movil/`**: Aplicación móvil para Android/iOS construida con **React Native** y **Expo** (usando Expo Router). Permite ingresar datos obstétricos, calcular edad gestacional/FPP e interactuar con el sistema clínico.
2. **`backend/`**: Servidor Node.js con módulos de **RAG (Retrieval-Augmented Generation)**, **Embeddings** y **Casos Clínicos** para responder dudas clínicas con base en guías obstétricas oficiales (MINSAL/ACOG).
3. **Persistencia / Auth**: Supabase (Postgres + pgvector).

---

## 2. Requisitos Previos en tu Computadora

* **Node.js** (versión 18 o superior recomendada).
* **Git**.
* Para probar la app móvil en tu teléfono: Descarga **Expo Go** desde Google Play Store o App Store (o ten configurado un emulador Android/iOS).

---

## 3. Instalación Paso a Paso

### Paso A: Clonar e instalar dependencias

```bash
# 1. Clonar el repositorio y entrar a la carpeta
git clone <https://github.com/victor-alexis/Proyecto-Tesis-App-Obstetricia.git>
cd Proyecto-Tesis-App-Obstetricia

# 2. Instalar dependencias de la app móvil
cd app_movil
npm install

# 3. Instalar dependencias del backend
cd ../backend
npm install
```

---

## 4. ¿Cómo ejecutar el proyecto?

### Ejecutar la App Móvil
```bash
cd app_movil
npx expo start
```
* Presiona `a` para abrir en emulador de Android.
* O escanea el código QR desde la app **Expo Go** en tu celular (asegúrate de que tu celular y PC estén en la misma red Wi-Fi).

### Ejecutar el Backend
```bash
cd backend
npm run dev
# (Nota: Verifica que el script dev esté en package.json o ejecuta node src/index.js)
```

---

### Variables de Entorno Requeridas (.env)

#### En `app_movil/.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-supabase
```

#### En `backend/.env`:
```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role
SUPABASE_ANON_KEY=tu-clave-anonima-supabase
```

---

## 5. Reglas de Oro para Desarrollar (¡Importante!)

1. **Instalación de paquetes en la app móvil:**
   * **NUNCA** uses `npm install <libreria-nativa>` directamente en `app_movil` para librerías que tocan código nativo.
   * Usa siempre: `npx expo install <libreria>`. Esto garantiza que se instale la versión 100% compatible con el SDK de Expo actual.
2. **Carpetas `ios/` y `android/`:**
   * No edites carpetas nativas a mano; el proyecto usa *Continuous Native Generation (CNG)* mediante `app.json`.
3. **Antes de hacer commit:**
   * Ejecuta en `app_movil`:
     ```bash
     npx expo lint
     npx tsc --noEmit
     ```
4. **Al terminar una tarea:**
   * Deja una breve nota en `BITACORA_DEV.md` explicando qué hiciste.

---

## 6. ¿Dónde retomar el trabajo hoy? (¡Prioridad Activa!)

El siguiente paso obligatorio del proyecto es:
👉 **Fase 2: Conexión Cloud (Vercel + Supabase) & Autenticación Google (Login Inicial)**
1. **Conexión con Vercel:** Para hosting y despliegue del servicio.
2. **Conexión con Supabase:** Base de datos relacional y servicio de autenticación.
3. **Inicio de sesión con Google:** Habilitar acceso tanto para **cuentas institucionales** (estudiantes y profesionales de obstetricia) como **cuentas personales** (`@gmail.com`).
4. **Pantalla de Login como Primera Instancia:** Que la app móvil (`app_movil`) abra de entrada en la pantalla de inicio de sesión antes de permitir el acceso a las funciones perinatales.

Para revisar el detalle de tareas:
* 👉 [FASES_PROYECTO.md](./FASES_PROYECTO.md)
* 👉 [BITACORA_DEV.md](./BITACORA_DEV.md)

Si usas el asistente de IA en este proyecto, puedes preguntarle:  
> *"Hola, soy el compañero de equipo, ¿cuál es la siguiente tarea pendiente en las fases del proyecto?"*  
El agente leerá la skill `documentador-tesis` y te guiará paso a paso.

