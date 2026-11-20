# Bitácora de Desarrollo (DevLog) - Proyecto Tesis App Obstetricia

Este archivo registra de forma cronológica todos los cambios técnicos, decisiones de arquitectura y funcionalidades implementadas en el proyecto. Permite a cualquier miembro del equipo saber exactamente qué se hizo, por qué y cómo probarlo.

---

### [2026-11-19] - Flujos Completos de Autenticación Blindados, SMTP Transaccional Brevo y Blindaje de Navegación OTP
* **Responsable:** Víctor Alexis & Asistente IA
* **Fase:** Fase 2 (Frontend Móvil & Autenticación de Seguridad Clínica)

#### ¿Qué se hizo?
1. **Configuración de SMTP Transaccional con Brevo:**
   - Se reemplazó el SMTP personal por Brevo Relay (`smtp-relay.brevo.com:587`), habilitando el envío confiable y sin bloqueos de correos transaccionales a cualquier dominio (Gmail, Outlook, `@alumnos.ulagos.cl`).
2. **Blindaje de Redirección en Recuperación de Contraseña (`login.tsx`):**
   - Se aisló el hook `useEffect` de `login.tsx` para que solo redirija al Home (`/`) si el usuario está físicamente en `/login` (`pathname === '/login'`), evitando que sesiones temporales de recuperación interrumpan la navegación hacia `/reset-password`.
3. **Fijación Estricta de OTP a 6 Dígitos (`OtpInput.tsx` y `verify-otp.tsx`):**
   - Se configuró la interfaz para 6 casilleros con espaciado ergonómico móvil (`codeLength = 6`), validación de longitud estricta y temporizador de reenvío.
4. **Rediseño Fiel de la Pantalla de Login:**
   - Se removió cualquier distorsión visual de SVGs pesados que provocaban un anillo deformado en web.
   - Implementación pulcra según el diseño de referencia: Fondo níveo clínico (`#F3F7FC`) con orbes bioluminiscentes suaves, botón conmutador de tema (`🌙`), tipografía serif itálica `ClinicalCase` con destellos `✦`, tarjeta blanca con esquinas de 24px, botón oficial de Google (`#2563EB`), botón de inicio de sesión (`#0D5C91`), badge institucional y aviso de seguridad clínica cifrada.
5. **Capa de Errores y Validaciones Blindadas (`src/utils/authErrors.ts`):**
   - Mapeo completo de errores de Supabase Auth a mensajes claros en español clínico.
   - Validador RFC 5322 para correos institucionales y personales.
   - Detección inteligente de `isEmailNotConfirmed` para redirigir directamente al OTP de activación si el usuario intenta acceder sin verificar su cuenta.
6. **Flujo de Registro y Recuperación con Verificación OTP:**
   - Soporte completo para registro y recuperación con OTP y actualización de contraseña.
7. **Verificación Técnica:**
   - `tsc --noEmit` completado con 0 errores de tipado.
   - `npx expo export --platform web` generó exitosamente los 9 paquetes estáticos de rutas.
   - Despliegue automático a GitHub y Vercel en la rama `main` (commit `c944d`).

---

### [2026-11-12] - Limpieza Integral del Proyecto e Implementación del Login Inicial
* **Responsable:** Víctor Alexis & Asistente IA
* **Fase:** Fase 2 (Frontend Móvil & Autenticación)

#### ¿Qué se hizo?
1. **Limpieza en la raíz:** Se eliminaron `node_modules/`, `package.json` y `package-lock.json` residuales de la raíz, dejando el workspace con una estructura limpia de solo 3 directorios (`.agents/`, `app_movil/`, `backend/`).
2. **Depuración de plantillas en Expo:** Se eliminaron scripts genéricos (`reset-project.js`) y componentes de ejemplo (`hint-row.tsx`, `web-badge.tsx`).
3. **Flujo de Login como Primera Instancia:**
   * Se creó `app_movil/src/app/login.tsx` con diseño clínico y soporte para Google OAuth (cuentas institucionales y personales).
   * Se actualizó `app_movil/src/app/_layout.tsx` con un guardián de navegación (`RootNavigationGate`) que exige autenticación antes de dar acceso a la app.
   * Se rediseñó `app_movil/src/app/index.tsx` como el panel clínico del usuario autenticado y `app_movil/src/app/explore.tsx` como el módulo de consultas RAG.
4. **Verificación Técnica:** Se ejecutó `npx tsc --noEmit` en `app_movil` y chequeo de sintaxis en `backend/src/` con 0 errores.

---

### [2026-11-11] - Actualización de Roadmap: Conexión Vercel, Supabase, Google Auth y Login Inicial
* **Responsable:** Víctor Alexis & Asistente IA
* **Fase:** Fase 2 (Infraestructura Cloud, Despliegue y Autenticación)

#### ¿Qué se hizo?
1. Se reestructuró la Fase 2 en `FASES_PROYECTO.md` para priorizar la infraestructura cloud y el flujo de acceso:
   * Conexión y despliegue continuo con **Vercel**.
   * Conexión y persistencia con **Supabase**.
   * Integración de autenticación unificada con **Google OAuth** (para cuentas institucionales universitarias/hospitalarias y cuentas personales `@gmail.com`).
   * Creación de la pantalla de **Login como primera instancia** en la app móvil (`app_movil/src/app/login.tsx`) para proteger el acceso antes de mostrar las vistas clínicas.
