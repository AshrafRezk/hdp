import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Box, IconButton, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Menu, MessageSquare, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../lib/store'
import { logout } from '../../lib/api-client'
import BrandLogo from './BrandLogo'
import NavOverlay from './NavOverlay'
import ContactUsFormModal from './ContactUsFormModal'
import { useSiteContent } from '../../contexts/SiteContentContext'
import {
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
  COMPANY_WHATSAPP_URL,
} from '../../lib/contact'

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.55 2 2.08 6.47 2.08 11.96c0 1.77.46 3.5 1.33 5.02L2 22l5.15-1.35a9.9 9.9 0 0 0 4.89 1.25h.01c5.49 0 9.96-4.47 9.96-9.96C22.01 6.47 17.54 2 12.04 2Zm0 17.99h-.01a8.3 8.3 0 0 1-4.22-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.26 8.26 0 0 1-1.26-4.4c0-4.58 3.73-8.3 8.31-8.3 4.58 0 8.31 3.72 8.31 8.3 0 4.58-3.73 8.3-8.39 8.3Zm4.82-6.2c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.27-1.52-1.42-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.79-1.9-.21-.5-.43-.43-.58-.44h-.5c-.17 0-.45.06-.69.32-.24.26-.9.88-.9 2.15 0 1.27.92 2.5 1.05 2.68.13.17 1.81 2.76 4.38 3.87.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.53-.62 1.75-1.22.22-.6.22-1.12.15-1.22-.06-.1-.23-.16-.49-.29Z" />
  </svg>
)

export default function Header() {
  const { user, clearAuth } = useAuthStore()
  const { t } = useTranslation()
  const { navLabel } = useSiteContent()
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [contactFormOpen, setContactFormOpen] = useState(false)

  return (
    <>
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          color: 'text.primary',
          boxShadow: 'none',
          pt: 1.5,
        }}
        className="safe-top"
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: '64px !important',
            px: { xs: 2, md: 4, lg: 6 },
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <BrandLogo variant="header" />
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              component="a"
              href={COMPANY_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('share.whatsapp', 'WhatsApp')}
              sx={{ color: '#25D366' }}
            >
              <WhatsAppIcon size={20} />
            </IconButton>

            <IconButton
              onClick={() => setContactFormOpen(true)}
              aria-label={navLabel('contact', t('common.contact'))}
              sx={{ color: 'text.primary' }}
            >
              <MessageSquare size={20} />
            </IconButton>

            <Box
              component="a"
              href={COMPANY_PHONE_TEL}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                alignItems: 'center',
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 1,
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Typography component="span" dir="ltr" sx={{ fontWeight: 600, fontSize: 'inherit' }}>
                {COMPANY_PHONE_DISPLAY}
              </Typography>
            </Box>

            {user && (
              <IconButton
                onClick={async () => {
                  try {
                    await logout()
                  } finally {
                    clearAuth()
                  }
                }}
                size="small"
                title={t('common.logout')}
                sx={{ color: 'text.primary' }}
              >
                <LogOut size={18} />
              </IconButton>
            )}

            <IconButton
              onClick={() => setOverlayOpen(true)}
              aria-label={t('nav.openMenu', 'Open menu')}
              sx={(theme) => ({
                color: 'text.primary',
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                borderRadius: 1.5,
                ml: 0.5,
              })}
            >
              <Menu size={22} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <NavOverlay open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      <ContactUsFormModal open={contactFormOpen} onClose={() => setContactFormOpen(false)} />
    </>
  )
}
