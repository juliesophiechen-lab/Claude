import { formatRange } from '../../lib/dates'
import { useCountdown } from '../../lib/useCountdown'

interface CountdownHeroProps {
  destination: string
  departureAt: Date
  startDate: string
  endDate: string
}

function StatBlock({ value, label, tick }: { value: number; label: string; tick?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      <div
        key={tick ? value : undefined}
        className={`flex h-[52px] w-full items-center justify-center rounded-xl sm:h-[60px] ${tick ? 'animate-countdown-tick' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #9a7fff 0%, #6d4fd1 100%)',
          boxShadow: '0 4px 0 0 #3a2680, 0 8px 16px -4px rgba(0,0,0,0.45)',
        }}
      >
        <span className="tabular-nums text-[26px] font-black leading-none text-white sm:text-[32px]">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent/80">{label}</span>
    </div>
  )
}

export function CountdownHero({ destination, departureAt, startDate, endDate }: CountdownHeroProps) {
  const { totalMs, days, hours, minutes, seconds } = useCountdown(departureAt)
  const inTrip = totalMs <= 0

  return (
    <div
      className="relative overflow-hidden rounded-b-[28px] px-6 pb-9 pt-11 text-white"
      style={{ background: 'linear-gradient(165deg, #241547 0%, #120a24 65%, #0b0616 100%)' }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path d="M-10 60 C 60 30, 120 90, 190 55 S 320 20, 410 70" stroke="#7c5cff" strokeWidth="1.2" fill="none" />
        <path d="M-10 120 C 70 90, 130 150, 200 115 S 330 80, 410 130" stroke="#7c5cff" strokeWidth="1.2" fill="none" />
        <path d="M-10 190 C 80 160, 140 220, 210 180 S 330 150, 410 200" stroke="#7c5cff" strokeWidth="1.2" fill="none" />
        <path d="M-10 250 C 60 220, 150 280, 220 240 S 340 210, 410 260" stroke="#7c5cff" strokeWidth="1.2" fill="none" />
        {[
          [60, 70],
          [150, 100],
          [230, 60],
          [300, 140],
          [110, 200],
          [340, 220],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5} fill="#7c5cff" />
        ))}
      </svg>

      <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-accent">{destination} trip</p>

      {inTrip ? (
        <h1 className="relative mt-4 text-[44px] font-semibold leading-[0.95] tracking-tight">In Seoul</h1>
      ) : (
        <div className="relative mt-5 flex items-start gap-1.5">
          <StatBlock value={days} label={days === 1 ? 'day' : 'days'} />
          <span className="pt-3 text-xl font-black text-accent sm:pt-4">:</span>
          <StatBlock value={hours} label="hrs" />
          <span className="pt-3 text-xl font-black text-accent sm:pt-4">:</span>
          <StatBlock value={minutes} label="min" />
          <span className="pt-3 text-xl font-black text-accent sm:pt-4">:</span>
          <StatBlock value={seconds} label="sec" tick />
        </div>
      )}

      <p className="relative mt-4 text-sm font-medium text-white/75">{formatRange(startDate, endDate)}</p>
    </div>
  )
}
