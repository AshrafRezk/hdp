import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PaletteMode } from '@mui/material/styles'

const STORAGE_KEY = 'hdp-theme-mode'

type ThemeModeContextValue = {
  mode: PaletteMode
  toggleMode: () => void
  setMode: (mode: PaletteMode) => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

function readStoredMode(): PaletteMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore
  }
  return 'dark'
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PaletteMode>(() =>
    typeof window !== 'undefined' ? readStoredMode() : 'dark'
  )

  const setMode = useCallback((next: PaletteMode) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    document.documentElement.style.colorScheme = mode
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', mode === 'dark' ? '#0c0c0c' : '#f5f4ef')
    }
  }, [mode])

  const value = useMemo(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode, setMode]
  )

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }
  return ctx
}
