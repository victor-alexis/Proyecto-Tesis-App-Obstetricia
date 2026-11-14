# Plantillas para Bitácora y Fases

Usa estas plantillas al actualizar los archivos en `docs/`.

---

## 1. Plantilla para Nueva Entrada en `docs/BITACORA_DEV.md`

```markdown
### [AAAA-MM-DD] - <Título Descriptivo del Cambio o Hito>
* **Responsable:** <Nombre del desarrollador o "Equipo">
* **Fase:** <Fase correspondiente según FASES_PROYECTO.md>

#### ¿Qué se hizo?
1. <Detalle 1>
2. <Detalle 2>

#### Archivos involucrados
* `<ruta/al/archivo1>`: <breve descripción del cambio>
* `<ruta/al/archivo2>`: <breve descripción del cambio>

#### Decisiones Técnicas o Clínicas
* <Explicación de por qué se tomó una decisión técnica, librería elegida o criterio clínico adoptado>

#### Comandos para probar:
```bash
<comando de prueba>
```
```

---

## 2. Plantilla para Actualización de Hitos en `docs/FASES_PROYECTO.md`

```markdown
- [x] <Hito completado> (completado el AAAA-MM-DD)
- [>] <Nuevo hito activo>
- [ ] <Hito pendiente>
```

---

## 3. Plantilla para Nuevas Variables de Entorno en `docs/GUIA_COMPANERO.md`

```markdown
### Variables de Entorno Requeridas (.env)
* `EXPO_PUBLIC_SUPABASE_URL`: URL del proyecto en Supabase.
* `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima pública de Supabase.
* `API_PORT`: Puerto de ejecución del backend (por defecto 3000).
```

