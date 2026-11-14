---
name: documentador-tesis
description: >-
  Gestiona y mantiene actualizada la bitácora de desarrollo, el avance de las
  fases de la tesis, y la guía de inducción para compañeros de equipo.
  Activar cuando se finalice una tarea o hito, se consulte el estado del proyecto,
  o cuando un desarrollador/compañero pregunte cómo retomar el trabajo o qué falta por hacer.
---

# Skill: Documentador y Rastreador de Tesis (`documentador-tesis`)

Esta skill estandariza el registro continuo del avance de la tesis y asegura un relevo fluido de tareas entre compañeros de equipo mediante el principio de revelación progresiva.

## Recursos Modulares y Referencias
* Plantillas de actualización: [resources/plantillas.md](./resources/plantillas.md)
* Guía y ejemplos de respuesta para compañeros: [examples/respuestas-onboarding.md](./examples/respuestas-onboarding.md)

---

## Archivos de Control Obligatorios
Toda la documentación vive dentro del directorio `./docs/` de esta skill:
1. **`./docs/FASES_PROYECTO.md`**: Roadmap oficial de la tesis, fases del software e hitos clínicos/técnicos.
2. **`./docs/BITACORA_DEV.md`**: Diario de desarrollo (DevLog cronológico) con qué se hizo, por qué y cómo probarlo.
3. **`./docs/GUIA_COMPANERO.md`**: Manual de inducción rápido (*Onboarding*) para levantar el proyecto en minutos.

---

## Procedimiento 1: Al completar o avanzar una funcionalidad

Cada vez que el usuario o el agente implementen una funcionalidad o corrijan un cambio relevante:

1. **Actualizar `./docs/BITACORA_DEV.md`**:
   * Insertar una nueva entrada al inicio usando el formato de [resources/plantillas.md](./resources/plantillas.md).
   * Detallar: Fecha, título, archivos tocados, decisiones clínicas/técnicas y comando de prueba.

2. **Actualizar `./docs/FASES_PROYECTO.md`**:
   * Actualizar el estado de los hitos (`[ ]` -> `[>]` -> `[x]`).
   * Actualizar el indicador de **Fase Actual**.

3. **Revisar `./docs/GUIA_COMPANERO.md`**:
   * Si se agregaron dependencias o variables de entorno (`.env`), incorporarlas de inmediato.

---

## Procedimiento 2: Cuando un compañero pregunte por el estado del proyecto

Si el usuario o su compañero pregunta *"¿En qué quedamos?"*, *"¿Qué falta por hacer?"* o *"¿Cómo empiezo hoy?"*:

1. Leer `./docs/FASES_PROYECTO.md` y la última entrada de `./docs/BITACORA_DEV.md`.
2. Formular un resumen ejecutivo de 3 puntos (Fase actual, Comandos de prueba, Tareas prioritarias a tomar), guiándose por los ejemplos en [examples/respuestas-onboarding.md](./examples/respuestas-onboarding.md).
