import { useEffect, useRef } from 'react'
import type { Place } from '../models'

// Client-side geocoding for places that only carry a neighborhood-fallback
// position (geocoded !== true). Runs once the map's tile server is reachable,
// paced at ~1 request/second per Nominatim's usage policy, and caches results
// in localStorage by address so repeat app loads don't re-geocode the same
// places. No API key needed — Nominatim (OpenStreetMap's free geocoder) is a
// public, unauthenticated service.
const CACHE_KEY = 'seoul-guide-geocode-cache-v1'
const REQUEST_DELAY_MS = 1100

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

async function geocodeOne(address: string): Promise<CacheEntry> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const results = await res.json()
    if (!Array.isArray(results) || results.length === 0) return null
    return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
  } catch {
    return null
  }
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

    const cache = loadCache()

    async function run() {
      const todo = placesRef.current.filter((p) => !p.geocoded)
      let cacheDirty = false

      for (const place of todo) {
        let entry = cache[place.address]
        if (entry === undefined) {
          entry = await geocodeOne(place.address)
          cache[place.address] = entry
          cacheDirty = true
          await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS))
        }
        if (entry) onResolvedRef.current(place.id, entry.lat, entry.lng)
      }

      if (cacheDirty) saveCache(cache)
    }

    run()
  }, [ready])
}
