/**
 * Opalite — MUI v9 theme for the Book App.
 *
 * Usage (main.tsx):
 *   import { ThemeProvider } from '@mui/material/styles';
 *   import CssBaseline from '@mui/material/CssBaseline';
 *   import { opaliteTheme } from './theme/opalite';
 *
 *   <ThemeProvider theme={opaliteTheme}>
 *     <CssBaseline />
 *     <App />
 *   </ThemeProvider>
 */
import './augment';
import { createTheme, type Shadows } from '@mui/material/styles';
import { components } from './components';
import { elevation, fonts, motion, radius, roles, state } from './tokens';

type SchemeRoles = (typeof roles)['light'] | (typeof roles)['dark'];

/** #RRGGBB + opacity → rgba() */
const rgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const buildPalette = (r: SchemeRoles, background: { default: string; paper: string }) => ({
  primary: { ...r.primary },
  secondary: { ...r.secondary },
  tertiary: { ...r.tertiary },
  error: { ...r.error },
  background,
  text: {
    primary: r.surface.on,
    secondary: r.surface.onVariant,
    disabled: rgba(r.surface.on, state.disabledContent),
  },
  divider: r.surface.outlineVariant,
  action: {
    active: r.surface.onVariant,
    hover: rgba(r.surface.on, state.hover),
    hoverOpacity: state.hover,
    selected: rgba(r.primary.main, state.selected),
    selectedOpacity: state.selected,
    focus: rgba(r.surface.on, state.focus),
    focusOpacity: state.focus,
    activatedOpacity: state.pressed,
    disabled: rgba(r.surface.on, state.disabledContent),
    disabledBackground: rgba(r.surface.on, state.disabledContainer),
    disabledOpacity: state.disabledContent,
  },
  // Custom opalite tokens → also emitted as CSS variables (--mui-palette-streak-surface …)
  surface: { ...r.surface },
  streak: { ...r.streak },
  progress: { ...r.progress },
  day: { ...r.day },
  reader: { ...r.reader },
  covers: { ...r.covers },
});

// 25 MUI shadow slots → M3 levels 0–5 (anything above 5 reuses level 5)
const shadows = Array.from({ length: 25 }, (_, i) => elevation[Math.min(i, 5)]) as Shadows;

export const opaliteTheme = createTheme({
  // ------------------------------------------------------------- CSS variables
  cssVariables: {
    colorSchemeSelector: 'data', // toggle with useColorScheme(); add <InitColorSchemeScript attribute="data" /> for SSR
  },
  defaultColorScheme: 'light',

  // ------------------------------------------------------------- Color
  colorSchemes: {
    light: {
      palette: buildPalette(roles.light, {
        default: roles.light.surface.containerLow, // pearl page background
        paper: roles.light.surface.containerLowest, // white cards
      }),
    },
    dark: {
      palette: buildPalette(roles.dark, {
        default: roles.dark.surface.main,
        paper: roles.dark.surface.container,
      }),
    },
  },

  // ------------------------------------------------------------- Typography
  typography: {
    fontFamily: fonts.plain,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    // Serif headings (M3 headline / title-large)
    h1: { fontFamily: fonts.brand, fontWeight: 700, fontSize: '2rem', lineHeight: 1.25, letterSpacing: 0 },
    h2: { fontFamily: fonts.brand, fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2857, letterSpacing: 0 },
    h3: { fontFamily: fonts.brand, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3333, letterSpacing: 0 },
    h4: { fontFamily: fonts.brand, fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.2727, letterSpacing: 0 },
    h5: { fontFamily: fonts.brand, fontWeight: 700, fontSize: '1.1875rem', lineHeight: 1.4, letterSpacing: 0 },
    h6: { fontFamily: fonts.plain, fontWeight: 600, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.009375rem' },

    // Sans text (M3 title-medium/small, body, label)
    subtitle1: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.009375rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4286, letterSpacing: '0.00625rem' },
    body1: { fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.03125rem' },
    body2: { fontSize: '0.875rem', lineHeight: 1.4286, letterSpacing: '0.015625rem' },
    caption: { fontSize: '0.75rem', lineHeight: 1.3333, letterSpacing: '0.025rem' },
    overline: { fontWeight: 700, fontSize: '0.75rem', lineHeight: 1.3333, letterSpacing: '0.08em', textTransform: 'uppercase' },
    button: { fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4286, letterSpacing: '0.00625rem', textTransform: 'none' },

    // Extra variants (see augment.ts)
    displayLarge: { fontFamily: fonts.brand, fontWeight: 400, fontSize: '3.5625rem', lineHeight: 1.1228, letterSpacing: '-0.015625rem' },
    displayMedium: { fontFamily: fonts.brand, fontWeight: 400, fontSize: '2.8125rem', lineHeight: 1.1556 },
    displaySmall: { fontFamily: fonts.brand, fontWeight: 400, fontSize: '2.25rem', lineHeight: 1.2222 },
    stat: { fontFamily: fonts.brand, fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' },
    labelLarge: { fontFamily: fonts.plain, fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4286, letterSpacing: '0.00625rem' },
    labelMedium: { fontFamily: fonts.plain, fontWeight: 600, fontSize: '0.75rem', lineHeight: 1.3333, letterSpacing: '0.03125rem' },
    labelSmall: { fontFamily: fonts.plain, fontWeight: 600, fontSize: '0.6875rem', lineHeight: 1.4545, letterSpacing: '0.03125rem' },
  },

  // ------------------------------------------------------------- Shape & elevation
  shape: { borderRadius: radius.sm },
  radius: { ...radius }, // custom theme variable: theme.radius.md, theme.radius.xl …
  shadows,

  // ------------------------------------------------------------- Motion
  transitions: {
    easing: {
      easeInOut: motion.easing.standard,
      easeOut: motion.easing.emphasizedDecelerate,
      easeIn: motion.easing.emphasizedAccelerate,
      sharp: motion.easing.standardAccelerate,
    },
    duration: {
      shortest: motion.duration.short3,
      shorter: motion.duration.short4,
      short: motion.duration.medium1,
      standard: motion.duration.medium2,
      complex: motion.duration.medium4,
      enteringScreen: motion.duration.medium1,
      leavingScreen: motion.duration.short4,
    },
  },
  motion: { reducedMotion: 'system' }, // respect the OS "reduce motion" setting

  // ------------------------------------------------------------- Layout (MUI defaults, stated for clarity)
  spacing: 8,
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },

  // ------------------------------------------------------------- Components
  components,
});

export default opaliteTheme;
