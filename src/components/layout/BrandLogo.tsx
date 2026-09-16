import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useThemeMode } from '../../contexts/ThemeModeContext'

/** Public asset served from this site, not the old nginx host. */
export const BRAND_LOGO_SRC = '/hdp-logo.svg'

type BrandLogoVariant = 'header' | 'footer' | 'login'

type BrandLogoProps = { variant: BrandLogoVariant }

/** Renders the brand logo; cream SVG is inverted on light backgrounds. */
export default function BrandLogo({ variant }: BrandLogoProps) {
  const { t } = useTranslation()
  const { mode } = useThemeMode()

  const height =
    variant === 'header'
      ? { xs: 36, sm: 44 }
      : variant === 'footer'
        ? { xs: 36, sm: 42 }
        : { xs: 64, sm: 72 }

  const img = (
    <Box
      component="img"
      src={BRAND_LOGO_SRC}
      alt={t('home.title', 'HDP')}
      sx={{
        height,
        width: 'auto',
        display: 'block',
        mx: variant === 'login' ? 'auto' : undefined,
        // Logo paths are #E0DFD1 — invert on light so it stays visible
        filter: mode === 'light' ? 'brightness(0)' : 'none',
        transition: 'filter 200ms ease',
      }}
    />
  )

  if (variant === 'login') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {img}
      </Box>
    )
  }

  return img
}
