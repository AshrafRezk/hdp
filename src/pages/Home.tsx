import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import HeroSection from '../components/home/HeroSection'
import InspiringSpacesSection from '../components/home/InspiringSpacesSection'
import StatsSection from '../components/home/StatsSection'
import OurFieldsSection from '../components/home/OurFieldsSection'
import AboutProjectsSection from '../components/home/AboutProjectsSection'
import RegisterInterestModal from '../components/home/RegisterInterestModal'
import { HomePageContentProvider, useHomePageContent } from '../contexts/HomePageContentContext'

function HomePageContent() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const { i18n } = useTranslation()
  const { content, text } = useHomePageContent()

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  return (
    <Box sx={{ position: 'relative', overflowX: 'hidden', bgcolor: 'background.default' }}>
      <HeroSection />
      <InspiringSpacesSection />
      <StatsSection />
      <OurFieldsSection />
      <AboutProjectsSection />

      {/* Housing & Development Bank affiliation */}
      <Box sx={{ py: 6, px: { xs: 2, md: 3 }, bgcolor: 'background.paper', textAlign: 'center' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Box
              component="img"
              src={content.cma.imageUrl}
              alt="Housing and Development Bank"
              sx={{
                display: 'block',
                maxWidth: 'min(100%, 280px)',
                height: 'auto',
                maxHeight: 120,
                objectFit: 'contain',
                mx: 'auto',
                mb: 3,
              }}
            />
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
              {text(content.cma.description)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, fontWeight: 500, mb: 2.5 }}>
              {text(content.cma.teaser)}
            </Typography>
            <Button
              component={Link}
              to={content.cma.ctaLink}
              variant="outlined"
              size="medium"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {text(content.cma.ctaLabel)}
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={(theme) => ({ py: 8, px: { xs: 2, md: 3 }, bgcolor: theme.palette.primary.main, color: 'white' })}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {text(content.cta.title)}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.85)', mb: 4, maxWidth: '42rem', mx: 'auto' }}>
              {text(content.cta.description)}
            </Typography>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setIsRegisterModalOpen(true)}
              sx={{
                px: { xs: 2.25, sm: 2.75 },
                py: { xs: 1, sm: 1.125 },
                gap: 0.5,
                borderRadius: 1.5,
                borderWidth: 1.5,
                fontWeight: 500,
                borderColor: 'rgba(255, 255, 255, 0.75)',
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                '&:hover': {
                  borderWidth: 1.5,
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                },
              }}
            >
              {text(content.cta.buttonLabel)}
            </Button>
          </motion.div>
        </Container>
      </Box>

      <RegisterInterestModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </Box>
  )
}

export default function Home() {
  return (
    <HomePageContentProvider>
      <HomePageContent />
    </HomePageContentProvider>
  )
}
