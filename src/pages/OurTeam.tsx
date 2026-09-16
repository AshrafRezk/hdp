import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { alpha } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getAboutPageContent } from '../lib/api-client'
import { ABOUT_PAGE_FALLBACKS, type AboutBoardMember } from '../lib/about-page-content'

type DisplayMember = {
  name: string
  title: string
  description: string
  image: string
}

function localizeMember(member: AboutBoardMember, isEnglish: boolean): DisplayMember {
  return {
    name: isEnglish ? member.name.en : member.name.ar,
    title: isEnglish ? member.title.en : member.title.ar,
    description: isEnglish ? member.description.en : member.description.ar,
    image: member.imageUrl,
  }
}

function MemberCard({
  member,
  onClick,
}: {
  member: DisplayMember
  onClick?: () => void
}) {
  return (
    <Card
      onClick={onClick}
      sx={(theme) => ({
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: alpha(theme.palette.primary.main, 0.4),
        },
      })}
    >
      <Box
        sx={{
          aspectRatio: '3/4',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        {member.image ? (
          <Box
            component="img"
            src={member.image}
            alt={member.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          />
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">{member.name}</Typography>
          </Box>
        )}
      </Box>
      <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
          {member.name}
        </Typography>
        <Typography variant="body2" color="primary.main" fontWeight={600}>
          {member.title}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function OurTeam() {
  const { t, i18n } = useTranslation()
  const isEnglish = (i18n.resolvedLanguage || i18n.language).startsWith('en')
  const [members, setMembers] = useState<DisplayMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<DisplayMember | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const content = await getAboutPageContent()
        if (!active) return
        const list = content.boardMembers
          .filter((m) => m.active !== false)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((m) => localizeMember(m, isEnglish))
        setMembers(list)
      } catch {
        if (active) {
          setMembers(
            ABOUT_PAGE_FALLBACKS.boardMembers
              .filter((m) => m.active !== false)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((m) => localizeMember(m, isEnglish))
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [isEnglish])

  const subtitle = useMemo(
    () =>
      t(
        'ourTeam.subtitle',
        'Passionate about our work, we value innovative messaging and clever incentives.'
      ),
    [t]
  )

  return (
    <Box sx={{ minHeight: '60vh', pb: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: { xs: 5, md: 7 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {t('common.ourTeam', 'Our Team')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            {subtitle}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 5 }}>
        {loading ? (
          <Typography color="text.secondary" textAlign="center">
            {t('common.loading')}
          </Typography>
        ) : members.length === 0 ? (
          <Typography color="text.secondary" textAlign="center">
            {t('ourTeam.empty', 'Team profiles will appear here soon.')}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {members.map((member, index) => (
              <Grid key={member.name + index} size={{ xs: 12, sm: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  style={{ height: '100%' }}
                >
                  <MemberCard member={member} onClick={() => setSelected(member)} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <Box sx={{ position: 'relative', bgcolor: 'background.default' }}>
              <IconButton
                onClick={() => setSelected(null)}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'background.paper' }}
              >
                <CloseRoundedIcon />
              </IconButton>
              {selected.image && (
                <Box
                  component="img"
                  src={selected.image}
                  alt={selected.name}
                  sx={{ width: '100%', maxHeight: 360, objectFit: 'cover', objectPosition: 'top' }}
                />
              )}
            </Box>
            <DialogContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {selected.name}
              </Typography>
              <Typography variant="subtitle1" color="primary.main" fontWeight={600} sx={{ mb: 2 }}>
                {selected.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {selected.description}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}
