import { useEffect, useState } from 'react'

export interface CountdownParts {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

/** Live countdown to a target instant, ticking every second so it visibly counts down. */
export function useCountdown(targetDate: Date): CountdownParts {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const totalMs = targetDate.getTime() - now
  const clamped = Math.max(0, totalMs)

  return {
    totalMs,
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1000),
  }
}
