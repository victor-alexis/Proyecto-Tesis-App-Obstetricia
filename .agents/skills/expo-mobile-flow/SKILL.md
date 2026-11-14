---
name: expo-mobile-flow
description: >-
  Estándares de desarrollo, patrones de diseño y navegación con Expo Router
  para la aplicación móvil obstétrica. Activar cuando se diseñen o modifiquen
  pantallas en app_movil/src/app, componentes UI perinatales o hooks de React Native.
---

# Skill: Flujo de Desarrollo Móvil Expo (`expo-mobile-flow`)

Esta skill asegura que la aplicación móvil mantenga compatibilidad estricta con el SDK de Expo, rendimiento nativo y consistencia visual.

## Referencias Técnicas
* Convenciones de navegación y buenas prácticas: [references/convenciones-expo.md](./references/convenciones-expo.md)

---

## Directivas Obligatorias
1. **Instalación de Dependencias:** Usar siempre `npx expo install <paquete>` en vez de `npm install`.
2. **Navegación:** Emplear únicamente `expo-router` con pantallas dentro de `src/app/`.
3. **Chequeo de Integridad:** Ejecutar `npx tsc --noEmit` y `npx expo-doctor` antes de declarar finalizada una pantalla o flujo.

