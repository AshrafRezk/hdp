import { createTheme, type Direction } from '@mui/material/styles'

const sharedThemeOptions = {
  palette: {
    primary: {
      main: '#908146',
      light: '#9C9069',
      dark: '#7a6d3a',
    },
    secondary: {
      main: '#141718',
      light: '#353535',
      dark: '#000000',
    },
    background: {
      default: '#eceae0',
      paper: '#ffffff',
    },
    text: {
      primary: '#141718',
      secondary: '#353535',
    },
    success: {
      main: '#28a745',
      light: '#d4edda',
    },
    warning: {
      main: '#ffc107',
      light: '#fff3cd',
    },
    error: {
      main: '#dc3545',
      light: '#f8d7da',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
} as const

export function createAppTheme(direction: Direction) {
  const isRtl = direction === 'rtl'

  return createTheme({
    ...sharedThemeOptions,
    direction,
    typography: {
      fontFamily: isRtl
        ? '"BentonSans", system-ui, sans-serif'
        : '"BentonSans", system-ui, sans-serif',
      h1: {
        fontWeight: isRtl ? 700 : 600,
        fontSize: '2rem',
      },
      h2: {
        fontWeight: isRtl ? 700 : 600,
        fontSize: '1.5rem',
      },
      h3: {
        fontWeight: isRtl ? 600 : 600,
        fontSize: '1.25rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
  })
}

/** Default theme for type inference / tests */
export const theme = createAppTheme('rtl')
