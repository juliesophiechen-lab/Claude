import { useEffect, useState } from 'react'

const FLOATERS: { emoji: string; top: string; left: string; size: number; delay: number; duration: number }[] = [
  { emoji: '☕', top: '14%', left: '14%', size: 44, delay: 0, duration: 5.5 },
  { emoji: '🪩', top: '20%', left: '78%', size: 40, delay: 0.6, duration: 6.2 },
  { emoji: '🍸', top: '68%', left: '10%', size: 42, delay: 1.1, duration: 5 },
  { emoji: '🎾', top: '76%', left: '80%', size: 34, delay: 0.3, duration: 4.6 },
  { emoji: '👜', top: '10%', left: '46%', size: 32, delay: 1.4, duration: 6.8 },
  { emoji: '📷', top: '82%', left: '48%', size: 36, delay: 0.8, duration: 5.8 },
]

const BOB_MS = 1600
const SWISH_MS = 500

interface SplashScreenProps {
  onDone: () => void
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const bobTimer = setTimeout(() => setExiting(true), BOB_MS)
    return () => clearTimeout(bobTimer)
  }, [])

  useEffect(() => {
    if (!exiting) return
    const swishTimer = setTimeout(onDone, SWISH_MS)
    return () => clearTimeout(swishTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exiting])

  return (
    <div
      className={`fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden ${exiting ? 'animate-splash-swish-up' : ''}`}
      style={{ background: 'linear-gradient(180deg, #b9a8ff 0%, #e9e3ff 100%)' }}
    >
      {/* soft clouds */}
      <div className="absolute -left-10 top-[8%] h-28 w-52 rounded-full bg-white/50 blur-2xl" />
      <div className="absolute -right-8 top-[30%] h-24 w-44 rounded-full bg-white/40 blur-2xl" />
      <div className="absolute bottom-[12%] left-[20%] h-20 w-40 rounded-full bg-white/40 blur-2xl" />

      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className="absolute flex items-center justify-center rounded-full bg-white/70 shadow-[0_8px_20px_rgba(75,47,191,0.25)] animate-splash-float"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            fontSize: f.size * 0.52,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        >
          {f.emoji}
        </span>
      ))}

      <div className="relative z-10 flex flex-col items-center animate-splash-pop">
        <div
          className={`-rotate-3 text-center font-black leading-[0.85] tracking-tight ${exiting ? '' : 'animate-splash-bob'}`}
          style={{
            fontSize: '4.2rem',
            background: 'linear-gradient(180deg, #ffffff 0%, #cabdff 55%, #7c5cff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 6px 14px rgba(75,47,191,0.35))',
          }}
        >
          <div>SE</div>
          <div>OUL</div>
        </div>
        <p className="mt-7 text-[13px] font-medium lowercase tracking-wide text-white/90">
          loading your new map…
        </p>
      </div>
    </div>
  )
}
