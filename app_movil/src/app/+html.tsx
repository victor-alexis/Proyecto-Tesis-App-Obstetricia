import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Plantilla HTML raíz para exportación estática Web / PWA en Vercel.
 * Asegura viewport fijo, soporte iOS standalone, inyección obligatoria de
 * headNodes/bodyNodes (Expo Router SDK 55 / React 19) y supresión temprana de AutoFill Safari.
 */
export default function Root({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();

  return (
    <html lang="es" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ClinicalCase" />
        <meta name="theme-color" content="#EEF2F6" />

        <ScrollViewStyleReset />
        {headNodes}

        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                background-color: #EEF2F6;
                overscroll-behavior: none;
                -webkit-overscroll-behavior: none;
              }
              input, textarea, select {
                font-size: 16px !important;
                -webkit-appearance: none !important;
              }
              input::-webkit-contacts-auto-fill-button,
              input::-webkit-credentials-auto-fill-button {
                visibility: hidden !important;
                display: none !important;
                pointer-events: none !important;
                position: absolute !important;
                right: 0 !important;
                width: 0 !important;
                height: 0 !important;
              }
              input[data-secure="true"] {
                -webkit-text-security: disc;
              }
              input[data-secure="false"] {
                -webkit-text-security: none;
              }
            `,
          }}
        />
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
