import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google: any
    __onGoogleMapsLoaded?: () => void
  }
}

let loadStarted = false

function injectScript(apiKey: string) {
  if (loadStarted) return
  loadStarted = true

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__onGoogleMapsLoaded`
  script.async = true
  document.head.appendChild(script)
}

/** True once `window.google.maps` is available. Injects the SDK script itself, once. */
export function useGoogleMapsReady(apiKey: string | undefined): boolean {
  const [ready, setReady] = useState(() => Boolean(window.google?.maps))

  useEffect(() => {
    if (ready || !apiKey) return

    window.__onGoogleMapsLoaded = () => setReady(true)
    injectScript(apiKey)

    return () => {
      // Leave the script and global in place — Google's loader doesn't support
      // clean teardown, and other pages/instances may still depend on it.
    }
  }, [ready, apiKey])

  return ready
}
