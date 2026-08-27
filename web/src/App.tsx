import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { AppStateProvider } from './state/AppStateContext'
import { ToastProvider } from './state/ToastContext'
import { IdentityProvider, useIdentity } from './state/IdentityContext'
import { usePreferences } from './state/usePreferences'
import { SplashScreen } from './pages/SplashScreen'
import { StartPage } from './pages/StartPage'
import { InterestsPage } from './pages/InterestsPage'
import { HomePage } from './pages/HomePage'
import { ItineraryPage } from './pages/ItineraryPage'
import { PlacesPage } from './pages/PlacesPage'
import { GalleryPage } from './pages/GalleryPage'
import { KoreanPage } from './pages/KoreanPage'

function Gate() {
  const { me } = useIdentity()
  const { interests, saveInterests } = usePreferences()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) return <SplashScreen />
  if (!me) return <StartPage />
  if (interests === null) return <InterestsPage onSubmit={saveInterests} />

  return (
    <AppStateProvider>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="itinerary" element={<ItineraryPage />} />
            <Route path="places" element={<PlacesPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="korean" element={<KoreanPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AppStateProvider>
  )
}

function App() {
  return (
    <IdentityProvider>
      <Gate />
    </IdentityProvider>
  )
}

export default App
