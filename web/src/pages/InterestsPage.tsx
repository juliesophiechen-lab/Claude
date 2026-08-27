import { useState } from 'react'
import { PLACE_CATEGORIES } from '../models'
import { categoryEmoji } from '../lib/categories'

interface InterestsPageProps {
  onSubmit: (interests: string[]) => void
}

export function InterestsPage({ onSubmit }: InterestsPageProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(cat: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <div className="relative flex h-dvh flex-col items-center overflow-hidden bg-ink px-6 pb-8 pt-16 text-white">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path d="M-10 60 C 60 30, 120 90, 190 55 S 320 20, 410 70" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M-10 140 C 70 110, 130 170, 200 135 S 330 100, 410 150" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M-10 220 C 80 190, 140 250, 210 210 S 330 180, 410 230" stroke="white" strokeWidth="1.2" fill="none" />
      </svg>

      <div className="relative flex w-full max-w-xs flex-1 flex-col">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Seoul Trip</p>
        <h1 className="mt-2 text-center text-3xl font-semibold leading-tight tracking-tight lowercase">
          was magst du?
        </h1>
        <p className="mt-2 text-center text-sm text-white/60">
          wir zeigen dir deine lieblingskategorien zuerst — überall, wo du filtern kannst.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          {PLACE_CATEGORIES.map((cat) => {
            const active = selected.has(cat)
            return (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                className={`flex min-w-[92px] flex-col items-center gap-1.5 rounded-2xl border px-4 py-3.5 transition-colors ${
                  active
                    ? 'border-accent bg-accent/20 text-white'
                    : 'border-white/15 bg-white/[0.06] text-white/70 active:bg-white/10'
                }`}
              >
                <span className="text-xl">{categoryEmoji(cat)}</span>
                <span className="text-[12px] font-medium lowercase">{cat}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-auto flex flex-col items-center gap-3 pt-8">
          <button
            onClick={() => onSubmit(Array.from(selected))}
            disabled={selected.size === 0}
            className="w-full rounded-full bg-white py-3.5 text-sm font-semibold lowercase text-ink disabled:opacity-30"
          >
            sounds good.
          </button>
          <button onClick={() => onSubmit([])} className="text-xs font-medium lowercase text-white/50">
            skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
