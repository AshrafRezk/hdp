import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, useAppStore } from './lib/store'
import { useFeatureSwitchStore } from './lib/store/feature-switch-store'
import { getCurrentUser } from './lib/api-client'
import { getFeatureSwitchesOnLoad } from './lib/featureSwitches'
import Layout from './components/layout/Layout'
import HdpBootSplash from './components/boot/HdpBootSplash'
import Home from './pages/Home'
const Search = lazy(() => import('./pages/Search'))
const UnitDetails = lazy(() => import('./pages/UnitDetails'))
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
const Login = lazy(() => import('./pages/Login'))
const Community = lazy(() => import('./pages/Community'))
const Contact = lazy(() => import('./pages/Contact'))
const CommercialRental = lazy(() => import('./pages/CommercialRental'))
const Offline = lazy(() => import('./pages/Offline'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const Achievements = lazy(() => import('./pages/Achievements'))
const LatestReleases = lazy(() => import('./pages/LatestReleases'))
const News = lazy(() => import('./pages/News'))
const NewsArticle = lazy(() => import('./pages/NewsArticle'))
const CollaborationComingSoon = lazy(() => import('./pages/CollaborationComingSoon'))
const Careers = lazy(() => import('./pages/Careers'))
const OurTeam = lazy(() => import('./pages/OurTeam'))
import Toast from './components/ui/Toast'
import { SiteContentProvider } from './contexts/SiteContentContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore()
  if (isLoading) return null
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  const { setAuth, setLoading } = useAuthStore()
  const { setFeatures, getFeature } = useFeatureSwitchStore()

  useEffect(() => {
    let mounted = true
    async function hydrate() {
      setLoading(true)

      try {
        const [authResult, featureResult] = await Promise.allSettled([
          getCurrentUser(),
          getFeatureSwitchesOnLoad(),
        ])

        if (!mounted) return

        if (authResult.status === 'fulfilled') {
          const res = authResult.value
          if (res.success && res.data) {
            setAuth(res.data, null)
          } else {
            console.log('[Auth] Keep using cached session from localStorage.')
          }
        } else {
          console.log('[Auth] Network error, maintaining cached session.')
        }

        if (featureResult.status === 'fulfilled') {
          const featureRes = featureResult.value
          if (featureRes?.payload?.data?.values) {
            setFeatures(featureRes.payload.data.values, featureRes.payload.data.fields || [])
          } else {
            setFeatures({}, [])
          }
        } else {
          console.error('[Feature Switches] Failed to load feature switches', featureResult.reason)
          setFeatures({}, [])
        }
      } catch (err) {
        console.error('[Hydration Error] Unexpected error during hydration', err)
        if (mounted) setFeatures({}, [])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    hydrate()
    return () => {
      mounted = false
    }
  }, [setAuth, setLoading, setFeatures])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      useAppStore.getState().setInstallPrompt(e as any)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  return (
    <>
      <HdpBootSplash />
      <Suspense fallback={null}>
      <SiteContentProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {getFeature('Show_Home_Page__c', true) && <Route index element={<Home />} />}
            <Route path="search" element={<Search />} />
            <Route path="project/:id" element={<ProjectDetails />} />
            <Route path="unit/:id" element={<UnitDetails />} />
            {getFeature('Show_Support_Page__c', true) && <Route path="contact" element={<Contact />} />}
            <Route path="commercial-rental" element={<CommercialRental />} />

            {/* Who Are We */}
            {getFeature('Show_About_Us_Page__c', true) && (
              <>
                <Route path="about" element={<AboutUs />} />
                <Route path="about-us" element={<Navigate to="/about" replace />} />
                <Route path="our-team" element={<OurTeam />} />
              </>
            )}

            {getFeature('Show_Our_Achievements_Page__c', true) && (
              <Route path="achievements" element={<Achievements />} />
            )}

            {/* Projects (was Latest Releases) */}
            {getFeature('Show_Latest_Releases_Page__c', true) && (
              <>
                <Route path="projects" element={<LatestReleases />} />
                <Route path="latest-releases" element={<Navigate to="/projects" replace />} />
              </>
            )}

            {/* Media Center (was News) */}
            {getFeature('Show_Our_News_Page__c', true) && (
              <>
                <Route path="media-center" element={<News />} />
                <Route path="media-center/:id" element={<NewsArticle />} />
                <Route path="news" element={<Navigate to="/media-center" replace />} />
                <Route path="news/:id" element={<NewsArticle />} />
                <Route path="our-news" element={<Navigate to="/media-center" replace />} />
              </>
            )}

            <Route path="careers" element={<Careers />} />
            <Route path="collaboration-coming-soon" element={<CollaborationComingSoon />} />

            {getFeature('Show_My_Community_Page__c', true) && (
              <Route
                path="community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
            )}
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </SiteContentProvider>
      </Suspense>
    </>
  )
}

export default App
