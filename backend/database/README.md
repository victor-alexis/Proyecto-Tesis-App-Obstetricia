# Sistema de Migraciones de Base de Datos - ClinicalCase

Este directorio centraliza y versiona todo el código SQL, esquemas de tablas, funciones, disparadores (*triggers*) y políticas de seguridad (*RLS*) de la base de datos Supabase (PostgreSQL).

---

## Estructura de Migraciones

| Archivo | Descripción | Estado |
| :--- | :--- | :---: |
| `01_auto_enable_rls_trigger.sql` | Disparador de eventos PostgreSQL que activa Row Level Security (RLS) automáticamente en toda tabla futura. | ✅ Activo |
| `02_perfiles_y_roles_rbac.sql` | *(Pendiente)* Tabla `public.perfiles`, enum de roles clínicos y disparador tras registro en `auth.users`. | ⏳ En espera |
| `03_fichas_obstetricas_y_rls.sql` | *(Pendiente)* Esquema de fichas clínicas perinatales, controles prenatales y políticas de privacidad. | ⏳ En espera |

---

## ¿Cómo aplicar estas migraciones?

### Opción 1: Desde el panel web de Supabase (Recomendado)
1. Entra a tu proyecto en [supabase.com/dashboard](https://supabase.com/dashboard).
2. Ve a **SQL Editor** en el menú izquierdo.
3. Copia el contenido del archivo `.sql` que desees aplicar.
4. Pega el código y haz clic en **Run** (Ejecutar).

### Opción 2: Respaldo en GitHub
Cada script `.sql` guardado en esta carpeta queda automáticamente versionado en Git, permitiendo restaurar la base de datos desde cero en cualquier momento o incluirlo como anexo en el informe final de tesis.
