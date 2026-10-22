/**
 * TypeScript module augmentation for the opalite theme.
 * Adds the custom palette keys, theme variables, typography variants,
 * and component variants/colors so they are type-safe in your components.
 */
import type { CSSProperties } from 'react'
import type { PaletteColorOptions } from '@mui/material/styles'
import '@mui/material/Button'
import '@mui/material/Paper'
import '@mui/material/Chip'
import '@mui/material/IconButton'
import '@mui/material/LinearProgress'
import '@mui/material/Typography'
import type {
  CoverTokens,
  DayTokens,
  ProgressTokens,
  RadiusTokens,
  ReaderTokens,
  StreakTokens,
  SurfaceTokens,
} from './tokens'

declare module '@mui/material/styles' {
  // The theme uses `cssVariables`, so `theme.vars` is always defined
  interface CssThemeVariables {
    enabled: true
  }

  // M3 container roles on every palette color (optional: info/success/warning don't set them)
  interface PaletteColor {
    container?: string
    onContainer?: string
  }
  interface SimplePaletteColorOptions {
    container?: string
    onContainer?: string
  }

  interface Palette {
    tertiary: PaletteColor
    surface: SurfaceTokens
    streak: StreakTokens
    progress: ProgressTokens
    day: DayTokens
    reader: ReaderTokens
    covers: CoverTokens
  }
  interface PaletteOptions {
    tertiary?: PaletteColorOptions
    surface?: SurfaceTokens
    streak?: StreakTokens
    progress?: ProgressTokens
    day?: DayTokens
    reader?: ReaderTokens
    covers?: CoverTokens
  }

  // Custom theme variable: theme.radius.md, theme.radius.xl …
  interface Theme {
    radius: RadiusTokens
  }
  interface ThemeOptions {
    radius?: RadiusTokens
  }

  // M3 display + label styles as extra Typography variants
  interface TypographyVariants {
    displayLarge: CSSProperties
    displayMedium: CSSProperties
    displaySmall: CSSProperties
    stat: CSSProperties
    labelLarge: CSSProperties
    labelMedium: CSSProperties
    labelSmall: CSSProperties
  }
  interface TypographyVariantsOptions {
    displayLarge?: CSSProperties
    displayMedium?: CSSProperties
    displaySmall?: CSSProperties
    stat?: CSSProperties
    labelLarge?: CSSProperties
    labelMedium?: CSSProperties
    labelSmall?: CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    displayLarge: true
    displayMedium: true
    displaySmall: true
    stat: true
    labelLarge: true
    labelMedium: true
    labelSmall: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true // M3 "filled tonal" button
  }
  interface ButtonPropsColorOverrides {
    tertiary: true
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    streak: true // <Card variant="streak"> — the gamified streak card
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    tertiary: true
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    tertiary: true
  }
}

declare module '@mui/material/LinearProgress' {
  interface LinearProgressPropsColorOverrides {
    tertiary: true
  }
}

export {}
