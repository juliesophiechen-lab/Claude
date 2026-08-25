import { useMemo, useState } from 'react'
import './App.css'
import { NaverMap } from './components/NaverMap'
import { Sidebar } from './components/Sidebar'
import { useNaverMapsReady } from './hooks/useNaverMapsReady'
import { useGeocodedPlaces } from './hooks/useGeocodedPlaces'
import placesData from './data/places.json'
import type { Place } from './types'

const places = placesData as Place[]
const CATEGORIES = Array.from(new Set(places.map((p) => p.category))).sort()

function App() {
  const ready = useNaverMapsReady()
  const { geocoded, failed, progress, total } = useGeocodedPlaces(places, ready)
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set(CATEGORIES))
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const visiblePlaces = useMemo(
    () => geocoded.filter((p) => activeCategories.has(p.category)),
    [geocoded, activeCategories],
  )

  function toggleCategory(category: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  if (!ready) {
    return <div className="loading-screen">Loading Naver Maps…</div>
  }

  return (
    <div className="app">
      <Sidebar
        categories={CATEGORIES}
        activeCategories={activeCategories}
        onToggleCategory={toggleCategory}
        places={geocoded}
        failed={failed}
        selectedId={selectedId}
        onSelect={setSelectedId}
        progress={progress}
        total={total}
      />
      <div className="map-container">
        <NaverMap places={visiblePlaces} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  )
}

export default App
