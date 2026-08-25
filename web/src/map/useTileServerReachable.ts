import { useEffect, useState } from 'react'

/**
 * null while checking, true once an OSM tile has loaded, false if it timed
 * out or errored (offline, or a restrictive network) — the caller falls back
 * to the mock map in that case. No key/account needed either way.
 */
export function useTileServerReachable(): boolean | null {
  const [reachable, setReachable] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    const timer = window.setTimeout(() => {
      if (!cancelled) setReachable(false)
    }, 4000)

    img.onload = () => {
      if (cancelled) return
      window.clearTimeout(timer)
      setReachable(true)
    }
    img.onerror = () => {
      if (cancelled) return
      window.clearTimeout(timer)
      setReachable(false)
    }
    img.src = 'https://tile.openstreetmap.org/0/0/0.png'

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return reachable
}
