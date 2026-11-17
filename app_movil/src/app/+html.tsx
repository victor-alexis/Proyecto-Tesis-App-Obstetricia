// +html.tsx - Configuración HTML para Expo Router Web
// Inyecta las fuentes oficiales (Playfair Display & Plus Jakarta Sans) y las animaciones de Stitch

import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=no" />
        <title>App Obstetricia - Inicio de Sesión</title>

        {/* Google Fonts: Playfair Display & Plus Jakarta Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700;1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <ScrollViewStyleReset />

        {/* Estilos y animaciones exactas de Stitch */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #root {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #F3F7FC;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          @keyframes gradient-wave-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .stitch-wave-text {
            background: linear-gradient(
              120deg,
              #00446e 0%,
              #2563eb 20%,
              #7c3aed 40%,
              #ec4899 60%,
              #0284c7 80%,
              #00446e 100%
            );
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient-wave-flow 5s ease-in-out infinite;
            font-family: 'Playfair Display', Georgia, serif !important;
          }

          .stitch-wave-text-dark {
            background: linear-gradient(
              120deg,
              #FDA4AF 0%,
              #FFFFFF 25%,
              #E879F9 50%,
              #FDE047 75%,
              #FDA4AF 100%
            );
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient-wave-flow 5s ease-in-out infinite;
            font-family: 'Playfair Display', Georgia, serif !important;
          }

          @keyframes shine-spin {
            0% { --shine-angle: 0deg; }
            100% { --shine-angle: 360deg; }
          }

          @property --shine-angle {
            syntax: '<angle>';
            inherits: false;
            initial-value: 0deg;
          }

          .stitch-shine-border {
            position: relative;
            border-radius: 24px;
            isolation: isolate;
          }

          .stitch-shine-border::before {
            content: "";
            position: absolute;
            inset: -1.5px;
            padding: 1.5px;
            border-radius: 25.5px;
            background: conic-gradient(
              from var(--shine-angle),
              transparent 0deg 30deg,
              #60a5fa 80deg,
              #93c5fd 130deg,
              transparent 170deg 210deg,
              #38bdf8 260deg,
              #60a5fa 310deg,
              transparent 350deg 360deg
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            animation: shine-spin 9s linear infinite;
            z-index: 1;
          }

          .stitch-shine-border-dark::before {
            content: "";
            position: absolute;
            inset: -1.5px;
            padding: 1.5px;
            border-radius: 25.5px;
            background: conic-gradient(
              from var(--shine-angle),
              transparent 0deg 30deg,
              #FB7185 80deg,
              #C084FC 130deg,
              transparent 170deg 210deg,
              #FDE047 260deg,
              #FB7185 310deg,
              transparent 350deg 360deg
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            animation: shine-spin 9s linear infinite;
            z-index: 1;
          }

          @keyframes sparkle-twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.15) rotate(180deg); }
          }

          .sparkle-icon {
            animation: sparkle-twinkle 3s ease-in-out infinite;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
