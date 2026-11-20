import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * +html.tsx
 * Plantilla HTML raíz para la versión Web de ClinicalCase.
 * Configuración estricta de viewport y estilos base:
 * 1. Deshabilita pinch-to-zoom (user-scalable=no, maximum-scale=1, minimum-scale=1).
 * 2. Previene zoom automático en navegadores móviles (iOS Safari / Chrome) al hacer focus en inputs.
 * 3. Anula sobre-desplazamiento elástico y barras de scroll parásitas (overscroll-behavior: none, overflow: hidden).
 * 4. Mantiene fondo médico #F3F7FC sin transiciones negras ni márgenes blancos de barra de estado.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* Reseteo nativo de estilos de scroll de Expo Router */}
        <ScrollViewStyleReset />

        {/* Estilos web globales de máxima estabilidad para ClinicalCase */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body {
  background-color: #F3F7FC;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  overscroll-behavior: none;
  -webkit-overscroll-behavior: none;
  touch-action: pan-x pan-y;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
#root {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
}
/* Previene el zoom automático de iOS Safari al hacer focus en inputs */
input, textarea, select {
  font-size: 16px !important;
  touch-action: manipulation;
}
`;
