import { useMemo, useState } from 'react'
import { useAppState } from '../state/AppStateContext'
import { useLikes } from '../state/useLikes'
import { filterPlaces } from '../lib/places'
import { SearchBar } from '../components/places/SearchBar'
import { CategoryChipsRow } from '../components/places/CategoryChipsRow'
import { FilterSheet, type StatusFilter } from '../components/places/FilterSheet'
import { PlaceGalleryCard } from '../components/places/PlaceGalleryCard'
import { PlaceDetailSheet } from '../components/places/PlaceDetailSheet'
import { ScreenshotUploadSheet } from '../components/places/ScreenshotUploadSheet'

export function GalleryPage() {
  const { places } = useAppState()
  const { counts: likeCounts } = useLikes()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [neighborhoods, setNeighborhoods] = useState<Set<string>>(new Set())
  const [statuses, setStatuses] = useState<Set<StatusFilter>>(new Set())
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [sortMostLiked, setSortMostLiked] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const availableNeighborhoods = useMemo(
    () => Array.from(new Set(places.map((p) => p.neighborhood))).sort(),
    [places],
  )

  const filtered = useMemo(() => {
    const result = filterPlaces(places, { category, neighborhoods, statuses, search })
    if (!sortMostLiked) return result
    return [...result].sort((a, b) => (likeCounts[b.id] ?? 0) - (likeCounts[a.id] ?? 0))
  }, [places, category, neighborhoods, statuses, search, sortMostLiked, likeCounts])

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
      <div className="flex h-full flex-col">
        <div className="space-y-2.5 px-5 pb-2 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Gallery</h1>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search the gallery..."
            onOpenImport={() => setUploadOpen(true)}
            importAriaLabel="Screenshot hochladen"
          />
        </div>
        <div className="pb-2">
          <CategoryChipsRow
            active={category}
            onSelect={setCategory}
            onOpenFilters={() => setFilterSheetOpen(true)}
            filterCount={filterCount}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          <div className="flex items-center justify-between pb-2">
            <p className="text-[13px] font-medium text-ink-soft">{filtered.length} places</p>
            <button
              onClick={() => setSortMostLiked((v) => !v)}
              className={`rounded-full border px-3 py-1 text-[12px] font-medium ${
                sortMostLiked ? 'border-ink bg-ink text-white' : 'border-line text-ink-soft'
              }`}
            >
              Most liked
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((place) => (
              <PlaceGalleryCard
                key={place.id}
                place={place}
                onOpen={() => setDetailId(place.id)}
                likeCount={likeCounts[place.id]}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="pt-8 text-center text-sm text-ink-soft">No places match these filters.</p>
          )}
        </div>
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

      <ScreenshotUploadSheet open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  )
}
