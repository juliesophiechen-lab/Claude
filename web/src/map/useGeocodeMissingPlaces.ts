import { useEffect, useRef } from 'react'
import type { Place } from '../models'

// Client-side geocoding for places that only carry a neighborhood-fallback
// position (geocoded !== true). Runs once Google Maps is ready, paced with a
// small delay between requests, and caches results in localStorage by
// address so repeat app loads don't re-geocode the same places.
const CACHE_KEY = 'seoul-guide-geocode-cache-v1'

type CacheEntry = { lat: number; lng: number } | null

function loadCache(): Record<string, CacheEntry> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveCache(cache: Record<string, CacheEntry>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // ignore quota / private-mode errors
  }
}

function geocodeOne(geocoder: any, address: string): Promise<CacheEntry> {
  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results: any[], status: string) => {
      if (status !== 'OK' || !results || results.length === 0) {
        resolve(null)
        return
      }
      const loc = results[0].geometry.location
      resolve({ lat: loc.lat(), lng: loc.lng() })
    })
  })
}

export function useGeocodeMissingPlaces(
  places: Place[],
  ready: boolean,
  onResolved: (placeId: string, lat: number, lng: number) => void,
) {
  const placesRef = useRef(places)
  const onResolvedRef = useRef(onResolved)
  const startedRef = useRef(false)

  useEffect(() => {
    placesRef.current = places
    onResolvedRef.current = onResolved
  })

  useEffect(() => {
    if (!ready || startedRef.current) return
    startedRef.current = true

    const geocoder = new window.google.maps.Geocoder()
    const cache = loadCache()

    async function run() {
      const todo = placesRef.current.filter((p) => !p.geocoded)
      let cacheDirty = false

      for (const place of todo) {
        let entry = cache[place.address]
        if (entry === undefined) {
          entry = await geocodeOne(geocoder, place.address)
          cache[place.address] = entry
          cacheDirty = true
          await new Promise((r) => setTimeout(r, 200))
        }
        if (entry) onResolvedRef.current(place.id, entry.lat, entry.lng)
      }

      if (cacheDirty) saveCache(cache)
    }

    run()
  }, [ready])
}
