# Convenciones de Desarrollo en Expo y React Native

---

## 1. Expo Router (Estructura de Navegación)
* Toda ruta es una pantalla ubicada en `app_movil/src/app/`.
* Los archivos `_layout.tsx` definen navigators (Tabs, Stack).
* Nunca colocar lógica de negocio o componentes sueltos dentro de `src/app/`; usar `src/components/`, `src/hooks/` o `src/services/`.

---

## 2. Gestión de Formularios Clínicos
* Validar entradas numéricas (presión arterial, peso, altura uterina, edad).
* Para selección de fechas (FUM, fecha de ecografía), utilizar selectores nativos accesibles.
* Prevenir recargas innecesarias en listas de controles prenatales usando `FlatList`.

---

## 3. Protocolo de Verificación Antes de Commit
Ejecutar siempre en `app_movil/`:
```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

