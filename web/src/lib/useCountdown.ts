import { useEffect, useState } from 'react'

export interface CountdownParts {
  totalMs: number
  days: number
  hours: number
  minutes: number
}

/** Live countdown to a target instant, refreshed every 30s (no need for per-second ticking on a days/hours/minutes display). */
export function useCountdown(targetDate: Date): CountdownParts {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [])

  const totalMs = targetDate.getTime() - now
  const clamped = Math.max(0, totalMs)

  return {
    totalMs,
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
  }
}
