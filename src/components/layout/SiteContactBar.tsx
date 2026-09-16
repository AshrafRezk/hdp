import { Box, Container, IconButton, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Mail, MapPin, Instagram, Linkedin, Facebook, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  COMPANY_EMAIL,
  COMPANY_EMAIL_HREF,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
  COMPANY_SOCIALS,
  COMPANY_WHATSAPP_URL,
} from '../../lib/contact'

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.04 2C6.55 2 2.08 6.47 2.08 11.96c0 1.77.46 3.5 1.33 5.02L2 22l5.15-1.35a9.9 9.9 0 0 0 4.89 1.25h.01c5.49 0 9.96-4.47 9.96-9.96C22.01 6.47 17.54 2 12.04 2Zm0 17.99h-.01a8.3 8.3 0 0 1-4.22-1.16l-.3-.18-3.06.8.82-2.98-.2-.31a8.26 8.26 0 0 1-1.26-4.4c0-4.58 3.73-8.3 8.31-8.3 4.58 0 8.31 3.72 8.31 8.3 0 4.58-3.73 8.3-8.39 8.3Zm4.82-6.2c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.27-1.52-1.42-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.79-1.9-.21-.5-.43-.43-.58-.44h-.5c-.17 0-.45.06-.69.32-.24.26-.9.88-.9 2.15 0 1.27.92 2.5 1.05 2.68.13.17 1.81 2.76 4.38 3.87.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.53-.62 1.75-1.22.22-.6.22-1.12.15-1.22-.06-.1-.23-.16-.49-.29Z" />
  </svg>
)

const socialIconMap = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  whatsapp: WhatsAppIcon,
} as const

const socialColors: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0077B5',
  whatsapp: '#25D366',
}

export default function SiteContactBar() {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language.startsWith('ar')

  return (
    <Box
      component="aside"
      aria-label={t('siteContactBar.label')}
      sx={{
        py: 5,
        px: { xs: 2, md: 3 },
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
          <Box
            component="a"
            href={COMPANY_PHONE_TEL}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Phone size={20} />
            <Typography variant="body2" dir="ltr">
              {COMPANY_PHONE_DISPLAY}
            </Typography>
          </Box>
          <Box
            component="a"
            href={COMPANY_EMAIL_HREF}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Mail size={20} />
            <Typography variant="body2">{COMPANY_EMAIL}</Typography>
          </Box>
          <Box
            component={RouterLink}
            to="/contact#locations"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <MapPin size={20} />
            <Typography variant="body2">
              {isRtl ? 'مصر' : 'Egypt'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {COMPANY_SOCIALS.map((social) => {
              const Icon = socialIconMap[social.id as keyof typeof socialIconMap]
              if (!Icon) return null
              return (
                <IconButton
                  key={social.id}
                  component="a"
                  href={social.id === 'whatsapp' ? COMPANY_WHATSAPP_URL : social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: socialColors[social.id] || 'primary.main',
                      color: socialColors[social.id] || 'primary.main',
                    },
                  }}
                  aria-label={isRtl ? social.labelAr : social.labelEn}
                  title={isRtl ? social.labelAr : social.labelEn}
                >
                  <Icon size={20} />
                </IconButton>
              )
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
