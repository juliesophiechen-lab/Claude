import { useEffect, useState } from 'react'

export function useNaverMapsReady(): boolean {
  const [ready, setReady] = useState(() => Boolean(window.naver?.maps))

  useEffect(() => {
    if (ready) return
    const interval = setInterval(() => {
      if (window.naver?.maps) {
        setReady(true)
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [ready])

  return ready
}