2. Se actualizaron `GUIA_COMPANERO.md` y `examples/respuestas-onboarding.md` con las variables de entorno necesarias y la indicación de trabajo para el equipo.

#### Decisiones de Arquitectura
* Priorizar la autenticación desde el inicio garantiza que cualquier dato de paciente o caso clínico que se pruebe en etapas posteriores esté debidamente protegido por políticas RLS y vinculado a una sesión de usuario válida.

---

### [2026-11-11] - Pausa y Archivado de la Skill de Cálculos Obstétricos
* **Responsable:** Víctor Alexis & Asistente IA
* **Fase:** Fase 2 (Ajuste de alcance)

#### ¿Qué se hizo?
* Se movió temporalmente la skill `calculos-obstetricos` a `.agents/archive/skills/calculos-obstetricos/` para desactivarla de la carga activa del agente.
* Las skills activas en uso quedan delimitadas a: `documentador-tesis`, `backend-rag-engine` y `expo-mobile-flow`.

#### Decisiones de Arquitectura
* Se mantiene el trabajo clínico y los casos de prueba a salvo en el archivo histórico sin que consuman espacio de descubrimiento en el agente mientras la prioridad se concentra en la arquitectura del backend y el motor RAG.

---

### [2026-11-11] - Implementación de Arquitectura Escalable de Skills Multidominio
* **Responsable:** Víctor Alexis & Asistente IA
* **Fase:** Fase 1 (Cierre definitivo) / Fase 2

#### ¿Qué se hizo?
1. Se refactorizó la skill `documentador-tesis` para aplicar el principio de revelación progresiva con subdirectorios `resources/plantillas.md` y `examples/respuestas-onboarding.md`.
2. Se estructuraron las 3 skills de dominio especializadas para la tesis bajo `.agents/skills/`:
   * `calculos-obstetricos/`: Reglas clínicas (Naegele, Parikh, LCN ecográfica) y casos de prueba validados en JSON.
   * `backend-rag-engine/`: Pipeline de ingesta, vectorización y consultas RAG perinatales con Supabase pgvector.
   * `expo-mobile-flow/`: Convenciones de navegación y buenas prácticas con Expo Router y componentes UI.

#### Decisiones de Arquitectura
* Se evitó saturar el contexto del agente dividiendo las responsabilidades en micro-skills con carpetas auxiliares (`references/`, `examples/`, `resources/`). El agente solo carga los manuales y casos clínicos cuando la tarea lo requiere.

---

### [2026-11-11] - Implementación de Sistema de Documentación Viva y Skill de Traspaso
* **Responsable:** Víctor Alexis & Asistente IA
* **Fase:** Fase 1 (Cierre) / Fase 2 (Inicio)

#### ¿Qué se hizo?
1. Se creó la meta-habilidad `.agents/skills/documentador-tesis/SKILL.md` para estandarizar la mantención de la documentación de avance de la tesis.
2. Se definieron las 5 fases globales del proyecto en `docs/FASES_PROYECTO.md`.
3. Se creó la guía de inducción rápida para compañeros de equipo en `docs/GUIA_COMPANERO.md`.
4. Se inició esta bitácora oficial (`docs/BITACORA_DEV.md`).

#### Decisiones de Arquitectura
* Se adopta el estándar de "revelación progresiva" mediante skills para que cualquier agente de IA o desarrollador pueda ubicarse en segundos al abrir el proyecto en local.

---

### [2026-11-10] - Estructuración Modular del Backend
* **Responsable:** Víctor Alexis
* **Fase:** Fase 1

#### ¿Qué se hizo?
* Se organizó el directorio `backend/src/` bajo arquitectura modular limpia:
  * `config/`: Ajustes del servidor y variables de entorno.
  * `infrastructure/storage/`: Clientes de base de datos y persistencia (Supabase / Postgres).
  * `modules/clinicalCases/`: Lógica de negocio para casos clínicos perinatales.
  * `modules/embeddings/`: Procesamiento y vectorización de documentos de salud.
  * `modules/rag/`: Recuperación contextual y generación asistida por IA.
  * `shared/middleware/`: Manejo de errores y seguridad de peticiones.
* Se inicializó `backend/package.json` configurado como módulo ES (`"type": "module"`).

---

### [2026-11-09] - Inicialización de App Móvil Expo y Dependencias Base
* **Responsable:** Víctor Alexis
* **Fase:** Fase 1

#### ¿Qué se hizo?
1. Se generó la aplicación móvil base utilizando Expo Router: `npx create-expo-app app_movil`.
2. Se instalaron dependencias críticas:
   * `@supabase/supabase-js`: Cliente para autenticación y base de datos.
   * `axios`: Cliente HTTP para conexión con el backend local/remoto.
   * `@react-native-async-storage/async-storage`: Almacenamiento local seguro en el dispositivo móvil.
3. Se redactó `app_movil/AGENTS.md` con las reglas obligatorias de desarrollo para evitar incompatibilidades entre versiones de Expo y bibliotecas nativas.

#### Comandos para probar la app móvil:
```bash
cd app_movil
npx expo start
```

