import { useEffect, useState } from 'react'
import { Snackbar, Alert, Button, Box, Avatar } from '@mui/material'
import { Download } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../lib/store'

export default function InstallBanner() {
  const { t } = useTranslation()
  const { installPromptEvent, setInstallPrompt } = useAppStore()
  const [isInstalled, setIsInstalled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches
  )
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isInstalled) return

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)
    return () => window.removeEventListener('appinstalled', handleAppInstalled)
  }, [isInstalled, setInstallPrompt])

  const handleInstall = async () => {
    if (!installPromptEvent) return
    await installPromptEvent.prompt()
    const { outcome } = await installPromptEvent.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  // Only show when the browser actually offers install — never as a permanent FBS ad
  if (isInstalled || dismissed || !installPromptEvent) return null

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: '20px', md: '20px' } }}
      onClose={() => setDismissed(true)}
    >
      <Alert
        severity="info"
        icon={false}
        onClose={() => setDismissed(true)}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleInstall}
            startIcon={<Download />}
            sx={{
              color: 'background.default',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '6px',
              px: 1.5,
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
            }}
          >
            {t('installBanner.install')}
          </Button>
        }
        sx={{
          bgcolor: 'secondary.main',
          color: 'background.default',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          minWidth: { xs: 'auto', sm: '400px' },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: '500px' },
          '& .MuiAlert-message': {
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
          },
          '& .MuiAlert-action .MuiIconButton-root': {
            color: 'background.default',
          },
        }}
      >
        <Avatar
          src="/appicon.png"
          alt="HDP"
          variant="square"
          sx={{
            width: 48,
            height: 48,
            borderRadius: '8px',
            flexShrink: 0,
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
            {t('installBanner.title')}
          </Box>
          <Box sx={{ fontSize: '0.875rem', opacity: 0.95, lineHeight: 1.5 }}>
            {t('installBanner.description')}
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  )
}
