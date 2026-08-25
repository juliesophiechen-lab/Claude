import { formatRange } from '../../lib/dates'

interface CountdownHeroProps {
  destination: string
  daysToGo: number
  startDate: string
  endDate: string
}

export function CountdownHero({ destination, daysToGo, startDate, endDate }: CountdownHeroProps) {
  const inTrip = daysToGo <= 0
  return (
    <div className="relative overflow-hidden rounded-b-[32px] bg-ink px-6 pb-8 pt-10 text-white">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          d="M-10 60 C 60 30, 120 90, 190 55 S 320 20, 410 70"
          stroke="white"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M-10 120 C 70 90, 130 150, 200 115 S 330 80, 410 130"
          stroke="white"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M-10 190 C 80 160, 140 220, 210 180 S 330 150, 410 200"
          stroke="white"
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M-10 250 C 60 220, 150 280, 220 240 S 340 210, 410 260"
          stroke="white"
          strokeWidth="1.2"
          fill="none"
        />
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

      <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
        {destination} trip
      </p>

      {inTrip ? (
        <h1 className="relative mt-3 text-[52px] font-semibold leading-[0.95] tracking-tight">
          In Seoul
        </h1>
      ) : (
        <div className="relative mt-2 flex items-baseline gap-3">
          <span className="text-[76px] font-semibold leading-none tracking-tight">{daysToGo}</span>
          <span className="pb-2 text-lg font-medium uppercase tracking-wide text-white/70">
            days to go
          </span>
        </div>
      )}

      <p className="relative mt-3 text-sm font-medium text-white/75">{formatRange(startDate, endDate)}</p>
    </div>
  )
}
