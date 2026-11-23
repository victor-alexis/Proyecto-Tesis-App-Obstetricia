// Tokens del diseño ClinicalCase (neumorfismo · Bodoni Moda + DM Sans)
// ─────────────────────────────────────────────────────────────────
// TEMA: edita SOLO este bloque para cambiar los colores secundarios.
//   accent*  → decorativo (punto del logo, barra del título, aro del botón, subrayado de enlaces, foco)
//   error*   → estados de error (banners, campos inválidos, requisitos pendientes)
// Equivale a las variables --acc / --err de los .dc.html.
export const theme = {
  accent: '#B3202A',
  accentDark: '#8F1A22',
  accentRgb: '179, 32, 42',
  error: '#B3202A',
  errorDark: '#8F1A22',
  errorRgb: '179, 32, 42',
};
// Versión neutra: accent '#2B2D31', accentDark '#1F2328', accentRgb '43, 45, 49'.

export const colors = {
  bg: '#EEF2F6',
  ink: '#1F2328',
  inkStrong: '#111316',
  text: '#2B2D31',
  label: '#4A5362',
  muted: '#5F6670',
  accentGray: '#6B7380',
  wordmark: '#2A2C30',
  knobFrom: '#3A3F49',
  knobTo: '#1E2228',
  accent: theme.accent,
  accentDark: theme.accentDark,
  error: theme.error,
  errorDark: theme.errorDark,
};

const dark = 'rgba(163,177,198,';
const light = 'rgba(255,255,255,';
export const accentA = (a: number) => `rgba(${theme.accentRgb}, ${a})`;
export const errorA = (a: number) => `rgba(${theme.errorRgb}, ${a})`;

// Strings con sintaxis CSS: RN >= 0.76 (nueva arquitectura) las soporta, incluido `inset`.
const insetBase = `inset 5px 5px 10px ${dark}0.55), inset -5px -5px 10px ${light}0.95)`;
export const shadows = {
  card: `12px 12px 26px ${dark}0.58), -12px -12px 26px ${light}0.95)`,
  raised: `7px 7px 16px ${dark}0.62), -7px -7px 16px ${light}0.95)`,
  raisedSm: `6px 6px 14px ${dark}0.6), -6px -6px 14px ${light}0.95)`,
  raisedXs: `5px 5px 12px ${dark}0.6), -5px -5px 12px ${light}0.95)`,
  row: `4px 4px 10px ${dark}0.5), -4px -4px 10px ${light}0.9)`,
  plate: `8px 8px 18px ${dark}0.6), -8px -8px 18px ${light}0.95)`,
  pressed: insetBase,
  inset: insetBase,
  insetSm: `inset 3px 3px 6px ${dark}0.55), inset -3px -3px 6px ${light}0.95)`,
  focus: `${insetBase}, 0 0 0 2px ${accentA(0.5)}`,
  invalid: `${insetBase}, 0 0 0 1.5px ${errorA(0.75)}`,
  check: `inset 3px 3px 6px ${dark}0.6), inset -3px -3px 6px ${light}0.95)`,
  // perilla oscura con aro fino del color de acento
  knob: `inset 0 1px 0 ${light}0.16), 0 4px 9px rgba(30,34,40,0.35), 0 0 0 2px ${colors.bg}, 0 0 0 3.5px ${accentA(0.6)}`,
};

// Nombres tal como los exportan @expo-google-fonts/*
export const fonts = {
  display: 'BodoniModa_600SemiBold',
  displayItalic: 'BodoniModa_800ExtraBold_Italic',
  body: 'DMSans_500Medium',
  bodySemi: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
  bodyItalic: 'DMSans_500Medium_Italic',
};

export const radius = { pill: 999, card: 30, otp: 16, check: 8, row: 20 };
