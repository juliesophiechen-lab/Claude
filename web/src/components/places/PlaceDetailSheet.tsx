import { useState } from 'react'
import type { Place } from '../../models'
import { useAppState } from '../../state/AppStateContext'
import { useLikes } from '../../state/useLikes'
import { BottomSheet } from '../common/BottomSheet'
import { PlaceThumb } from './PlaceThumb'
import { ItineraryItemSheet } from '../itinerary/ItineraryItemSheet'
import { CheckIcon, ExternalLinkIcon, HeartIcon, MapPinIcon, PlayIcon, PlusIcon } from '../../layout/icons'

interface PlaceDetailSheetProps {
  place: Place | null
  open: boolean
  onClose: () => void
}

function instagramProfileUrl(creator?: string): string | null {
  if (!creator?.startsWith('@')) return null
  return `https://www.instagram.com/${creator.slice(1)}/`
}

function naverMapUrl(place: Place): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(`${place.name} ${place.address}`)}`
}

export function PlaceDetailSheet({ place, open, onClose }: PlaceDetailSheetProps) {
  const { toggleFavorite, toggleVisited } = useAppState()
  const { counts: likeCounts, likedByMe, toggleLike } = useLikes()
  const [addOpen, setAddOpen] = useState(false)

  if (!place) return null

  const profileUrl = instagramProfileUrl(place.creator)
  const likeCount = likeCounts[place.id] ?? 0
  const iLiked = likedByMe.has(place.id)

  return (
    <>
      <BottomSheet open={open && !addOpen} onClose={onClose}>
        <div className="pb-8">
          <div className="relative mx-5 h-40 overflow-hidden rounded-2xl">
            {place.sourceThumbnail ? (
              <img src={place.sourceThumbnail} alt="" className="h-full w-full object-cover" />
            ) : (
              <PlaceThumb category={place.category} className="h-full w-full" />
            )}
            <button
              onClick={() => toggleFavorite(place.id)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-accent shadow"
              aria-label="Toggle favorite"
            >
              <HeartIcon className="h-[18px] w-[18px]" filled={place.favorite} />
            </button>
            {place.visited && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-confirmed px-2.5 py-1 text-[11px] font-semibold text-white">
                <CheckIcon className="h-3 w-3" /> Visited
              </span>
            )}
          </div>

          <div className="px-5 pt-4">
            <h2 className="text-xl font-semibold leading-tight text-ink">{place.name}</h2>
            <p className="mt-1 text-[13px] text-ink-soft">
              {place.neighborhood} · {place.category}
              {place.subcategory ? ` · ${place.subcategory}` : ''}
            </p>

            <button
              onClick={() => toggleLike(place.id)}
              className={`mt-2.5 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                iLiked ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-ink-soft'
              }`}
            >
              <HeartIcon className="h-3.5 w-3.5" filled={iLiked} />
              {likeCount > 0
                ? `${likeCount} ${likeCount === 1 ? 'person likes' : 'people like'} this`
                : 'Be the first to like this'}
            </button>

            {place.description && <p className="mt-3 text-[15px] leading-relaxed text-ink">{place.description}</p>}

            {place.notes && (
              <div className="mt-3 rounded-xl bg-canvas-soft px-3.5 py-2.5 text-[13px] text-ink-soft">
                <span className="font-semibold text-ink-faint">Note · </span>
                {place.notes}
              </div>
            )}

            <div className="mt-5 border-t border-line pt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Saved from</p>
              {place.sourceType ? (
                <div className="flex items-center gap-3 rounded-2xl bg-canvas-soft p-2.5">
                  <PlaceThumb category={place.category} className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{place.sourceType}</p>
                    {place.creator && <p className="truncate text-xs text-ink-soft">{place.creator}</p>}
                  </div>
                  {place.sourceUrl && (
                    <a
                      href={place.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-white"
                    >
                      <PlayIcon className="h-3 w-3" /> Watch source
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-ink-soft">{place.creator ?? 'No source saved for this place.'}</p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {profileUrl && (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-ink"
                >
                  <ExternalLinkIcon className="h-3.5 w-3.5" /> Instagram profile
                </a>
              )}
              <a
                href={naverMapUrl(place)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-ink"
              >
                <MapPinIcon className="h-3.5 w-3.5" /> Open in Naver Map
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 px-5">
            <button
              onClick={() => setAddOpen(true)}
              className="col-span-2 flex items-center justify-center gap-1.5 rounded-full bg-accent py-3 text-sm font-semibold text-white active:opacity-90"
            >
              <PlusIcon className="h-4 w-4" /> Add to itinerary
            </button>
            <button
              onClick={() => toggleFavorite(place.id)}
              className={`flex items-center justify-center gap-1.5 rounded-full border py-3 text-sm font-semibold ${
                place.favorite ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-ink'
              }`}
            >
              <HeartIcon className="h-4 w-4" filled={place.favorite} /> Favorite
            </button>
            <button
              onClick={() => toggleVisited(place.id)}
              className={`flex items-center justify-center gap-1.5 rounded-full border py-3 text-sm font-semibold ${
                place.visited ? 'border-confirmed bg-confirmed-soft text-confirmed' : 'border-line text-ink'
              }`}
            >
              <CheckIcon className="h-4 w-4" /> {place.visited ? 'Visited' : 'Mark visited'}
            </button>
          </div>
        </div>
      </BottomSheet>

      <ItineraryItemSheet place={place} open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}
