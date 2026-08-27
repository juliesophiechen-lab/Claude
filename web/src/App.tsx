import { Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { AppStateProvider } from './state/AppStateContext'
import { ToastProvider } from './state/ToastContext'
import { IdentityProvider, useIdentity } from './state/IdentityContext'
import { StartPage } from './pages/StartPage'
import { HomePage } from './pages/HomePage'
import { ItineraryPage } from './pages/ItineraryPage'
import { PlacesPage } from './pages/PlacesPage'
import { GalleryPage } from './pages/GalleryPage'
import { KoreanPage } from './pages/KoreanPage'

function Gate() {
  const { me } = useIdentity()
  if (!me) return <StartPage />

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
