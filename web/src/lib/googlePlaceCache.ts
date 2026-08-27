import { useEffect, useState } from 'react'
import { findGooglePlace, type GooglePlaceInfo } from './googlePlaces'

/** null = fetched, no confident match. undefined = not fetched yet. */
type CacheEntry = GooglePlaceInfo | null

const cache = new Map<string, CacheEntry>()
const inFlight = new Set<string>()
const listeners = new Map<string, Set<() => void>>()

function notify(key: string) {
  listeners.get(key)?.forEach((fn) => fn())
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

/** Fetches once (per key) and populates the shared cache; safe to call from multiple mounted components. */
export function ensureGooglePlaceCached(key: string, name: string, address: string) {
  if (cache.has(key) || inFlight.has(key)) return
  inFlight.add(key)
  findGooglePlace(name, address)
    .then((info) => {
      cache.set(key, info)
      notify(key)
    })
    .finally(() => {
      inFlight.delete(key)
    })
}
