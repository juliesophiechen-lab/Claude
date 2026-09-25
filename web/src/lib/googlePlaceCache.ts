import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { findGooglePlace, type GooglePlaceInfo } from './googlePlaces'

/** null = fetched, no confident match. undefined = not fetched yet. */
type CacheEntry = GooglePlaceInfo | null

const cache = new Map<string, CacheEntry>()
const inFlight = new Set<string>()
const listeners = new Map<string, Set<() => void>>()

// Google's Place Photo Service URLs (photos[].getUrl()) are session/referrer
// -bound and start 403ing (rendering Google's own "photo unavailable" icon,
// which never fires our <img onError>) after they've been cached for a
// while — so a permanently-cached photoUrl eventually goes stale forever.
// Refetching after this TTL keeps previews working without giving up the
// shared cache for everything else (rating, hours, etc.).
const PHOTO_TTL_MS = 24 * 60 * 60 * 1000

function notify(key: string) {
  listeners.get(key)?.forEach((fn) => fn())
}

// Firestore's setDoc rejects any field whose value is `undefined` outright —
// GooglePlaceInfo has several optional fields Google's API often omits, so
// they must be stripped before writing, not just left as undefined keys.
function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T
}

/**
 * Reactive read of the shared Google Places cache — does NOT trigger a
 * fetch on its own. Cards use this so a place's preview appears once
 * anyone has looked it up (e.g. via its detail sheet), without every card
 * in a long list firing its own live API call.
 */
export function useGooglePlaceCache(key: string): CacheEntry | undefined {
  const [, forceRender] = useState(0)

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1)
    if (!listeners.has(key)) listeners.set(key, new Set())
    listeners.get(key)?.add(listener)
    return () => {
      listeners.get(key)?.delete(listener)
    }
  }, [key])

  return cache.get(key)
}

/**
 * Resolves a place once (per key) and populates the shared in-memory cache —
 * safe to call from multiple mounted components. Backed by a Firestore
 * `googlePlaceInfo/{key}` doc shared across everyone and every reload: once
 * any device has resolved a place, every other device (and every future page
 * load, not just the current browser tab) reads that instead of hitting the
 * Google Places API again, so previews survive refreshes and don't get
 * re-fetched 5x over for the same place.
 */
export function ensureGooglePlaceCached(key: string, name: string, address: string) {
  if (cache.has(key) || inFlight.has(key)) return
  inFlight.add(key)

  ;(async () => {
    try {
      const snap = await getDoc(doc(db, 'googlePlaceInfo', key))
      if (snap.exists()) {
        const data = snap.data() as GooglePlaceInfo & { fetchedAt?: number }
        const isFresh = typeof data.fetchedAt === 'number' && Date.now() - data.fetchedAt < PHOTO_TTL_MS
        if (isFresh) {
          cache.set(key, data)
          notify(key)
          return
        }
        // Stale (or from before this TTL existed) — fall through and
        // refetch instead of serving a photo link likely to 403 by now.
      }
    } catch (err) {
      console.warn('googlePlaceInfo read failed', err)
    }

    const info = await findGooglePlace(name, address)
    cache.set(key, info)
    notify(key)
    if (info) {
      setDoc(doc(db, 'googlePlaceInfo', key), stripUndefined({ ...info, fetchedAt: Date.now() })).catch((err) =>
        console.warn('googlePlaceInfo write failed', err),
      )
    }
  })().finally(() => {
    inFlight.delete(key)
  })
}
