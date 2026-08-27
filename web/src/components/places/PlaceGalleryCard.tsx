import { useEffect, useRef, useState } from 'react'
import type { Participant, Place } from '../../models'
import { ensureGooglePlaceCached, useGooglePlaceCache } from '../../lib/googlePlaceCache'
import { Avatar } from '../common/Avatar'
import { PlaceThumb } from './PlaceThumb'
import { HeartIcon, PlayIcon, StarIcon } from '../../layout/icons'

interface PlaceGalleryCardProps {
  place: Place
  onOpen: () => void
  likeCount?: number
  liked?: boolean
  onToggleLike?: () => void
  likedByPeople?: Participant[]
}

export function PlaceGalleryCard({
  place,
  onOpen,
  likeCount,
  liked,
  onToggleLike,
  likedByPeople = [],
}: PlaceGalleryCardProps) {
  const cached = useGooglePlaceCache(place.id)
  const previewPhoto = cached?.photoUrl ?? place.sourceThumbnail
  const cardRef = useRef<HTMLDivElement>(null)
  const [imgFailed, setImgFailed] = useState(false)
  const [lastPreviewPhoto, setLastPreviewPhoto] = useState(previewPhoto)
  if (previewPhoto !== lastPreviewPhoto) {
    setLastPreviewPhoto(previewPhoto)
    setImgFailed(false)
  }

  // Fetch the live Google Places match once this card actually scrolls into
  // view, rather than requiring the user to open the detail sheet first —
  // still lazy (not all 309 places at once), just automatic instead of
  // click-gated.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          ensureGooglePlaceCached(place.id, place.name, place.address)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [place.id, place.name, place.address])

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen()
      }}
      className="flex w-full items-start gap-3 rounded-2xl bg-white p-3 text-left shadow-[0_1px_2px_rgba(18,18,20,0.06)]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        {previewPhoto && !imgFailed ? (
          <img
            src={previewPhoto}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
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
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleLike?.()
            }}
            className="shrink-0 p-0.5"
            aria-label="Like this place"
          >
            <HeartIcon className={`h-4 w-4 ${liked ? 'text-accent' : 'text-ink-faint'}`} filled={liked} />
          </button>
        </div>
        <p className="mt-0.5 text-[12px] text-ink-soft">
          {place.neighborhood} · {place.category}
          {cached?.rating != null && (
            <span className="ml-1.5 inline-flex items-center gap-0.5 font-medium text-ink">
              <StarIcon className="h-3 w-3 text-[#f2b01e]" /> {cached.rating.toFixed(1)}
            </span>
          )}
        </p>
        {place.description && (
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-ink-faint">{place.description}</p>
        )}
        {(!!likeCount || likedByPeople.length > 0) && (
          <div className="mt-1.5 flex items-center gap-1.5">
            {!!likeCount && (
              <p className="flex items-center gap-1 text-[11px] font-medium text-ink-soft">
                <HeartIcon className="h-3 w-3 text-accent" filled /> {likeCount}
              </p>
            )}
            {likedByPeople.length > 0 && (
              <div className="flex items-center">
                {likedByPeople.slice(0, 4).map((p, i) => (
                  <Avatar
                    key={p.id}
                    name={p.name}
                    color={p.color}
                    image={p.image}
                    size={16}
                    className={`ring-2 ring-white ${i > 0 ? '-ml-1.5' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
