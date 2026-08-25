import { Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { AppStateProvider } from './state/AppStateContext'
import { ToastProvider } from './state/ToastContext'
import { HomePage } from './pages/HomePage'
import { PeoplePage } from './pages/PeoplePage'
import { ItineraryPage } from './pages/ItineraryPage'
import { PlacesPage } from './pages/PlacesPage'
import { GalleryPage } from './pages/GalleryPage'
import { KoreanPage } from './pages/KoreanPage'

function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="people" element={<PeoplePage />} />
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

export default App
