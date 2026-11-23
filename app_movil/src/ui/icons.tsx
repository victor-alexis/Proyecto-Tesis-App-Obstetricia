import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors } from './tokens';

type P = { size?: number; color?: string };
const base = (size: number, color: string, sw = 1.7) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
});

export const MailIcon = ({ size = 17, color = colors.muted }: P) => (
  <Svg {...base(size, color)}><Rect x="3" y="5" width="18" height="14" rx="3" /><Path d="m4 7 8 6 8-6" /></Svg>
);
export const LockIcon = ({ size = 17, color = colors.muted }: P) => (
  <Svg {...base(size, color)}><Rect x="4" y="10" width="16" height="11" rx="3" /><Path d="M8 10V7a4 4 0 0 1 8 0v3" /></Svg>
);
export const UserIcon = ({ size = 17, color = colors.muted }: P) => (
  <Svg {...base(size, color)}><Circle cx="12" cy="8" r="4" /><Path d="M4 20c1.2-3.6 4.2-5.5 8-5.5s6.8 1.9 8 5.5" /></Svg>
);
export const EyeIcon = ({ size = 19, color = colors.muted }: P) => (
  <Svg {...base(size, color)}><Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><Circle cx="12" cy="12" r="3" /></Svg>
);
export const EyeOffIcon = ({ size = 19, color = colors.muted }: P) => (
  <Svg {...base(size, color)}><Path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.3 6.4C3.7 8.1 2 12 2 12s3.6 7 10 7c1.5 0 2.8-.4 4-.9" /></Svg>
);
export const ArrowRightIcon = ({ size = 18, color = '#fff' }: P) => (
  <Svg {...base(size, color, 1.8)}><Path d="M5 12h14M13 6l6 6-6 6" /></Svg>
);
export const ArrowLeftIcon = ({ size = 19, color = colors.text }: P) => (
  <Svg {...base(size, color, 1.8)}><Path d="M19 12H5M11 6l-6 6 6 6" /></Svg>
);
export const KeyIcon = ({ size = 30, color = colors.text }: P) => (
  <Svg {...base(size, color, 1.6)}><Circle cx="8" cy="15" r="4" /><Path d="m11 12 9-9M16 7l3 3M14 9l2 2" /></Svg>
);
export const ShieldIcon = ({ size = 30, color = colors.text }: P) => (
  <Svg {...base(size, color, 1.6)}><Path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" /><Path d="m9 12 2.2 2.2L15.5 10" /></Svg>
);
export const GoogleIcon = ({ size = 21 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </Svg>
);

export const AlertIcon = ({ size = 18, color = colors.error }: P) => (
  <Svg {...base(size, color, 1.8)}><Path d="M12 3 2.5 20h19L12 3Z" /><Path d="M12 10v4.5M12 17.4v.1" /></Svg>
);
export const InfoIcon = ({ size = 14, color = colors.errorDark }: P) => (
  <Svg {...base(size, color, 2)}><Circle cx="12" cy="12" r="9" /><Path d="M12 8v5M12 16v.1" /></Svg>
);
export const CheckCircleIcon = ({ size = 30, color = colors.text }: P) => (
  <Svg {...base(size, color, 1.6)}><Circle cx="12" cy="12" r="9" /><Path d="m8 12.5 2.8 2.8L16 9.5" /></Svg>
);
export const DeviceIcon = ({ size = 18, color = colors.text }: P) => (
  <Svg {...base(size, color, 1.7)}><Rect x="6" y="2.5" width="12" height="19" rx="3" /><Path d="M11 18.5h2" /></Svg>
);
