export const theme = {
  colors: {
    primary: '#3182f6',
    primaryHover: '#1b64da',
    success: '#20c997',
    warning: '#ff9500',
    danger: '#f04452',

    text: {
      primary: '#191f28',
      secondary: '#6b7684',
      tertiary: '#8b95a1',
      disabled: '#adb5bd',
    },

    background: {
      primary: '#ffffff',
      secondary: '#f2f4f8',
      tertiary: '#f9fafb',
    },

    border: {
      light: '#f2f4f6',
      default: '#e5e8eb',
    },
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 2px 8px rgba(0, 0, 0, 0.04)',
    lg: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
} as const;

export type Theme = typeof theme;
