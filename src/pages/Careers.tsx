import { Box, Button, Container, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Briefcase } from 'lucide-react'
import { COMPANY_EMAIL_HREF } from '../lib/contact'

export default function Careers() {
  const { t } = useTranslation()

  return (
    <Box sx={{ minHeight: '60vh', pb: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Briefcase size={36} style={{ marginBottom: 16, opacity: 0.8 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom color="text.primary">
              {t('careers.title', 'Careers')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.7 }}>
              {t(
                'careers.subtitle',
                'Join a team of young visionaries shaping Egypt’s next generation of communities.'
              )}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ pt: 6, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
          {t(
            'careers.body',
            'We are always looking for passionate talent across development, sales, marketing, and operations. Send your CV and we will be in touch.'
          )}
        </Typography>
        <Button
          component="a"
          href={`${COMPANY_EMAIL_HREF}?subject=${encodeURIComponent('Career Application — HDP')}`}
          variant="contained"
          size="large"
          sx={{ fontWeight: 600, px: 4 }}
        >
          {t('careers.apply', 'Apply via email')}
        </Button>
      </Container>
    </Box>
  )
}
