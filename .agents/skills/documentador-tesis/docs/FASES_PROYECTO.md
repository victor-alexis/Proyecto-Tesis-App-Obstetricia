# Fases del Proyecto de Tesis: App Obstetricia

> **Estado General:** `Fase Activa: Conexión Cloud (Vercel + Supabase) & Autenticación Google (Login Inicial)`  
> **Última actualización:** 2026-11-11  
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

## Fase 2: Infraestructura Cloud, Despliegue y Autenticación con Google (¡PRIORIDAD ACTUAL!)
*Objetivo: Establecer la conexión cloud (Vercel + Supabase) y crear el Login como primera pantalla de acceso a la aplicación.*

- [>] **Paso 2.1: Conexión y Despliegue en Vercel:**
  - Configuración del proyecto en Vercel para despliegue continuo de endpoints y APIs.
  - Sincronización de variables de entorno de producción.
- [>] **Paso 2.2: Conexión con Supabase y Configuración de Proveedor Google:**
  - Configuración del proyecto en Supabase (URL y claves de API).
  - Habilitación del proveedor Google OAuth en Supabase Auth.
  - Soporte dual de inicio de sesión:
    - Cuentas de correo institucionales (docentes / estudiantes de salud).
    - Cuentas de correo personales (`@gmail.com` para pacientes y usuarios externos).
- [x] **Paso 2.3: Pantalla y Flujo de Login como Primera Instancia en App Móvil:**
  - Implementación de pantalla inicial de Login (`app_movil/src/app/login.tsx`) con Google OAuth.
  - Protección de rutas con `Expo Router` (redirección obligatoria al Login en `_layout.tsx` si no hay sesión).
  - Persistencia de sesión con `@react-native-async-storage/async-storage` en `AuthContext.tsx`.
- [x] **Paso 2.4: Protección de Endpoints en Backend:**
  - Implementación de middleware `requireAuth` en `backend/src/shared/middleware/authMiddleware.js`.
  - Montaje de rutas protegidas en `backend/src/index.js` (`/api/cases` y `/api/rag`).

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
