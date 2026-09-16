import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { Building2, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getProjects } from '../lib/api-client'
import type { Project } from '../lib/types'
import LazyImage from '../components/ui/LazyImage'
import { useSiteContent } from '../contexts/SiteContentContext'

type ProjectWithAvailability = Project & {
  hasAvailability?: boolean
  availablePhasesCount?: number
}

type RegionKey = 'east' | 'west' | 'coastal' | 'other'

function getAvailableCount(project: ProjectWithAvailability): number {
  const fromPhases = project.phases?.filter((p) => p.status === 'Available').length ?? 0
  if (fromPhases > 0) return fromPhases
  return project.availablePhasesCount ?? 0
}

function projectHasAvailability(project: ProjectWithAvailability): boolean {
  if (project.hasAvailability) return true
  return getAvailableCount(project) > 0
}

function regionForProject(project: Project): RegionKey {
  const haystack = [
    project.city,
    project.provinceRegion,
    project.location,
    project.locationAr,
    project.name,
    project.nameAr,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (
    /coast|ساحل|north coast|marina|island|الجزيرة/.test(haystack)
  ) {
    return 'coastal'
  }
  if (
    /new cairo|mostakbal|مستقبل|القاهرة الجديدة|suez|talda|sq1|square one|the gray|grand lane/.test(
      haystack
    )
  ) {
    return 'east'
  }
  if (
    /zayed|زايد|october|أكتوبر|october|westview|club hills|terrace|sheikh/.test(haystack)
  ) {
    return 'west'
  }
  return 'other'
}

function ProjectCard({ project, index }: { project: ProjectWithAvailability; index: number }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'
  const name = isRtl ? project.nameAr : project.name
  const location = isRtl ? project.locationAr : project.location
  const description = isRtl ? project.descriptionAr : project.description
  const available = getAvailableCount(project)
  const isActive = project.status === 'Active'

  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
        style={{ height: '100%' }}
      >
        <Card
          component={Link}
          to={`/project/${project.id}`}
          sx={(theme) => ({
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            border: `1px solid ${theme.palette.divider}`,
            transition: 'transform 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              borderColor: alpha(theme.palette.primary.main, 0.45),
            },
          })}
        >
          <Box sx={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', bgcolor: 'grey.900' }}>
            {project.coverImageUrl ? (
              <LazyImage
                src={project.coverImageUrl}
                alt={name}
                objectFit="cover"
                sx={{
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.35s ease',
                  '.MuiCard-root:hover &': { transform: 'scale(1.03)' },
                }}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body2">{t('latestReleasesPage.noImage')}</Typography>
              </Box>
            )}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                ...(isRtl ? { left: 12 } : { right: 12 }),
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Chip
                size="small"
                label={
                  isActive
                    ? t('latestReleasesPage.status.active')
                    : t('latestReleasesPage.status.completed')
                }
                sx={{ bgcolor: 'rgba(255,255,255,0.92)', fontWeight: 600, color: '#141718' }}
              />
              {available > 0 && (
                <Chip
                  size="small"
                  label={t('home.phasesAvailable', { count: available })}
                  sx={{ bgcolor: 'rgba(255,255,255,0.92)', fontWeight: 600, color: '#141718' }}
                />
              )}
            </Box>
          </Box>

          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
              {name}
            </Typography>
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                <MapPin size={15} />
                <Typography variant="body2">{location}</Typography>
              </Box>
            )}
            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  flexGrow: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            )}
            <Button variant="text" size="small" sx={{ alignSelf: 'flex-start', mt: 0.5, px: 0, fontWeight: 600 }}>
              {t('latestReleasesPage.viewProject')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  )
}

function ProjectCardSkeleton() {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', backgroundImage: 'none' }}>
        <Skeleton variant="rectangular" sx={{ aspectRatio: '16/10' }} />
        <CardContent>
          <Skeleton height={28} width="70%" sx={{ mb: 1 }} />
          <Skeleton height={20} width="45%" sx={{ mb: 1.5 }} />
          <Skeleton height={16} />
        </CardContent>
      </Card>
    </Grid>
  )
}

const REGION_ORDER: RegionKey[] = ['east', 'west', 'coastal', 'other']

export default function LatestReleases() {
  const { t } = useTranslation()
  const { pageCopy, navLabel } = useSiteContent()
  const projectsHero = pageCopy('latestReleases')
  const [projects, setProjects] = useState<ProjectWithAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadProjects() {
      try {
        const res = await getProjects()
        if (!cancelled && res.success && res.data) {
          setProjects(res.data)
        }
      } catch (err) {
        console.error('Failed to load projects', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void loadProjects()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredProjects = useMemo(() => projects.filter(projectHasAvailability), [projects])

  const grouped = useMemo(() => {
    const map: Record<RegionKey, ProjectWithAvailability[]> = {
      east: [],
      west: [],
      coastal: [],
      other: [],
    }
    for (const p of filteredProjects) {
      map[regionForProject(p)].push(p)
    }
    return map
  }, [filteredProjects])

  const regionLabels: Record<RegionKey, string> = {
    east: t('projectsPage.region.east', 'East'),
    west: t('projectsPage.region.west', 'West'),
    coastal: t('projectsPage.region.coastal', 'Coastal'),
    other: t('projectsPage.region.other', 'More projects'),
  }

  const countLabel = t('latestReleasesPage.count', { count: filteredProjects.length })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          color: 'text.primary',
          py: { xs: 5, md: 7 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'primary.main' }}>
              <Building2 size={22} />
              <Typography variant="overline" sx={{ letterSpacing: '0.2em', fontWeight: 600 }}>
                {navLabel('projects', t('common.projects', 'Projects'))}
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {projectsHero.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '40rem',
                mx: 'auto',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.6,
              }}
            >
              {projectsHero.subtitle}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 5 }, px: { xs: 2, md: 4 } }}>
        {!isLoading && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {countLabel}
          </Typography>
        )}

        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </Grid>
        ) : filteredProjects.length === 0 ? (
          <Box
            sx={(theme) => ({
              textAlign: 'center',
              py: 10,
              px: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: `1px dashed ${theme.palette.divider}`,
            })}
          >
            <Building2 size={48} style={{ opacity: 0.35, marginBottom: 16 }} />
            <Typography variant="h6" color="primary.main" gutterBottom>
              {t('latestReleasesPage.empty.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360, mx: 'auto' }}>
              {t('latestReleasesPage.empty.description')}
            </Typography>
          </Box>
        ) : (
          REGION_ORDER.map((region) => {
            const list = grouped[region]
            if (!list.length) return null
            return (
              <Box key={region} sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ mb: 2.5, color: 'text.primary', letterSpacing: '0.02em' }}
                >
                  {regionLabels[region]}
                </Typography>
                <Grid container spacing={3}>
                  {list.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </Grid>
              </Box>
            )
          })
        )}
      </Container>
    </Box>
  )
}
