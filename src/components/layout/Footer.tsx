import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Link, Typography, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import BrandLogo from './BrandLogo'
import AppInstallButtons from './AppInstallButtons'
import { useSiteContent } from '../../contexts/SiteContentContext'
import {
  COMPANY_EMAIL,
  COMPANY_EMAIL_HREF,
  COMPANY_OFFICES,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from '../../lib/contact'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const { navLabel } = useSiteContent()
  const year = new Date().getFullYear()
  const isRtl = i18n.language.startsWith('ar')

  const links = [
    { path: '/', label: navLabel('home', t('common.home')) },
    { path: '/projects', label: navLabel('projects', t('common.projects', 'Projects')) },
    { path: '/media-center', label: navLabel('mediaCenter', t('common.mediaCenter', 'Media Center')) },
    { path: '/about', label: navLabel('aboutUs', t('common.aboutUs')) },
    { path: '/our-team', label: navLabel('ourTeam', t('common.ourTeam', 'Our Team')) },
    { path: '/careers', label: navLabel('careers', t('common.careers', 'Careers')) },
    { path: '/contact', label: navLabel('contact', t('common.contact')) },
  ]

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        py: { xs: 4, md: 5 },
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <RouterLink to="/" style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: 16 }}>
              <BrandLogo variant="footer" />
            </RouterLink>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} dir="ltr">
              <Link href={COMPANY_PHONE_TEL} color="inherit" underline="hover">
                {COMPANY_PHONE_DISPLAY}
              </Link>
              {' · '}
              <Link href={COMPANY_EMAIL_HREF} color="inherit" underline="hover">
                {COMPANY_EMAIL}
              </Link>
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              {t('footer.nav')}
            </Typography>
            <Box
              component="nav"
              aria-label={t('footer.nav')}
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}
            >
              {links.map((item) => (
                <Link
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  underline="hover"
                  color="text.secondary"
                  variant="body2"
                  sx={{ fontWeight: 500 }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              {t('footer.offices', 'Offices')}
            </Typography>
            {COMPANY_OFFICES.map((office) => (
              <Box key={office.id} sx={{ mb: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {isRtl ? office.nameAr : office.nameEn}
                </Typography>
                {(isRtl ? office.linesAr : office.linesEn).map((line) => (
                  <Typography key={line} variant="caption" color="text.secondary" display="block">
                    {line}
                  </Typography>
                ))}
              </Box>
            ))}
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              {t('installBanner.downloadApp', 'Download Our App')}
            </Typography>
            <AppInstallButtons />
          </Box>

          <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
            <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 0.5 }}>
              {t('footer.copyright', { year })}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              sx={{ fontSize: '0.7rem', opacity: 0.8, mb: 0 }}
            >
              {t('footer.developedBy', 'Developed with love by')}{' '}
              <Link
                href="https://cloudastick.com"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="inherit"
              >
                Cloudastick
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
