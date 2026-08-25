import type { Place } from '../../models'
import { PlaceThumb } from './PlaceThumb'
import { HeartIcon, PlayIcon } from '../../layout/icons'

interface PlaceGalleryCardProps {
  place: Place
  onOpen: () => void
  likeCount?: number
}

export function PlaceGalleryCard({ place, onOpen, likeCount }: PlaceGalleryCardProps) {
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-start gap-3 rounded-2xl bg-white p-3 text-left shadow-[0_1px_2px_rgba(18,18,20,0.06)]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        {place.sourceThumbnail ? (
          <img src={place.sourceThumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <PlaceThumb category={place.category} className="h-full w-full" />
        )}
        {place.sourceUrl && (
          <span className="absolute bottom-1 left-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/50 text-white">
            <PlayIcon className="h-2 w-2" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-semibold leading-snug text-ink">{place.name}</p>
          {place.favorite && <HeartIcon className="h-4 w-4 shrink-0 text-accent" filled />}
        </div>
        <p className="mt-0.5 text-[12px] text-ink-soft">
          {place.neighborhood} · {place.category}
        </p>
        {place.description && (
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-ink-faint">{place.description}</p>
        )}
        {!!likeCount && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-ink-soft">
            <HeartIcon className="h-3 w-3 text-accent" filled /> {likeCount}
          </p>
        )}
      </div>
    </button>
  )
}
