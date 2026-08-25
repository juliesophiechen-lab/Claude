import { useEffect, useState } from 'react'
import type { Place } from '../../models'
import { useAppState } from '../../state/AppStateContext'
import { useLikes } from '../../state/useLikes'
import { findGooglePlace, type GooglePlaceInfo } from '../../lib/googlePlaces'
import { BottomSheet } from '../common/BottomSheet'
import { PlaceThumb } from './PlaceThumb'
import { ItineraryItemSheet } from '../itinerary/ItineraryItemSheet'
import {
  CheckIcon,
  ExternalLinkIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
} from '../../layout/icons'

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

function googleMapsLinkFor(place: Place, googleInfo: GooglePlaceInfo | null): string {
  if (googleInfo?.googleMapsUrl) return googleInfo.googleMapsUrl
  if (place.googleMapsUrl) return place.googleMapsUrl
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`
}

export function PlaceDetailSheet({ place, open, onClose }: PlaceDetailSheetProps) {
  const { toggleFavorite, toggleVisited } = useAppState()
  const { counts: likeCounts, likedByMe, toggleLike } = useLikes()
  const [addOpen, setAddOpen] = useState(false)
  const [googleInfo, setGoogleInfo] = useState<GooglePlaceInfo | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (!open || !place) {
      setGoogleInfo(null)
      return
    }
    let cancelled = false
    setGoogleInfo(null)
    setGoogleLoading(true)
    findGooglePlace(place.name, place.address)
      .then((info) => {
        if (!cancelled) setGoogleInfo(info)
      })
      .finally(() => {
        if (!cancelled) setGoogleLoading(false)
      })
    return () => {
      cancelled = true
    }
    // Re-run only when the sheet opens for a (possibly) different place, not
    // on every re-render of the underlying places array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, place?.id])

  if (!place) return null

  const profileUrl = instagramProfileUrl(place.creator)
  const likeCount = likeCounts[place.id] ?? 0
  const iLiked = likedByMe.has(place.id)

  return (
    <>
      <BottomSheet open={open && !addOpen} onClose={onClose}>
        <div className="pb-8">
          <div className="relative mx-5 h-40 overflow-hidden rounded-2xl">
            {googleInfo?.photoUrl || place.sourceThumbnail ? (
              <img src={googleInfo?.photoUrl ?? place.sourceThumbnail} alt="" className="h-full w-full object-cover" />
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

            {googleLoading && <p className="mt-2 text-xs text-ink-faint">Checking Google Maps…</p>}

            {googleInfo && (
              <div className="mt-2.5 rounded-2xl bg-canvas-soft p-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {googleInfo.rating != null && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                      <StarIcon className="h-3.5 w-3.5 text-[#f2b01e]" /> {googleInfo.rating.toFixed(1)}
                      {googleInfo.userRatingsTotal != null && (
                        <span className="font-normal text-ink-soft">({googleInfo.userRatingsTotal})</span>
                      )}
                    </span>
                  )}
                  {googleInfo.phoneNumber && (
                    <a
                      href={`tel:${googleInfo.phoneNumber}`}
                      className="flex items-center gap-1 text-xs font-medium text-ink-soft"
                    >
                      <PhoneIcon className="h-3.5 w-3.5" /> {googleInfo.phoneNumber}
                    </a>
                  )}
                  {googleInfo.websiteUrl && (
                    <a
                      href={googleInfo.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium text-ink-soft underline underline-offset-2"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" /> Website
                    </a>
                  )}
                </div>
                {googleInfo.openingHours && googleInfo.openingHours.length > 0 && (
                  <ul className="mt-2 space-y-0.5 text-[12px] text-ink-soft">
                    {googleInfo.openingHours.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-[11px] text-ink-faint">Matched to a real place on Google Maps</p>
              </div>
            )}

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
              <a
                href={googleMapsLinkFor(place, googleInfo)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-ink"
              >
                <MapPinIcon className="h-3.5 w-3.5" /> Open in Google Maps
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
