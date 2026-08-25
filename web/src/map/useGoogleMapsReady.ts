import { useEffect, useState } from 'react'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

declare global {
  interface Window {
    google?: typeof google
    __onGoogleMapsLoaded?: () => void
    gm_authFailure?: () => void
  }
}

const LOAD_TIMEOUT_MS = 8000

let loadPromise: Promise<void> | null = null

function loadGoogleMaps(): Promise<void> {
  if (loadPromise) return loadPromise

  const attempt = new Promise<void>((resolve, reject) => {
    if (window.google?.maps) {
      resolve()
      return
    }
    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'))
      return
    }

    window.gm_authFailure = () => {
      reject(new Error('Google Maps auth failure — check API key restrictions/billing in Google Cloud Console'))
    }
    window.__onGoogleMapsLoaded = () => resolve()

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async&callback=__onGoogleMapsLoaded`
    script.async = true
    script.onerror = () => reject(new Error('Failed to load the Google Maps script'))
    document.head.appendChild(script)
  })

  const timeout = new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error(`Google Maps did not respond within ${LOAD_TIMEOUT_MS}ms`)), LOAD_TIMEOUT_MS)
  })

  // Once this resolves/rejects we're done for the session either way — a
  // timed-out load shouldn't keep retrying (or re-hanging) on every re-mount.
  loadPromise = Promise.race([attempt, timeout])
  return loadPromise
}

/** null = loading, true = ready to render, false = failed (see console for the real error). */
export function useGoogleMapsReady(): boolean | null {
  const [ready, setReady] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then(() => {
        if (!cancelled) setReady(true)
      })
      .catch((err) => {
        console.error('Google Maps failed to load:', err)
        if (!cancelled) setReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return ready
}
