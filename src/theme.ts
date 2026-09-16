import { createTheme, type Direction, type PaletteMode } from '@mui/material/styles'

const GOLD = {
  main: '#908146',
  light: '#9C9069',
  dark: '#7a6d3a',
} as const

const BEIGE = '#E0DFD1'

function paletteForMode(mode: PaletteMode) {
  const isDark = mode === 'dark'
  return {
    mode,
    primary: { ...GOLD },
    secondary: {
      main: isDark ? BEIGE : '#141718',
      light: isDark ? '#f0efe8' : '#353535',
      dark: isDark ? '#c8c7bb' : '#000000',
    },
    background: {
      default: isDark ? '#0c0c0c' : '#f5f4ef',
      paper: isDark ? '#161616' : '#ffffff',
    },
    text: {
      primary: isDark ? BEIGE : '#141718',
      secondary: isDark ? 'rgba(224, 223, 209, 0.72)' : '#353535',
    },
    divider: isDark ? 'rgba(224, 223, 209, 0.12)' : 'rgba(20, 23, 24, 0.12)',
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
  }
}

export function createAppTheme(direction: Direction, mode: PaletteMode = 'dark') {
  const isRtl = direction === 'rtl'
  const fontFamily = isRtl
    ? '"PP Neue Montreal Arabic", "PP Telegraf", system-ui, sans-serif'
    : '"PP Telegraf", "PP Neue Montreal Arabic", system-ui, sans-serif'

  return createTheme({
    palette: paletteForMode(mode),
    direction,
    typography: {
      fontFamily,
      h1: {
        fontFamily,
        fontWeight: isRtl ? 700 : 600,
        fontSize: '2rem',
      },
      h2: {
        fontFamily,
        fontWeight: isRtl ? 700 : 600,
        fontSize: '1.5rem',
      },
      h3: {
        fontFamily,
        fontWeight: isRtl ? 600 : 600,
        fontSize: '1.25rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
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
            backgroundImage: 'none',
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
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? '#0c0c0c' : '#f5f4ef',
            color: mode === 'dark' ? BEIGE : '#141718',
          },
        },
      },
    },
  })
}

/** Default theme for type inference / tests */
export const theme = createAppTheme('rtl', 'dark')
