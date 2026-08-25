import { useRef } from 'react'
import type { Place } from '../../models'
import { PlaceThumb } from './PlaceThumb'
import { HeartIcon } from '../../layout/icons'

interface PlaceResultsCarouselProps {
  places: Place[]
  selectedId: string | null
  onScrollSelect: (id: string) => void
  onOpenDetail: (id: string) => void
}

const CARD_WIDTH = 216
const CARD_GAP = 12

export function PlaceResultsCarousel({ places, selectedId, onScrollSelect, onOpenDetail }: PlaceResultsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  function handleScroll() {
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const el = scrollerRef.current
      if (!el) return
      const index = Math.round(el.scrollLeft / (CARD_WIDTH + CARD_GAP))
      const place = places[Math.min(Math.max(index, 0), places.length - 1)]
      if (place && place.id !== selectedId) onScrollSelect(place.id)
    })
  }

  if (places.length === 0) {
    return (
      <div className="px-5 py-8 text-center">
        <p className="text-sm font-medium text-ink-soft">No places match these filters.</p>
      </div>
    )
  }

  return (
    <div className="px-5 pb-1 pt-2">
      <p className="mb-2.5 text-[13px] font-medium text-ink-soft">{places.length} places</p>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto"
      >
        {places.map((place) => (
          <button
            key={place.id}
            onClick={() => onOpenDetail(place.id)}
            style={{ width: CARD_WIDTH }}
            className={`flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-[0_1px_2px_rgba(18,18,20,0.06)] transition-colors ${
              place.id === selectedId ? 'border-ink' : 'border-transparent'
            }`}
          >
            <div className="relative h-24 w-full">
              <PlaceThumb category={place.category} className="h-full w-full" />
              {place.favorite && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-accent">
                  <HeartIcon className="h-3.5 w-3.5" filled />
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-semibold text-ink">{place.name}</p>
              <p className="mt-0.5 truncate text-xs text-ink-soft">
                {place.neighborhood} · {place.category}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
