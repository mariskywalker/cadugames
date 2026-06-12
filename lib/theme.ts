/**
 * Tokens visuais CADU Games — Etapa 1
 * Rosa, coral, pêssego, creme e candy colors (healthtech + lúdico).
 */
export const theme = {
  colors: {
    bg: '#FFF5F8',
    cream: '#FFF8F0',
    pink: '#FFD6E8',
    peach: '#FFCAB0',
    coral: '#FF8F73',
    mint: '#C9F0C2',
    sky: '#B8E8FF',
    lavender: '#E8D4FF',
    honey: '#FFD88A',
    ink: '#3D2C3A',
    muted: '#8B7386',
    white: '#FFFFFF',
  },
  radius: {
    sm: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '1.75rem',
    pill: '2rem',
    full: '9999px',
  },
  shadow: {
    soft: '0 8px 24px rgb(255 143 115 / 0.12)',
    lg: '0 16px 40px rgb(255 143 115 / 0.16)',
  },
  font: {
    sans: "ui-rounded, 'SF Pro Rounded', 'Segoe UI', system-ui, sans-serif",
  },
  spacing: {
    touchMin: '56px',
    navHeight: '72px',
  },
} as const

export type ThemeColor = keyof typeof theme.colors
