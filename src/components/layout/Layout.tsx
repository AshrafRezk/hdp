import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './Header'
import SiteContactBar from './SiteContactBar'
import Footer from './Footer'
import InstallBanner from './InstallBanner'
import SaraBot from '../chatbot/SaraBot'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Header />
      <Box
        component="main"
        className="main-content"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          pt: isHome ? 0 : 10,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Outlet />
        </Box>
        <SiteContactBar />
        <Footer />
      </Box>
      <InstallBanner />
      <SaraBot />
    </div>
  )
}
