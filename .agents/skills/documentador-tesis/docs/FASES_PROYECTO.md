# Fases del Proyecto de Tesis: App Obstetricia

> **Estado General:** `Fase 2 Completada con éxito (Cloud + Auth) -> Iniciando Fase 3: Persistencia, Modelado Clínico y Privacidad`  
> **Última actualización:** 2026-11-15  
> **Autores:** Equipo de Tesis (Víctor Alexis & Compañero)

---

## Leyenda de Estados
* `[x]` Completado
* `[>]` En Progreso / Activo (Próximo paso inmediato)
* `[ ]` Pendiente

---

## Fase 1: Inicialización y Arquitectura Base
*Objetivo: Establecer la estructura del repositorio, dependencias base y reglas para el asistente de desarrollo.*

- [x] Configuración inicial del repositorio y monorepo conceptual (`app_movil/` y `backend/`).
- [x] Configuración de la aplicación móvil con Expo (`npx create-expo-app app_movil`) y Expo Router.
- [x] Instalación de dependencias core móviles (`axios`, `@supabase/supabase-js`, `@react-native-async-storage/async-storage`).
- [x] Instalación de dependencias del backend (`express`, `cors`, `dotenv`, `@supabase/supabase-js`).
- [x] Definición de directrices de desarrollo móvil en `app_movil/AGENTS.md`.
- [x] Creación del esqueleto modular del backend (`config`, `infrastructure/storage`, `modules/clinicalCases`, `modules/embeddings`, `modules/rag`, `shared/middleware`).
- [x] Centralización de skills y sistema de documentación viva en `.agents/skills/documentador-tesis/`.

---

## Fase 2: Infraestructura Cloud, Despliegue y Autenticación con Google (¡COMPLETADA!)
*Objetivo: Establecer la conexión cloud (Vercel + Supabase) y crear el Login como primera pantalla de acceso a la aplicación.*

- [x] **Paso 2.1: Conexión y Despliegue en Vercel:**
  - Configuración del proyecto en Vercel para despliegue continuo monorepo (App Web Expo + Backend Express en un solo dominio).
  - Configuración de `vercel.json` con enrutamiento de bundles estáticos `_expo`, assets y fallback SPA.
  - Sincronización de variables de entorno de producción (`SUPABASE_*` y `EXPO_PUBLIC_*`).
- [x] **Paso 2.2: Conexión con Supabase y Configuración de Proveedor Google:**
  - Configuración del proyecto en Supabase (URL y claves de API).
  - Habilitación del proveedor Google OAuth en Supabase Auth y Google Cloud Console.
  - Soporte dual de inicio de sesión:
    - Cuentas de correo institucionales (docentes / estudiantes de salud).
    - Cuentas de correo personales (`@gmail.com` para pacientes y usuarios externos).
- [x] **Paso 2.3: Pantalla y Flujo de Login como Primera Instancia en App Móvil:**
  - Implementación de pantalla inicial de Login (`app_movil/src/app/login.tsx`) con Google OAuth.
  - Protección de rutas con `Expo Router` (redirección obligatoria al Login en `_layout.tsx` si no hay sesión).
  - Persistencia de sesión y compatibilidad SSR (`ssrSafeStorage` en `services/supabase.ts`).
- [x] **Paso 2.4: Protección de Endpoints en Backend:**
  - Implementación de middleware `requireAuth` en `backend/src/shared/middleware/authMiddleware.js`.
  - Montaje de rutas protegidas en `backend/src/index.js` (`/api/cases` y `/api/rag`).
- [x] **Paso 2.5: Blindaje completo del flujo de autenticación Email/OTP (2026-11-19):**
  - Creado `authErrors.ts` con mapeo Supabase → errores en español y validador RFC 5322.
  - Reescrito `AuthContext.tsx` con métodos: `signUpWithEmail`, `verifySignupOtp`, `resendSignupOtp`, `sendPasswordResetOtp`, `verifyRecoveryOtp`, `updatePassword`.
  - Creado componente `OtpInput.tsx` (6 casilleros con timer de reenvío, pegado y autocompletado nativo).
  - Reescritas pantallas: `login.tsx`, `register.tsx`, `forgot-password.tsx`.
  - Nuevas pantallas: `verify-otp.tsx` (flujo unificado signup/recovery) y `reset-password.tsx`.
  - Build exportado con 0 errores TypeScript. Deploy en Vercel activo.
- [ ] **[PENDIENTE] Paso 2.6: Configurar dominio propio para email de producción (Resend SMTP):**
  - **Situación actual:** Resend en modo gratuito solo envía correos a `victoralexis.chile@gmail.com` (dirección registrada). No puede enviar OTPs a usuarios reales sin dominio propio verificado.
  - **SMTP configurado en Supabase** con `onboarding@resend.dev` (solo para pruebas internas).
  - **GitHub Student Pack rechazado** para cuenta `@victor8alexis`. Corregir antes de repostular:
    1. Desactivar VPN al momento de aplicar.
    2. Nombre en perfil GitHub debe coincidir exactamente con documento académico.
    3. Activar 2FA en GitHub (`github.com/settings/security`).
    4. Al seleccionar ULagos, marcar _"My selected school has incorrect or incomplete information"_.
    5. Adjuntar certificado de alumno regular 2026 emitido por ULagos.
  - **Alternativa sin Student Pack:** Namecheap dominio `.xyz` (~\$1 USD) + Cloudflare DNS + Zoho Mail Free (hasta 5 cuentas) + Resend con dominio verificado.
  - **Objetivo final:** Cambiar remitente de `onboarding@resend.dev` a `noreply@[dominio].cl` para enviar OTPs a cualquier usuario registrado.

---

## Fase 3: Persistencia, Modelado Clínico y Privacidad
*Objetivo: Garantizar la privacidad de fichas obstétricas y gestionar roles de usuario (profesional vs paciente).*

- [ ] Esquema de base de datos relacional en Supabase (tablas: `usuarios`, `pacientes`, `fichas_obstetricas`, `controles_prenatales`).
- [ ] Políticas de Row Level Security (RLS) en Supabase para cumplimiento ético/médico de datos sensibles.
- [ ] Mapeo de perfiles institucionales vs pacientes en la base de datos.

---

## Fase 4: Backend RAG y Casos Clínicos Obstétricos
*Objetivo: Implementar la recuperación vectorial de guías clínicas perinatales (MINSAL) y consulta de casos.*

- [ ] Implementación del módulo de Casos Clínicos (`backend/src/modules/clinicalCases`).
- [ ] Implementación del módulo de Embeddings (`backend/src/modules/embeddings`) con `pgvector` en Supabase.
- [ ] Endpoint de consulta contextual asistida (`POST /api/rag/query`).

---

## Fase 5: Frontend Móvil, Flujos Clínicos y Validación de Tesis
*Objetivo: Construir interfaces perinatales protegidas por sesión, pruebas de usuario y redacción de informe.*

- [ ] Vistas de control prenatal y registro perinatal para usuarios autenticados.
- [ ] Interfaz de consulta asistida por IA conectada al backend.
- [ ] Pruebas end-to-end (login -> consulta -> registro de datos).
- [ ] Métricas de rendimiento, validación con docentes y redacción del informe de tesis.
