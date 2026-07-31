/**
 * Design Tokens
 * 
 * Centralized design tokens for the Campus Market design system.
 * These tokens ensure consistency across components and make theming easier.
 */

// Color tokens (HSL values without hsl() wrapper for CSS custom properties)
export const colors = {
  // Surface colors
  background: '240 10% 3.9%',
  foreground: '0 0% 98%',
  card: '240 10% 4.9%',
  cardForeground: '0 0% 95%',
  popover: '240 5.9% 10%',
  popoverForeground: '0 0% 95%',

  // Interactive colors
  primary: '0 0% 98%',
  primaryForeground: '240 10% 3.9%',
  secondary: '240 3.7% 15.9%',
  secondaryForeground: '0 0% 98%',
  muted: '240 5.9% 10%',
  mutedForeground: '240 5% 64.9%',
  accent: '240 3.7% 15.9%',
  accentForeground: '0 0% 98%',

  // Status colors
  destructive: '0 84.2% 60.2%',
  destructiveForeground: '0 0% 98%',
  warning: '47.9 95.8% 53.1%',
  warningForeground: '26 83.3% 14.1%',
  success: '142.1 76.2% 36.3%',
  successForeground: '355.7 100% 97.3%',

  // Border and input
  border: '240 3.7% 15.9%',
  input: '240 3.7% 15.9%',
  ring: '240 10% 3.9%',

  // Gray scale
  gray: {
    50: '240 4.8% 95.9%',
    100: '240 4.8% 83.9%',
    200: '240 5.9% 64.9%',
    300: '240 5.2% 48%',
    400: '240 3.8% 46.1%',
    500: '240 3.7% 15.9%',
    600: '240 5.2% 33.9%',
    700: '240 5.3% 26.1%',
    800: '240 3.7% 15.9%',
    900: '240 5.9% 10%',
    950: '240 10% 3.9%',
  },

  // Brand colors
  brand: {
    50: '240 100% 99%',
    100: '240 100% 97%',
    200: '240 96% 89%',
    300: '240 86% 78%',
    400: '240 75% 65%',
    500: '240 68% 52%',
    600: '240 78% 41%',
    700: '240 82% 34%',
    800: '240 84% 29%',
    900: '240 88% 18%',
  },

  // Application-specific colors
  category: {
    books: '217.2 91.2% 59.8%',
    electronics: '271.5 81.3% 55.9%',
    furniture: '142.1 76.2% 36.3%',
    clothing: '346.8 77.2% 49.8%',
    other: '240 3.7% 15.9%',
  },

  condition: {
    new: '142.1 76.2% 36.3%',
    good: '217.2 91.2% 59.8%',
    fair: '47.9 95.8% 53.1%',
    used: '240 5% 64.9%',
  },
} as const;

// Typography tokens
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
  },
  fontSize: {
    '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.16' }],
    '6xl': ['3.75rem', { lineHeight: '1.1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Spacing tokens (based on 4px grid)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  18: '4.5rem',    // 72px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  88: '22rem',     // 352px
  96: '24rem',     // 384px
  112: '28rem',    // 448px
  128: '32rem',    // 512px
} as const;

// Border radius tokens
export const borderRadius = {
  none: '0',
  '2xs': '0.125rem',  // 2px
  xs: '0.25rem',      // 4px
  sm: '0.375rem',     // 6px
  default: '0.5rem',  // 8px
  md: '0.5rem',       // 8px
  lg: '0.75rem',      // 12px
  xl: '1rem',         // 16px
  '2xl': '1.5rem',    // 24px
  '3xl': '2rem',      // 32px
  full: '9999px',
} as const;

// Shadow tokens
export const boxShadow = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Custom shadows
  card: 'var(--shadow-card)',
  cardHover: 'var(--shadow-card-hover)',
  glow: 'var(--shadow-glow)',
  glowSm: 'var(--shadow-glow-sm)',
  glowMd: 'var(--shadow-glow-md)',
  glowLg: 'var(--shadow-glow-lg)',
  border: 'var(--shadow-border)',
} as const;

// Animation tokens
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounceGentle: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// Breakpoint tokens
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
} as const;

// Z-index tokens
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Component size tokens
export const size = {
  button: {
    sm: {
      height: '2.25rem', // 36px
      paddingX: '0.75rem', // 12px
      fontSize: '0.875rem', // 14px
    },
    default: {
      height: '2.5rem', // 40px
      paddingX: '1rem', // 16px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '2.75rem', // 44px
      paddingX: '2rem', // 32px
      fontSize: '1rem', // 16px
    },
    icon: {
      width: '2.5rem', // 40px
      height: '2.5rem', // 40px
    },
  },
  input: {
    sm: {
      height: '2rem', // 32px
      paddingX: '0.75rem', // 12px
      fontSize: '0.875rem', // 14px
    },
    default: {
      height: '2.5rem', // 40px
      paddingX: '0.75rem', // 12px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '3rem', // 48px
      paddingX: '1rem', // 16px
      fontSize: '1rem', // 16px
    },
  },
} as const;

// Export all tokens as a single object for easier imports
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  boxShadow,
  animation,
  breakpoints,
  zIndex,
  size,
} as const;

export default designTokens;