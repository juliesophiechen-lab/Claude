import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google: any
    __onGoogleMapsLoaded?: () => void
  }
}

let loadPromise: Promise<void> | null = null

function ensureLoaded(apiKey: string): Promise<void> {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve) => {
    if (window.google?.maps) {
      resolve()
      return
    }
    window.__onGoogleMapsLoaded = () => resolve()
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__onGoogleMapsLoaded`
    script.async = true
    document.head.appendChild(script)
  })

  return loadPromise
}

/**
 * True once `window.google.maps` is available. Safe to call from multiple
 * components at once — they all resolve off the same shared load promise, so
 * only one script tag is ever injected and every caller still gets notified.
 */
export function useGoogleMapsReady(apiKey: string | undefined): boolean {
  const [ready, setReady] = useState(() => Boolean(window.google?.maps))

  useEffect(() => {
    if (ready || !apiKey) return
    let cancelled = false
    ensureLoaded(apiKey).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [ready, apiKey])

  return ready
}
