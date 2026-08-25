import { useMemo, useState } from 'react'
import { useAppState } from '../state/AppStateContext'
import { MapView } from '../map/MapProvider'
import { categoryColor } from '../lib/categories'
import { SearchBar } from '../components/places/SearchBar'
import { CategoryChipsRow } from '../components/places/CategoryChipsRow'
import { FilterSheet, type StatusFilter } from '../components/places/FilterSheet'
import { PlaceResultsCarousel } from '../components/places/PlaceResultsCarousel'
import { PlaceDetailSheet } from '../components/places/PlaceDetailSheet'
import { CsvImportSheet } from '../components/places/CsvImportSheet'
import { LocateIcon } from '../layout/icons'
import { filterPlaces } from '../lib/places'

const SEOUL_BOUNDS = { minLat: 37.44, maxLat: 37.61, minLng: 126.88, maxLng: 127.15 }

export function PlacesPage() {
  const { places } = useAppState()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [neighborhoods, setNeighborhoods] = useState<Set<string>>(new Set())
  const [statuses, setStatuses] = useState<Set<StatusFilter>>(new Set())
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [recenterSignal, setRecenterSignal] = useState(0)

  const availableNeighborhoods = useMemo(
    () => Array.from(new Set(places.map((p) => p.neighborhood))).sort(),
    [places],
  )

  const filtered = useMemo(
    () => filterPlaces(places, { category, neighborhoods, statuses, search }),
    [places, category, neighborhoods, statuses, search],
  )

  const markers = filtered.map((p) => ({
    id: p.id,
    lat: p.latitude,
    lng: p.longitude,
    color: categoryColor(p.category),
    selected: p.id === selectedId,
  }))

  const detailPlace = places.find((p) => p.id === detailId) ?? null

  function toggleNeighborhood(n: string) {
    setNeighborhoods((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  function toggleStatus(s: StatusFilter) {
    setStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  const filterCount = neighborhoods.size + statuses.size

  return (
    <div className="relative h-full">
      <MapView
        markers={markers}
        bounds={SEOUL_BOUNDS}
        recenterSignal={recenterSignal}
        onSelectMarker={(id) => {
          setSelectedId(id)
          setDetailId(id)
        }}
      />

      <div className="absolute inset-x-0 top-0 z-[1050] space-y-2.5 pt-4">
        <div className="px-5">
          <SearchBar value={search} onChange={setSearch} onOpenImport={() => setImportOpen(true)} />
        </div>
        <CategoryChipsRow
          active={category}
          onSelect={setCategory}
          onOpenFilters={() => setFilterSheetOpen(true)}
          filterCount={filterCount}
        />
      </div>

      <button
        onClick={() => setRecenterSignal((n) => n + 1)}
        className="absolute bottom-[240px] right-4 z-[1050] flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-soft shadow-[0_1px_2px_rgba(18,18,20,0.08),0_8px_24px_-10px_rgba(18,18,20,0.35)]"
        aria-label="Recenter map on visible places"
      >
        <LocateIcon className="h-5 w-5" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-[1050] rounded-t-[26px] bg-white/97 pt-1 shadow-[0_-8px_24px_rgba(18,18,20,0.12)] backdrop-blur">
        <div className="flex justify-center pt-2">
          <span className="h-1 w-9 rounded-full bg-line" />
        </div>
        <PlaceResultsCarousel
          places={filtered}
          selectedId={selectedId}
          onScrollSelect={setSelectedId}
          onOpenDetail={(id) => {
            setSelectedId(id)
            setDetailId(id)
          }}
        />
        <div className="pb-3" />
      </div>

      <FilterSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        availableNeighborhoods={availableNeighborhoods}
        neighborhoods={neighborhoods}
        onToggleNeighborhood={toggleNeighborhood}
        statuses={statuses}
        onToggleStatus={toggleStatus}
        onClear={() => {
          setNeighborhoods(new Set())
          setStatuses(new Set())
        }}
      />

      <PlaceDetailSheet place={detailPlace} open={detailId !== null} onClose={() => setDetailId(null)} />

      <CsvImportSheet open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}
