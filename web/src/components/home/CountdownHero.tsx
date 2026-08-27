import { formatRange } from '../../lib/dates'
import { useCountdown } from '../../lib/useCountdown'

interface CountdownHeroProps {
  destination: string
  departureAt: Date
  startDate: string
  endDate: string
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tabular-nums text-[44px] font-bold leading-none tracking-tight sm:text-[52px]">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{label}</span>
    </div>
  )
}

export function CountdownHero({ destination, departureAt, startDate, endDate }: CountdownHeroProps) {
  const { totalMs, days, hours, minutes } = useCountdown(departureAt)
  const inTrip = totalMs <= 0

  return (
    <div className="relative overflow-hidden rounded-b-[36px] bg-ink px-6 pb-9 pt-11 text-white">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path d="M-10 60 C 60 30, 120 90, 190 55 S 320 20, 410 70" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M-10 120 C 70 90, 130 150, 200 115 S 330 80, 410 130" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M-10 190 C 80 160, 140 220, 210 180 S 330 150, 410 200" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M-10 250 C 60 220, 150 280, 220 240 S 340 210, 410 260" stroke="white" strokeWidth="1.2" fill="none" />
        {[
          [60, 70],
          [150, 100],
          [230, 60],
          [300, 140],
          [110, 200],
          [340, 220],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5} fill="white" />
        ))}
      </svg>

      <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{destination} trip</p>

      {inTrip ? (
        <h1 className="relative mt-4 text-[44px] font-semibold leading-[0.95] tracking-tight">In Seoul</h1>
      ) : (
        <div className="relative mt-5 flex items-start justify-between rounded-3xl bg-white/[0.07] px-2 py-4 ring-1 ring-white/10">
          <StatBlock value={days} label={days === 1 ? 'day' : 'days'} />
          <span className="pt-2 text-2xl font-light text-white/25">:</span>
          <StatBlock value={hours} label="hrs" />
          <span className="pt-2 text-2xl font-light text-white/25">:</span>
          <StatBlock value={minutes} label="min" />
        </div>
      )}

      <p className="relative mt-4 text-sm font-medium text-white/75">{formatRange(startDate, endDate)}</p>
    </div>
  )
}
