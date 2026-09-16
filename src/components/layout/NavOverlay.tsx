import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { X, Search as SearchIcon, Phone, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSiteContent } from '../../contexts/SiteContentContext'
import { useThemeMode } from '../../contexts/ThemeModeContext'
import {
  COMPANY_EMAIL,
  COMPANY_EMAIL_HREF,
  COMPANY_OFFICES,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from '../../lib/contact'
import BrandLogo from './BrandLogo'

type NavOverlayProps = {
  open: boolean
  onClose: () => void
}

const spring = { type: 'spring' as const, stiffness: 280, damping: 28, mass: 0.9 }

export default function NavOverlay({ open, onClose }: NavOverlayProps) {
  const { t, i18n } = useTranslation()
  const { navLabel } = useSiteContent()
  const { mode, toggleMode } = useThemeMode()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isRtl = i18n.language.startsWith('ar')
  const side = isRtl ? 'left' : 'right'

  const primaryItems = [
    { path: '/', label: navLabel('home', t('common.home')) },
    { path: '/projects', label: navLabel('projects', t('common.projects', 'Projects')) },
    { path: '/media-center', label: navLabel('mediaCenter', t('common.mediaCenter', 'Media Center')) },
    { path: '/careers', label: navLabel('careers', t('common.careers', 'Careers')) },
    { path: '/our-team', label: navLabel('ourTeam', t('common.ourTeam', 'Our Team')) },
    { path: '/about', label: navLabel('aboutUs', t('common.aboutUs')) },
    { path: '/contact', label: navLabel('contact', t('common.contact')) },
  ]

  const secondaryItems = [
    { path: '/search', label: navLabel('search', t('common.search')) },
    { path: '/community', label: navLabel('community', t('common.community')) },
    { path: '/commercial-rental', label: navLabel('commercial', t('common.commercial')) },
    { path: '/achievements', label: navLabel('achievements', t('common.achievements')) },
  ]

  useEffect(() => {
    if (open) {
      const tmr = window.setTimeout(() => inputRef.current?.focus(), 320)
      return () => window.clearTimeout(tmr)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    onClose()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    setQuery('')
  }

  const slideFrom = side === 'right' ? '110%' : '-110%'

  return (
    <AnimatePresence>
      {open && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: (theme) => theme.zIndex.modal,
            pointerEvents: 'auto',
          }}
        >
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8, 16, 28, 0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Morphic color layers — cascade in from the side */}
          {['#0a1628', '#102d4a', '#1a3d5c'].map((color, i) => (
            <motion.div
              key={`layer-${color}`}
              initial={{
                x: slideFrom,
                borderRadius: side === 'right' ? '48% 0 0 48%' : '0 48% 48% 0',
              }}
              animate={{
                x: 0,
                borderRadius: side === 'right' ? '28px 0 0 28px' : '0 28px 28px 0',
              }}
              exit={{
                x: slideFrom,
                borderRadius: side === 'right' ? '48% 0 0 48%' : '0 48% 48% 0',
              }}
              transition={{ ...spring, delay: i * 0.045 }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                [side]: 0,
                width: `min(${92 - i * 3}vw, ${440 + i * 18}px)`,
                background: color,
                opacity: 0.35 + i * 0.12,
                pointerEvents: 'none',
                zIndex: i,
              }}
            />
          ))}

          <motion.aside
            key="nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.openMenu', 'Menu')}
            initial={{
              x: slideFrom,
              borderRadius: side === 'right' ? '42% 0 0 42%' : '0 42% 42% 0',
              scaleX: 0.86,
            }}
            animate={{
              x: 0,
              borderRadius: side === 'right' ? '24px 0 0 24px' : '0 24px 24px 0',
              scaleX: 1,
            }}
            exit={{
              x: slideFrom,
              borderRadius: side === 'right' ? '42% 0 0 42%' : '0 42% 42% 0',
              scaleX: 0.9,
            }}
            transition={{ ...spring, delay: 0.08 }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              [side]: 0,
              width: 'min(92vw, 420px)',
              transformOrigin: side === 'right' ? '100% 50%' : '0% 50%',
              zIndex: 4,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow:
                side === 'right'
                  ? '-24px 0 64px rgba(0,0,0,0.35)'
                  : '24px 0 64px rgba(0,0,0,0.35)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'auto',
                width: '100%',
                bgcolor: 'background.default',
                color: 'text.primary',
              }}
              className="safe-top safe-bottom"
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2.5,
                  py: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Link to="/" onClick={onClose} style={{ display: 'inline-flex' }}>
                  <BrandLogo variant="header" />
                </Link>
                <IconButton onClick={onClose} aria-label={t('common.close')} sx={{ color: 'text.primary' }}>
                  <X size={22} />
                </IconButton>
              </Box>

              <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.35 }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: 'primary.main',
                      letterSpacing: '0.18em',
                      fontWeight: 600,
                      display: 'block',
                      mb: 2,
                    }}
                  >
                    {t('nav.exploreAbout', 'Explore about HDP')}
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={onSearch}
                    sx={(theme) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 1,
                      mb: 2.5,
                      borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: alpha(theme.palette.background.paper, 0.6),
                    })}
                  >
                    <SearchIcon size={18} opacity={0.6} />
                    <InputBase
                      inputRef={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('nav.searchPlaceholder', 'Search')}
                      sx={{ flex: 1, fontSize: '0.9rem', color: 'text.primary' }}
                      inputProps={{ 'aria-label': t('common.search') }}
                    />
                  </Box>
                </motion.div>

                <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {primaryItems.map((item, idx) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: side === 'right' ? 28 : -28 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.04, ...spring }}
                    >
                      <Box
                        component={Link}
                        to={item.path}
                        onClick={onClose}
                        sx={{
                          display: 'block',
                          py: 1.2,
                          px: 0.5,
                          color: 'text.primary',
                          textDecoration: 'none',
                          fontSize: { xs: '1.1rem', md: '1.2rem' },
                          fontWeight: 500,
                          borderBottom: 1,
                          borderColor: 'divider',
                          transition: 'color 150ms ease',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {item.label}
                      </Box>
                    </motion.div>
                  ))}
                </Box>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.35 }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 3,
                      mb: 1,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      fontWeight: 600,
                    }}
                  >
                    {t('nav.moreServices', 'More')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    {secondaryItems.map((item) => (
                      <Box
                        key={item.path}
                        component={Link}
                        to={item.path}
                        onClick={onClose}
                        sx={{
                          py: 1,
                          color: 'text.secondary',
                          textDecoration: 'none',
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {item.label}
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Box>

              <Box sx={{ mt: 'auto', px: 2.5, py: 2.5, borderTop: 1, borderColor: 'divider' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleMode}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {mode === 'dark'
                        ? t('nav.darkMode', 'Dark')
                        : t('nav.lightMode', 'Light')}
                    </Typography>
                  }
                  sx={{ mb: 2, ml: 0 }}
                />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  <Box
                    component="a"
                    href={COMPANY_PHONE_TEL}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <Phone size={16} />
                    <Box component="span" dir="ltr">
                      {COMPANY_PHONE_DISPLAY}
                    </Box>
                  </Box>
                  <Box
                    component="a"
                    href={COMPANY_EMAIL_HREF}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <Mail size={16} />
                    {COMPANY_EMAIL}
                  </Box>
                </Box>

                {COMPANY_OFFICES.map((office) => (
                  <Box key={office.id} sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {isRtl ? office.nameAr : office.nameEn}
                    </Typography>
                    {(isRtl ? office.linesAr : office.linesEn).map((line) => (
                      <Typography key={line} variant="caption" color="text.secondary" display="block">
                        {line}
                      </Typography>
                    ))}
                  </Box>
                ))}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mt: 2,
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => i18n.changeLanguage(isRtl ? 'en' : 'ar')}
                >
                  <Box component="span" sx={{ textDecoration: isRtl ? 'underline' : 'none' }}>
                    AR
                  </Box>
                  <span>/</span>
                  <Box component="span" sx={{ textDecoration: !isRtl ? 'underline' : 'none' }}>
                    EN
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.aside>
        </Box>
      )}
    </AnimatePresence>
  )
}
