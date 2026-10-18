/**
 * Opalite design tokens — single source of hex values for the MUI theme.
 * Same values as the SCSS tokens (styles/tokens/*): M3 tonal palettes
 * generated from the opalite key colors of the Book App prototype.
 */

export const palettes = {
  primary: {
    10: '#0E0F58', 20: '#25286D', 30: '#3C3F85', 35: '#484B91', 40: '#54579E',
    50: '#6D70B9', 60: '#878AD5', 70: '#A2A4F1', 80: '#C0C1FF', 90: '#E1E0FF',
    95: '#F1EFFF', 100: '#FFFFFF',
  },
  secondary: {
    10: '#281135', 20: '#3F274B', 30: '#563D63', 40: '#6F547C', 50: '#896D96',
    60: '#A486B1', 70: '#C0A0CD', 80: '#DCBBE9', 90: '#F5D9FF', 100: '#FFFFFF',
  },
  tertiary: {
    10: '#37072A', 20: '#501E40', 30: '#6A3458', 40: '#854B70', 50: '#A1638A',
    60: '#BE7CA4', 70: '#DB96BF', 80: '#F9B1DB', 90: '#FFD8EC', 100: '#FFFFFF',
  },
  neutral: {
    0: '#000000', 4: '#0D0E15', 6: '#12131A', 10: '#1B1B23', 12: '#1F1F27',
    17: '#292931', 20: '#303038', 22: '#34343C', 24: '#383841', 87: '#DBD9E4',
    90: '#E3E1EC', 92: '#E9E7F2', 94: '#EFECF8', 95: '#F2EFFA', 96: '#F5F2FD',
    98: '#FBF8FF', 100: '#FFFFFF',
  },
  neutralVariant: {
    30: '#434656', 50: '#747688', 60: '#8E8FA2', 80: '#C4C5D9', 90: '#E0E1F6',
  },
  error: {
    10: '#410001', 20: '#690003', 30: '#910809', 40: '#B4271F', 50: '#D74034',
    80: '#FFB4AA', 90: '#FFDAD5', 100: '#FFFFFF',
  },
} as const;

const p = palettes;

/** Fonts — load in index.html:
 * https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap
 */
export const fonts = {
  brand: "'Libre Baskerville', Georgia, 'Times New Roman', serif",
  plain: "'Source Sans 3', system-ui, -apple-system, 'Segoe UI', sans-serif",
} as const;

/** Corner radii (px) — softer than M3 baseline, matching the prototype. */
export const radius = {
  none: 0,
  xs: 4, // chips, tooltips
  sm: 6, // buttons, inputs, filter pills
  md: 10, // cards, book rows, upload area
  lg: 14, // sheets, menus
  xl: 16, // streak card, dialogs
  full: 9999, // pills, avatars, progress bars
} as const;

/** M3 state-layer opacities. */
export const state = {
  hover: 0.08,
  focus: 0.1,
  pressed: 0.1,
  dragged: 0.16,
  selected: 0.1,
  disabledContainer: 0.12,
  disabledContent: 0.38,
} as const;

/** M3 elevation levels 1–5 as shadows tinted with the ink neutral. */
export const elevation = [
  'none',
  '0 1px 2px rgba(35, 37, 58, 0.15), 0 1px 3px 1px rgba(35, 37, 58, 0.08)',
  '0 1px 2px rgba(35, 37, 58, 0.15), 0 2px 6px 2px rgba(35, 37, 58, 0.08)',
  '0 1px 3px rgba(35, 37, 58, 0.15), 0 4px 8px 3px rgba(35, 37, 58, 0.08)',
  '0 2px 3px rgba(35, 37, 58, 0.15), 0 6px 10px 4px rgba(35, 37, 58, 0.08)',
  '0 4px 4px rgba(35, 37, 58, 0.15), 0 8px 12px 6px rgba(35, 37, 58, 0.08)',
] as const;

/** M3 motion. */
export const motion = {
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  },
  duration: {
    short2: 100, short3: 150, short4: 200, medium1: 250, medium2: 300,
    medium4: 400, long2: 500,
  },
} as const;

