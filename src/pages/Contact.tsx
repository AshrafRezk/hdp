import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, Instagram, Linkedin, Facebook } from 'lucide-react'
import { getOfficeMapUrl, getOfficeLocations } from '../lib/api-client'
import LeadInterestForm from '../components/home/LeadInterestForm'
import { useSiteContent } from '../contexts/SiteContentContext'

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

interface OfficeLocation {
  project: string
  projectEn: string
  url: string
  coords?: string
  dirUrl: string
  isHq?: boolean
}

// Headquarters is hard-coded: it is not a Project__c record. Every other office
// is loaded from Salesforce (Project__c.Office_Location__c) at runtime.
const hqOffice: OfficeLocation = {
  project: 'مكتب الشيخ زايد',
  projectEn: 'Sheikh Zayed Office',
  url: 'https://www.google.com/maps/search/?api=1&query=Majarrah+Sheikh+Zayed+Giza+Egypt',
  coords: '30.026,30.974',
  dirUrl: 'https://www.google.com/maps/dir/?api=1&destination=Majarrah+Sheikh+Zayed+Giza+Egypt',
  isHq: true,
}

export default function Contact() {
  const { t, i18n } = useTranslation()
  const { pageCopy } = useSiteContent()
  const contactHero = pageCopy('contact')
  const isRtl = i18n.language.startsWith('ar')
  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [mapMetaKeywords, setMapMetaKeywords] = useState<string | undefined>(undefined)
  const [isLoadingMap, setIsLoadingMap] = useState(true)
  const [offices, setOffices] = useState<OfficeLocation[]>([hqOffice])
  const [activeLocation, setActiveLocation] = useState<OfficeLocation>(hqOffice)

  const getEmbedUrl = () => {
    if (!activeLocation) return ''
    // A maps.app.goo.gl / place link can't be framed directly (Google blocks it),
    // so pick the best embeddable source for the selected office:
    // 1) an actual Google "embed" URL if the admin pasted one,
    // 2) the project's map centroid coordinates (exact pin),
    // 3) a search by project name as a last resort so the map still shows something.
    const url = activeLocation.url || ''
    if (/google\.[^/]+\/maps\/embed/i.test(url) || /[?&]output=embed/i.test(url)) {
      return url
    }
    if (activeLocation.coords) {
      return `https://maps.google.com/maps?q=${activeLocation.coords}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(activeLocation.project)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
  }

  useEffect(() => {
    const fetchMapUrl = async () => {
      setIsLoadingMap(true)
      try {
        const result = await getOfficeMapUrl()
        setMapUrl(result.mapUrl)
        setMapMetaKeywords(result.metaKeywords)
      } catch (error) {
        console.error('Failed to fetch office map URL:', error)
      } finally {
        setIsLoadingMap(false)
      }
    }
    fetchMapUrl()
  }, [])

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const records = await getOfficeLocations()
        const sfOffices: OfficeLocation[] = records.map((r) => ({
          project: r.name,
          projectEn: r.name,
          url: r.url,
          coords: r.coords,
          dirUrl: r.dirUrl,
        }))
        setOffices([hqOffice, ...sfOffices])
      } catch (error) {
        console.error('Failed to fetch office locations:', error)
      }
    }
    fetchOffices()
  }, [])

  useEffect(() => {
    const handleHashScroll = () => {
      if (window.location.hash === '#locations') {
        setTimeout(() => {
          const element = document.getElementById('locations')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 300)
      }
    }
    handleHashScroll()
    window.addEventListener('hashchange', handleHashScroll)
    return () => window.removeEventListener('hashchange', handleHashScroll)
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent' }}>
      {/* Header */}
      <Box sx={(theme) => ({ bgcolor: alpha(theme.palette.primary.main, 0.8), color: 'white', px: { xs: 2, md: 3 }, py: 6, textAlign: 'center' })}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {contactHero.title}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: '42rem', mx: 'auto' }}>
              {contactHero.subtitle}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Message form */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                sx={(theme) => ({
                  backgroundColor: theme.palette.background.paper,
                 
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                })}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    {t('contact.formTitle')}
                  </Typography>
                  <LeadInterestForm mode="inline" active />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                  {t('contact.contactInfo')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    {
                      icon: Phone,
                      label: t('contact.phoneLabel'),
                      value: '19845',
                      href: 'tel:19845',
                    },
                    {
                      icon: Mail,
                      label: t('contact.emailLabel'),
                      value: 'info@hdp.com.eg',
                      href: 'mailto:info@hdp.com.eg',
                    },
                    {
                      icon: MapPin,
                      label: t('contact.addressLabel'),
                      value: t('contact.address'),
                    },
                    {
                      icon: Clock,
                      label: t('contact.workingHours'),
                      value: t('contact.workingHoursValue'),
                    },
                  ].map((item) => {
                    const Icon = item.icon
                    const content = (
                      <Card
                        sx={(theme) => ({
                          bgcolor: 'background.paper',
                          backgroundImage: 'none',
                          border: `1px solid ${theme.palette.divider}`,
                        })}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <Icon size={20} color="white" />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {item.label}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {item.value}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    )

                    return item.href ? (
                      <Box
                        key={item.label}
                        component="a"
                        href={item.href}
                        sx={{ textDecoration: 'none', '&:hover': { opacity: 0.8 } }}
                      >
                        {content}
                      </Box>
                    ) : (
                      <Box key={item.label}>{content}</Box>
                    )
                  })}
                </Box>
              </Box>

              {/* Social Links */}
              <Box>
                <Typography variant="h6" fontWeight="semibold" gutterBottom>
                  {t('contact.followUs')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {[
                    {
                      icon: Instagram,
                      href: 'https://www.instagram.com/hdp_egypt/',
                      label: t('share.instagram'),
                      color: '#E4405F'
                    },
                    {
                      icon: Facebook,
                      href: 'https://www.facebook.com/hdpeg',
                      label: t('share.facebook'),
                      color: '#1877F2'
                    },
                    {
                      icon: Linkedin,
                      href: 'https://www.linkedin.com/company/hdp-egypt',
                      label: t('share.linkedin'),
                      color: '#0077B5'
                    },
                    {
                      icon: WhatsAppIcon,
                      href: 'https://wa.me/201070002592',
                      label: t('share.whatsapp'),
                      color: '#25D366'
                    },
                  ].map((social) => {
                    const Icon = social.icon
                    return (
                      <IconButton
                        key={social.label}
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            borderColor: social.color || 'primary.main',
                            '& svg': {
                              color: social.color || 'primary.main',
                            }
                          },
                        }}
                        aria-label={social.label}
                        title={social.label}
                      >
                        <Icon size={20} />
                      </IconButton>
                    )
                  })}
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* HQ Map & Sales Offices Locations Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Box id="locations" sx={{ mt: 6 }}>
            <Grid container spacing={4}>
              {/* HQ Map Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={(theme) => ({
                    backgroundColor: theme.palette.background.paper,
                   
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                  })}
                >
                  <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        {isRtl ? activeLocation.project : activeLocation.projectEn}
                      </Typography>
                      {activeLocation.isHq && (
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mt: 0.5 }}>
                          {isRtl ? 'الإدارة العامة' : 'General Administration'}
                        </Typography>
                      )}
                    </Box>
                    <MapPin size={20} color="#1a365d" />
                  </Box>
                  <Box sx={{ flexGrow: 1, minHeight: 400, position: 'relative', bgcolor: 'grey.50' }}>
                    {(isLoadingMap && activeLocation.isHq) || !getEmbedUrl() ? (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <MapPin size={32} color="#718096" style={{ margin: '0 auto 8px', display: 'block' }} />
                          <Typography variant="caption" color="text.secondary">
                            {isRtl ? 'جاري التحميل...' : 'Loading...'}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <iframe
                        src={getEmbedUrl()}
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: 'block', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={mapMetaKeywords || t('contact.mapTitle')}
                      />
                    )}
                  </Box>
                  <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <Box
                      component="a"
                      href={activeLocation?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        '&:hover': {
                          textDecoration: 'underline',
                          opacity: 0.8
                        }
                      }}
                    >
                      <MapPin size={16} />
                      <span>{isRtl ? 'فتح في خرائط جوجل للحصول على الاتجاهات ←' : 'Open in Google Maps for directions ←'}</span>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Sales Offices Location Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={(theme) => ({
                    backgroundColor: theme.palette.background.paper,
                   
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                    height: '100%',
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  })}
                >
                  <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {isRtl ? 'مواقع فروع ومكاتب المبيعات' : 'Office & Sales Branch Locations'}
                    </Typography>
                    <MapPin size={20} color="#1a365d" />
                  </Box>
                  <Box sx={{ flexGrow: 1, maxHeight: 440, overflowY: 'auto' }}>
                    {offices.map((office, idx) => {
                      const isActive = activeLocation?.url === office.url
                      return (
                        <Box
                          key={idx}
                          onClick={() => {
                            setActiveLocation(office)
                          }}
                          sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 3,
                            py: 2.2,
                            borderBottom: idx === offices.length - 1 ? 0 : 1,
                            borderColor: 'divider',
                            cursor: 'pointer',
                            color: 'text.primary',
                            borderRight: isRtl && isActive ? '4px solid' : 'none',
                            borderLeft: !isRtl && isActive ? '4px solid' : 'none',
                            borderRightColor: 'primary.main',
                            borderLeftColor: 'primary.main',
                            bgcolor: isActive
                              ? alpha(theme.palette.primary.main, 0.08)
                              : idx % 2 === 0
                              ? 'transparent'
                              : 'rgba(0,0,0,0.01)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: isActive
                                ? alpha(theme.palette.primary.main, 0.12)
                                : alpha(theme.palette.primary.main, 0.06),
                              '& .project-name': {
                                color: 'primary.main',
                                transform: isRtl ? 'translateX(-4px)' : 'translateX(4px)',
                              },
                            },
                          })}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography
                              className="project-name"
                              fontWeight={isActive ? 700 : 600}
                              sx={{
                                fontSize: '0.95rem',
                                color: isActive ? 'primary.main' : 'text.primary',
                                transition: 'all 0.2s ease-in-out',
                              }}
                            >
                              {isRtl ? office.project : office.projectEn}
                            </Typography>
                            {office.isHq && (
                              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {isRtl ? 'المقر الرئيسي للمجموعة' : 'Company Headquarters'}
                              </Typography>
                            )}
                          </Box>
                          <Box
                            component="a"
                            href={office.dirUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: isActive ? 'primary.main' : 'text.secondary',
                              fontWeight: 600,
                              fontSize: '0.82rem',
                              textDecoration: 'none',
                              border: '1px solid',
                              borderColor: isActive ? 'primary.main' : 'divider',
                              borderRadius: 1,
                              px: 1.5,
                              py: 0.6,
                              bgcolor: isActive ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderColor: 'primary.main',
                              },
                            }}
                          >
                            <span>
                              {isRtl ? 'الاتجاهات ←' : 'Directions ←'}
                            </span>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

