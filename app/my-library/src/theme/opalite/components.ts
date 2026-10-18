/**
 * Component overrides for the opalite theme.
 *
 * Every color comes from `theme.vars` (CSS variables), so light/dark switch
 * automatically without re-rendering. State layers use CSS `color-mix()`,
 * the same way M3 lays a translucent "on" color over a container.
 */
import type { Components, Theme } from '@mui/material/styles';
import { elevation, state } from './tokens';

/** M3 state layer: `on` color at `opacity` laid over `base`. */
const layer = (base: string, on: string, opacity: number) =>
  `color-mix(in srgb, ${on} ${Math.round(opacity * 100)}%, ${base})`;

const toneColors = ['primary', 'secondary', 'tertiary', 'error'] as const;

export const components: Components<Omit<Theme, 'components'>> = {
  // ---------------------------------------------------------------- Global
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      body: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '::selection': {
        backgroundColor: theme.vars.palette.primary.container,
        color: theme.vars.palette.primary.onContainer,
      },
    }),
  },

  MuiTypography: {
    defaultProps: {
      variantMapping: {
        displayLarge: 'h1',
        displayMedium: 'h1',
        displaySmall: 'h1',
        stat: 'p',
        labelLarge: 'span',
        labelMedium: 'span',
        labelSmall: 'span',
      },
    },
  },

  // ---------------------------------------------------------------- Buttons
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: 'none',
        borderRadius: theme.radius.sm,
        minHeight: 44,
        paddingInline: 16,
        variants: [
          { props: { size: 'small' }, style: { minHeight: 36, paddingInline: 12 } },
          { props: { size: 'large' }, style: { minHeight: 52, paddingInline: 22, fontSize: '1rem' } },
          // M3 outlined buttons use the neutral outline, not a tinted border
          {
            props: { variant: 'outlined' },
            style: {
              borderColor: theme.vars.palette.surface.outline,
              '&.Mui-disabled': { borderColor: theme.vars.palette.action.disabledBackground },
            },
          },
          // M3 "filled tonal" button: <Button variant="tonal" color="secondary">
          ...toneColors.map((color) => ({
            props: { variant: 'tonal' as const, color },
            style: {
              backgroundColor: theme.vars.palette[color].container,
              color: theme.vars.palette[color].onContainer,
              '&:hover': {
                backgroundColor: layer(
                  theme.vars.palette[color].container ?? '',
                  theme.vars.palette[color].onContainer ?? '',
                  state.hover,
                ),
                boxShadow: elevation[1],
              },
              '&:active': {
                backgroundColor: layer(
                  theme.vars.palette[color].container ?? '',
                  theme.vars.palette[color].onContainer ?? '',
                  state.pressed,
                ),
              },
              '&.Mui-disabled': {
                backgroundColor: theme.vars.palette.action.disabledBackground,
                color: theme.vars.palette.action.disabled,
              },
            },
          })),
        ],
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        minWidth: 44,
        minHeight: 44,
      },
    },
  },

  MuiFab: {
    defaultProps: { color: 'primary' },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radius.lg,
        boxShadow: elevation[3],
        textTransform: 'none',
      }),
    },
  },

  // ---------------------------------------------------------------- Surfaces
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none', // no white overlay in dark mode
        variants: [
          { props: { variant: 'outlined' }, style: { borderColor: theme.vars.palette.surface.outlineVariant } },
        ],
      }),
      rounded: ({ theme }) => ({ borderRadius: theme.radius.md }),
    },
  },

  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radius.md,
        backgroundColor: theme.vars.palette.background.paper,
        variants: [
          // Gamified streak hero: <Card variant="streak">
          {
            props: { variant: 'streak' },
            style: {
              backgroundColor: theme.vars.palette.streak.surface,
              color: theme.vars.palette.streak.onSurface,
              borderRadius: theme.radius.xl,
              border: 'none',
            },
          },
        ],
      }),
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: { padding: 20, '&:last-child': { paddingBottom: 20 } },
    },
  },

  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'inherit' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.background.paper,
        color: theme.vars.palette.text.primary,
        borderBottom: `1px solid ${theme.vars.palette.surface.outlineVariant}`,
      }),
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.radius.xl,
        backgroundColor: theme.vars.palette.surface.containerHigh,
      }),
    },
  },

  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: theme.radius.sm,
        backgroundColor: theme.vars.palette.surface.container,
        boxShadow: elevation[2],
      }),
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({ borderColor: theme.vars.palette.surface.outlineVariant }),
    },
  },

  // ---------------------------------------------------------------- Inputs
  MuiTextField: {
    defaultProps: { variant: 'outlined' },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radius.sm,
        backgroundColor: theme.vars.palette.background.paper,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.vars.palette.surface.outline },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.vars.palette.text.primary },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.primary.main,
          borderWidth: 2,
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: theme.vars.palette.error.main },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.vars.palette.action.disabledBackground,
        },
      }),
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.vars.palette.text.secondary,
        '&.Mui-focused': { color: theme.vars.palette.primary.main },
        '&.Mui-error': { color: theme.vars.palette.error.main },
      }),
    },
  },

  // Filter pills: All / Reading / Finished
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        gap: 4,
        padding: 4,
        borderRadius: theme.radius.sm + 2,
        backgroundColor: theme.vars.palette.surface.containerHigh,
        '& .MuiToggleButtonGroup-grouped': {
          border: 0,
          margin: 0,
          borderRadius: theme.radius.sm,
        },
      }),
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        textTransform: 'none',
        fontWeight: 600,
        minHeight: 40,
        paddingInline: 14,
        color: theme.vars.palette.text.secondary,
        '&:hover': {
          backgroundColor: layer(
            theme.vars.palette.surface.containerHigh,
            theme.vars.palette.text.primary,
            state.hover,
          ),
        },
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.text.primary,
          boxShadow: elevation[1],
        },
      }),
    },
  },

  MuiSlider: {
    styleOverrides: {
      root: { height: 6 },
      rail: ({ theme }) => ({ backgroundColor: theme.vars.palette.progress.track, opacity: 1 }),
      thumb: ({ theme }) => ({
        width: 20,
        height: 20,
        boxShadow: 'none',
        '&:hover, &.Mui-focusVisible': {
          boxShadow: `0 0 0 8px ${layer('transparent', theme.vars.palette.primary.main, state.hover)}`,
        },
        '&.Mui-active': {
          boxShadow: `0 0 0 10px ${layer('transparent', theme.vars.palette.primary.main, state.pressed + 0.06)}`,
        },
      }),
    },
  },

  // ---------------------------------------------------------------- Feedback
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: theme.radius.full,
        backgroundColor: theme.vars.palette.progress.track,
      }),
      bar: ({ theme }) => ({ borderRadius: theme.radius.full }),
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.vars.palette.surface.inverse,
        color: theme.vars.palette.surface.onInverse,
        borderRadius: theme.radius.xs,
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '6px 10px',
      }),
      arrow: ({ theme }) => ({ color: theme.vars.palette.surface.inverse }),
    },
  },

  MuiSnackbarContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.vars.palette.surface.inverse,
        color: theme.vars.palette.surface.onInverse,
        borderRadius: theme.radius.xs,
      }),
    },
  },

  // ---------------------------------------------------------------- Data display
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radius.sm,
        fontWeight: 600,
        variants: [
          {
            props: { variant: 'filled', color: 'default' },
            style: {
              backgroundColor: theme.vars.palette.surface.containerHigh,
              color: theme.vars.palette.text.primary,
            },
          },
          // Colored filled chips use the soft M3 container look
          ...toneColors.map((color) => ({
            props: { variant: 'filled' as const, color },
            style: {
              backgroundColor: theme.vars.palette[color].container,
              color: theme.vars.palette[color].onContainer,
            },
          })),
          { props: { variant: 'outlined' }, style: { borderColor: theme.vars.palette.surface.outline } },
        ],
      }),
    },
  },

  MuiAvatar: {
    styleOverrides: {
      colorDefault: ({ theme }) => ({
        backgroundColor: theme.vars.palette.primary.container,
        color: theme.vars.palette.primary.onContainer,
        fontWeight: 700,
      }),
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: { fontWeight: 700 },
    },
  },

  // ---------------------------------------------------------------- Navigation
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.radius.sm,
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: theme.vars.palette.secondary.container,
          color: theme.vars.palette.secondary.onContainer,
        },
      }),
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: { height: 3, borderRadius: '3px 3px 0 0' },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 600, minHeight: 48 },
    },
  },

  MuiBottomNavigation: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 64,
        backgroundColor: theme.vars.palette.background.paper,
        borderTop: `1px solid ${theme.vars.palette.surface.outlineVariant}`,
      }),
    },
  },

  MuiBottomNavigationAction: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.vars.palette.text.secondary,
        '&.Mui-selected': { color: theme.vars.palette.primary.main },
      }),
      label: {
        fontSize: '0.75rem',
        fontWeight: 600,
        '&.Mui-selected': { fontSize: '0.75rem', fontWeight: 700 },
      },
    },
  },
};
