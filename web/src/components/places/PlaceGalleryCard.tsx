import type { Place } from '../../models'
import { PlaceThumb } from './PlaceThumb'
import { HeartIcon, PlayIcon } from '../../layout/icons'

export function PlaceGalleryCard({ place, onOpen }: { place: Place; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_2px_rgba(18,18,20,0.06)]"
    >
      <div className="relative aspect-square w-full">
        <PlaceThumb category={place.category} className="h-full w-full" />
        {place.favorite && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-accent">
            <HeartIcon className="h-3.5 w-3.5" filled />
          </span>
        )}
        {place.sourceUrl && (
          <span className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white">
            <PlayIcon className="h-3 w-3" />
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="truncate text-[13px] font-semibold text-ink">{place.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-ink-soft">
          {place.neighborhood} · {place.category}
        </p>
      </div>
    </button>
  )
}
