import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getAboutPageContent } from '../lib/api-client'
import { ABOUT_PAGE_FALLBACKS } from '../lib/about-page-content'

export default function AboutUs() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage || i18n.language
  const isEnglish = language.startsWith('en')
  const [aboutContent, setAboutContent] = useState(ABOUT_PAGE_FALLBACKS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadContent = async () => {
      setLoading(true)
      try {
        const content = await getAboutPageContent()
        if (active) setAboutContent(content)
      } catch {
        if (active) setAboutContent(ABOUT_PAGE_FALLBACKS)
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadContent()
    return () => {
      active = false
    }
  }, [language])

  const finalVision = useMemo(
    () =>
      aboutContent.vision.paragraphs
        .map((paragraph) => (isEnglish ? paragraph.en : paragraph.ar))
        .filter(Boolean),
    [aboutContent.vision.paragraphs, isEnglish]
  )

  const finalMission = useMemo(
    () =>
      aboutContent.mission.items.map((item) => (isEnglish ? item.en : item.ar)).filter(Boolean),
    [aboutContent.mission.items, isEnglish]
  )

  const companyValues = useMemo(
    () =>
      (aboutContent.companyValues || [])
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((v) => ({
          name: isEnglish ? v.name.en : v.name.ar,
          description: isEnglish ? v.description.en : v.description.ar,
        })),
    [aboutContent.companyValues, isEnglish]
  )

  const visionTitle = isEnglish ? aboutContent.vision.title.en : aboutContent.vision.title.ar
  const missionTitle = isEnglish ? aboutContent.mission.title.en : aboutContent.mission.title.ar

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', letterSpacing: '0.2em', fontWeight: 600 }}
            >
              {t('about.whoAreWe', 'Who Are We')}
            </Typography>
            <Typography variant="h3" fontWeight={700} gutterBottom color="text.primary" sx={{ mt: 1 }}>
              {t('about.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.7 }}>
              {t('about.subtitle')}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Typography variant="h5" fontWeight={700} gutterBottom color="primary.main">
            {t('about.companyIntroTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '1.05rem', mb: 5 }}>
            {t('about.companyIntroBody')}
          </Typography>
        </motion.div>

        {loading && (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary', my: 2 }}>
            {t('common.loading')}
          </Typography>
        )}

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                  {visionTitle}
                </Typography>
                {finalVision.map((p, idx) => (
                  <Typography key={idx} variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, mb: 1.5 }}>
                    {p}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none' }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                  {missionTitle}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                  {finalMission.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <CheckCircleRoundedIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.3 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {companyValues.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom textAlign="center">
              {t('about.coreValues', 'Our Core Values')}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {companyValues.map((value) => (
                <Grid key={value.name} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {value.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('about.meetTeamTeaser', 'Meet the people shaping HDP’s vision.')}
          </Typography>
          <Button component={RouterLink} to="/our-team" variant="outlined" sx={{ fontWeight: 600 }}>
            {t('common.ourTeam', 'Our Team')}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
