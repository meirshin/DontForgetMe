import { createContext, useContext } from 'react';

/** Brand colors, shared with the logo (scripts/brand/geometry.mjs). */
export const brand = {
  night: '#0B0E3A',
  nightDeep: '#070921',
  indigo: '#2A31A6',
  periwinkle: '#7183FF',
  glow: '#9FB0FF',
  gold: '#FFB938',
  goldLight: '#FFE49A',
};

export type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

/** Font files live in android/app/src/main/assets/fonts. */
const family = (name: string): Record<Weight, string> => ({
  regular: `${name}-Regular`,
  medium: `${name}-Medium`,
  semibold: `${name}-SemiBold`,
  bold: `${name}-Bold`,
  extrabold: `${name}-ExtraBold`,
});

const numericWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

const rubik = family('Rubik');
const cairo = family('Cairo');
// No ExtraBold cut is bundled for these two; Bold is close enough.
const devanagari = {
  ...family('NotoSansDevanagari'),
  extrabold: 'NotoSansDevanagari-Bold',
};
const bengali = {
  ...family('NotoSansBengali'),
  extrabold: 'NotoSansBengali-Bold',
};

/**
 * Bundled fonts per language, with how much taller their lines need to be.
 * Hindi and Bengali are bundled too, so they look the same on every phone
 * (some manufacturers replace the system fonts for these scripts).
 */
const bundled: Record<
  string,
  { family: Record<Weight, string>; lineScale: number }
> = {
  ar: { family: cairo, lineScale: 1.2 },
  hi: { family: devanagari, lineScale: 1.35 },
  bn: { family: bengali, lineScale: 1.35 },
};

/** CJK and Vietnamese use the phone's own fonts (Noto), which are made for them. */
const SYSTEM_FONT_LANGUAGES = ['zh', 'ja', 'ko', 'vi'];

/** Font style for a weight in the given language, plus how much taller its lines need to be. */
export function fontFor(lang: string, weight: Weight) {
  const own = bundled[lang];
  if (own) {
    return {
      style: { fontFamily: own.family[weight] },
      lineScale: own.lineScale,
    };
  }
  if (SYSTEM_FONT_LANGUAGES.includes(lang)) {
    return { style: { fontWeight: numericWeight[weight] }, lineScale: 1.1 };
  }
  return { style: { fontFamily: rubik[weight] }, lineScale: 1 };
}

const light = {
  dark: false,
  bg: '#F3F4FB',
  aurora: [
    'radial-gradient(circle at 100% 0%, rgba(113, 131, 255, 0.34) 0%, rgba(113, 131, 255, 0) 60%)',
    'radial-gradient(circle at 0% 12%, rgba(168, 132, 255, 0.20) 0%, rgba(168, 132, 255, 0) 55%)',
    'radial-gradient(circle at 70% 38%, rgba(255, 196, 120, 0.16) 0%, rgba(255, 196, 120, 0) 45%)',
  ].join(', '),
  surface: '#FFFFFF',
  surfaceAlt: '#F1F2FA',
  border: 'rgba(21, 26, 92, 0.07)',
  text: '#0F1238',
  textMuted: '#5D6288',
  textFaint: '#8C91B3',
  primary: '#4651E6',
  primaryGradient: 'linear-gradient(135deg, #6474FF 0%, #3B40D4 100%)',
  primarySoft: 'rgba(70, 81, 230, 0.10)',
  onPrimary: '#FFFFFF',
  success: '#0E9F70',
  successSoft: 'rgba(14, 159, 112, 0.12)',
  warning: '#C77700',
  warningSoft: 'rgba(255, 185, 56, 0.20)',
  danger: '#E5484D',
  dangerSoft: 'rgba(229, 72, 77, 0.10)',
  gold: '#B87400',
  goldSoft: 'rgba(255, 185, 56, 0.18)',
  trackOff: '#D8DBEC',
  cardShadow: '0px 10px 30px rgba(23, 28, 90, 0.08)',
  floatShadow: '0px 14px 34px rgba(59, 64, 212, 0.35)',
  footerShadow: '0px -10px 30px rgba(23, 28, 90, 0.08)',
  scrim: 'rgba(8, 10, 40, 0.45)',
};

export type Theme = typeof light;

const dark: Theme = {
  dark: true,
  bg: brand.nightDeep,
  aurora: [
    'radial-gradient(circle at 100% 0%, rgba(96, 112, 255, 0.36) 0%, rgba(96, 112, 255, 0) 60%)',
    'radial-gradient(circle at 0% 15%, rgba(140, 92, 255, 0.22) 0%, rgba(140, 92, 255, 0) 55%)',
    'radial-gradient(circle at 70% 40%, rgba(255, 185, 56, 0.07) 0%, rgba(255, 185, 56, 0) 45%)',
  ].join(', '),
  surface: '#11153A',
  surfaceAlt: '#1A1F4C',
  border: 'rgba(255, 255, 255, 0.07)',
  text: '#EEF0FF',
  textMuted: '#A5AAD3',
  textFaint: '#6E7399',
  primary: '#8794FF',
  primaryGradient: 'linear-gradient(135deg, #7E8BFF 0%, #4E57EC 100%)',
  primarySoft: 'rgba(135, 148, 255, 0.14)',
  onPrimary: '#FFFFFF',
  success: '#3DD9A4',
  successSoft: 'rgba(61, 217, 164, 0.13)',
  warning: '#FFC35A',
  warningSoft: 'rgba(255, 185, 56, 0.16)',
  danger: '#FF6B70',
  dangerSoft: 'rgba(255, 107, 112, 0.14)',
  gold: '#FFC35A',
  goldSoft: 'rgba(255, 185, 56, 0.16)',
  trackOff: '#2A2F63',
  cardShadow: '0px 10px 30px rgba(0, 0, 0, 0.35)',
  floatShadow: '0px 14px 34px rgba(78, 87, 236, 0.45)',
  footerShadow: '0px -10px 30px rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

export const themes = { light, dark };

export const ThemeContext = createContext<Theme>(light);
export const useTheme = () => useContext(ThemeContext);

export const radius = { sm: 12, md: 18, lg: 26, xl: 32, pill: 999 };
export const space = { xs: 6, sm: 10, md: 16, lg: 20, xl: 28 };
