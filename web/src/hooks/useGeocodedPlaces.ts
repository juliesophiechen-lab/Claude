import { useEffect, useRef, useState } from 'react'
import type { GeocodedPlace, Place } from '../types'

// Geocoding runs client-side via the Naver Maps SDK's "geocoder" submodule
// (loaded in index.html with &submodules=geocoder), using the same ncpKeyId
// as the map itself. Results are cached in localStorage so repeat visits
// don't re-geocode all 150 addresses.
const CACHE_KEY = 'seoul-places-geocode-cache-v1'

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

function geocodeOne(address: string): Promise<CacheEntry> {
  return new Promise((resolve) => {
    window.naver.maps.Service.geocode({ query: address }, (status: string, response: any) => {
      if (status === window.naver.maps.Service.Status.ERROR) {
        resolve(null)
        return
      }
      const addresses = response?.v2?.addresses
      if (!addresses || addresses.length === 0) {
        resolve(null)
        return
      }
      const { x, y } = addresses[0]
      resolve({ lat: parseFloat(y), lng: parseFloat(x) })
    })
  })
}

interface GeocodingState {
  geocoded: GeocodedPlace[]
  failed: Place[]
  progress: number
  total: number
  done: boolean
}

export function useGeocodedPlaces(places: Place[], ready: boolean): GeocodingState {
  const [state, setState] = useState<GeocodingState>({
    geocoded: [],
    failed: [],
    progress: 0,
    total: places.length,
    done: false,
  })
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (!ready || places.length === 0) return
    cancelledRef.current = false

    const cache = loadCache()

    async function run() {
      const okResults: GeocodedPlace[] = []
      const failedResults: Place[] = []
      let cacheDirty = false

      for (let i = 0; i < places.length; i++) {
        if (cancelledRef.current) return
        const place = places[i]
        let entry = cache[place.address]

        if (entry === undefined) {
          entry = await geocodeOne(place.address)
          cache[place.address] = entry
          cacheDirty = true
          // Small pacing gap between requests
          await new Promise((r) => setTimeout(r, 120))
        }

        if (entry) {
          okResults.push({ ...place, lat: entry.lat, lng: entry.lng })
        } else {
          failedResults.push(place)
        }

        setState({
          geocoded: [...okResults],
          failed: [...failedResults],
          progress: i + 1,
          total: places.length,
          done: i + 1 === places.length,
        })
      }

      if (cacheDirty) saveCache(cache)
    }

    run()

    return () => {
      cancelledRef.current = true
    }
  }, [ready, places])

  return state
}
