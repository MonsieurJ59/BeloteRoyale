// Thème inspiré de Belote.com avec couleurs modernes et dynamiques
export const theme = {
  colors: {
    // Couleurs principales inspirées de Belote.com
    primary: {
      main: '#1a472a',      // Vert foncé principal (tapis de belote)
      light: '#2d7a3d',     // Vert moyen
      lighter: '#4caf50',   // Vert clair
      dark: '#0d2818',      // Vert très foncé
    },
    secondary: {
      main: '#d32f2f',      // Rouge des cartes
      light: '#f44336',     // Rouge clair
      lighter: '#ffcdd2',   // Rouge très clair
      dark: '#b71c1c',      // Rouge foncé
    },
    accent: {
      main: '#ff9800',      // Orange/doré (couleur des atouts)
      light: '#ffb74d',     // Orange clair
      lighter: '#ffe0b2',   // Orange très clair
      dark: '#f57c00',      // Orange foncé
    },
    neutral: {
      white: '#ffffff',
      gray50: '#fafafa',
      gray100: '#f5f5f5',
      gray200: '#eeeeee',
      gray300: '#e0e0e0',
      gray400: '#bdbdbd',
      gray500: '#9e9e9e',
      gray600: '#757575',
      gray700: '#616161',
      gray800: '#424242',
      gray900: '#212121',
      black: '#000000',
    },
    status: {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
    },
    background: {
      primary: '#fafafa',
      secondary: '#ffffff',
      dark: '#1a472a',
      card: '#ffffff',
      sidebar: '#0d2818',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
      light: '#ffffff',
      muted: '#9e9e9e',
    },
    border: {
      light: '#e0e0e0',
      medium: '#bdbdbd',
      dark: '#757575',
    }
  },
  
  // Espacements
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    xxl: '3rem',      // 48px
    xxxl: '4rem',     // 64px
  },
  
  // Rayons de bordure
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
  },
  
  // Ombres
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    xl: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  },
  
  // Typographie
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  
  // Points de rupture responsive
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
  
  // Dimensions de la sidebar
  sidebar: {
    width: '280px',
    collapsedWidth: '80px',
  }
};

export type Theme = typeof theme;