/** Color roles per scheme (M3 tone mapping + app-only tokens). */
export const roles = {
  light: {
    primary: { main: p.primary[40], light: p.primary[50], dark: p.primary[30], contrastText: p.primary[100], container: p.primary[90], onContainer: p.primary[10] },
    secondary: { main: p.secondary[40], light: p.secondary[50], dark: p.secondary[30], contrastText: p.secondary[100], container: p.secondary[90], onContainer: p.secondary[10] },
    tertiary: { main: p.tertiary[40], light: p.tertiary[50], dark: p.tertiary[30], contrastText: p.tertiary[100], container: p.tertiary[90], onContainer: p.tertiary[10] },
    error: { main: p.error[40], light: p.error[50], dark: p.error[30], contrastText: p.error[100], container: p.error[90], onContainer: p.error[10] },
    surface: {
      main: p.neutral[98],
      on: p.neutral[10],
      variant: p.neutralVariant[90],
      onVariant: p.neutralVariant[30],
      dim: p.neutral[87],
      bright: p.neutral[98],
      containerLowest: p.neutral[100],
      containerLow: p.neutral[96],
      container: p.neutral[94],
      containerHigh: p.neutral[92],
      containerHighest: p.neutral[90],
      inverse: p.neutral[20],
      onInverse: p.neutral[95],
      inversePrimary: p.primary[80],
      outline: p.neutralVariant[50],
      outlineVariant: p.neutralVariant[80],
    },
    streak: {
      surface: '#5B60A0',
      onSurface: '#FFFFFF',
      onSurfaceMuted: '#E8E9F7',
      glintPink: '#F3D6E4',
      onGlintPink: '#5B60A0',
      glintBlue: '#DCEBF5',
      flame: '#4A4F8C',
      track: 'rgba(255, 255, 255, 0.16)',
      panel: 'rgba(255, 255, 255, 0.07)',
      badgeLocked: '#C6C8E6',
    },
    progress: { reading: p.primary[40], finished: '#C9A9D6', track: p.neutral[90] },
    day: { read: '#6366AE', onRead: '#FFFFFF', today: '#4A4F8C', onToday: '#FFFFFF', missedBorder: p.neutralVariant[80], future: p.neutralVariant[50] },
    reader: { canvas: '#EFEFF7', page: '#FFFFFF' },
    covers: { c1: '#6366AE', c2: '#4A4F8C', c3: '#8E7BB5', c4: '#6F8FA8', c5: '#5B60A0' },
  },
  dark: {
    primary: { main: p.primary[80], light: p.primary[90], dark: p.primary[70], contrastText: p.primary[20], container: p.primary[30], onContainer: p.primary[90] },
    secondary: { main: p.secondary[80], light: p.secondary[90], dark: p.secondary[70], contrastText: p.secondary[20], container: p.secondary[30], onContainer: p.secondary[90] },
    tertiary: { main: p.tertiary[80], light: p.tertiary[90], dark: p.tertiary[70], contrastText: p.tertiary[20], container: p.tertiary[30], onContainer: p.tertiary[90] },
    error: { main: p.error[80], light: p.error[90], dark: p.error[50], contrastText: p.error[20], container: p.error[30], onContainer: p.error[90] },
    surface: {
      main: p.neutral[6],
      on: p.neutral[90],
      variant: p.neutralVariant[30],
      onVariant: p.neutralVariant[80],
      dim: p.neutral[6],
      bright: p.neutral[24],
      containerLowest: p.neutral[4],
      containerLow: p.neutral[10],
      container: p.neutral[12],
      containerHigh: p.neutral[17],
      containerHighest: p.neutral[22],
      inverse: p.neutral[90],
      onInverse: p.neutral[20],
      inversePrimary: p.primary[40],
      outline: p.neutralVariant[60],
      outlineVariant: p.neutralVariant[30],
    },
    streak: {
      surface: '#2E3176',
      onSurface: '#FFFFFF',
      onSurfaceMuted: '#C4C5D9',
      glintPink: '#F9B1DB',
      onGlintPink: '#25286D',
      glintBlue: '#DCEBF5',
      flame: '#484B91',
      track: 'rgba(255, 255, 255, 0.16)',
      panel: 'rgba(255, 255, 255, 0.07)',
      badgeLocked: '#8E8FA2',
    },
    progress: { reading: p.primary[80], finished: '#DCBBE9', track: p.neutral[22] },
    day: { read: '#A2A4F1', onRead: '#0E0F58', today: '#F9B1DB', onToday: '#37072A', missedBorder: p.neutralVariant[30], future: p.neutralVariant[60] },
    reader: { canvas: '#12131A', page: '#1F1F27' },
    covers: { c1: '#54579E', c2: '#3C3F85', c3: '#6F547C', c4: '#4F6A80', c5: '#484B91' },
  },
} as const;

/** Turns literal `as const` types into plain string shapes. */
type Widen<T> = { -readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type SurfaceTokens = Widen<typeof roles.light.surface>;
export type StreakTokens = Widen<typeof roles.light.streak>;
export type ProgressTokens = Widen<typeof roles.light.progress>;
export type DayTokens = Widen<typeof roles.light.day>;
export type ReaderTokens = Widen<typeof roles.light.reader>;
export type CoverTokens = Widen<typeof roles.light.covers>;
export type RadiusTokens = { -readonly [K in keyof typeof radius]: number };
