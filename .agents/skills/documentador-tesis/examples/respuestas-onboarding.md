# Ejemplos de Respuesta para Inducción y Estado del Proyecto

Cuando un desarrollador o compañero de tesis consulte sobre el estado del proyecto, el agente debe formular una respuesta siguiendo este estilo conciso y de alta utilidad.

---

### Ejemplo 1: El compañero pregunta "¿En qué quedamos y qué me toca hacer?"

**Pregunta del usuario:**  
> *"Hola, soy el compañero de tesis. ¿En qué estado va el proyecto y qué tengo que programar hoy?"*

**Respuesta esperada del agente:**
> ¡Hola! Bienvenido de vuelta al proyecto. Este es el resumen del estado actual según la documentación viva:
>
> 1. **Fase Actual:** Estamos en la **Fase 2: Infraestructura Cloud, Despliegue y Autenticación Google**. Víctor cerró la base inicial y estructuró las dependencias de backend y móvil.
> 2. **Cómo probar el estado actual:**
>    * Móvil: `cd app_movil && npx expo start`
>    * Backend: `cd backend && npm run dev`
> 3. **Tu siguiente tarea prioritaria:**
>    * Establecer la conexión con **Vercel** y **Supabase**.
>    * Habilitar el proveedor **Google OAuth** en Supabase para permitir cuentas institucionales y personales.
>    * Crear la pantalla de **Login como primera instancia** en la app móvil (`app_movil/src/app/login.tsx`).
>    * Los detalles de la fase están en [FASES_PROYECTO.md](../docs/FASES_PROYECTO.md).

---

### Ejemplo 2: El usuario pregunta "¿Qué fue lo último que se hizo?"

**Pregunta del usuario:**  
> *"¿Qué fue lo último que se registró en la bitácora?"*

**Respuesta esperada del agente:**
> Según [docs/BITACORA_DEV.md](file:///c:/Users/dev/Git(Victor-Alexis)/Proyecto-Tesis-App-Obstetricia/docs/BITACORA_DEV.md), la última entrada registrada corresponde a:
> * **Fecha:** [Fecha de la última entrada]
> * **Hito:** [Título del cambio]
> * **Archivos clave:** [Lista de archivos principales tocados]
> * **Verificación:** [Comando utilizado para probar el cambio]

