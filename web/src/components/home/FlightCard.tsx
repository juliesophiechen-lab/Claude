import type { FlightLeg } from '../../models'
import { formatDayMonth } from '../../lib/dates'
import { PlaneIcon } from '../../layout/icons'

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function FlightCard({ flight }: { flight: FlightLeg }) {
  return (
    <div className="rounded-card bg-white p-5 shadow-[0_1px_2px_rgba(18,18,20,0.06),0_10px_30px_-12px_rgba(18,18,20,0.18)]">
      <div className="flex items-center justify-between text-[13px] font-medium text-ink-soft">
        <span>{formatDayMonth(flight.date)}</span>
        <span>
          {flight.airline} · {flight.flightNumber}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-3xl font-semibold tracking-tight text-ink">{flight.from}</p>
          <p className="mt-0.5 text-[13px] text-ink-soft">{flight.fromCity}</p>
        </div>

        <div className="flex flex-1 flex-col items-center px-1 text-ink-faint">
          <span className="text-[11px] font-medium uppercase tracking-wide">
            {formatDuration(flight.durationMinutes)}
          </span>
          <div className="my-1.5 flex w-full items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
            <span className="h-px flex-1 bg-line" />
            <PlaneIcon className="h-4 w-4 rotate-90 text-ink-soft" />
            <span className="h-px flex-1 bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink-faint" />
          </div>
        </div>

        <div className="flex-1 text-right">
          <p className="text-3xl font-semibold tracking-tight text-ink">{flight.to}</p>
          <p className="mt-0.5 text-[13px] text-ink-soft">{flight.toCity}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
        <span className="font-semibold text-ink">
          {flight.departTime}{' '}
          <span className="font-normal text-ink-faint">→</span> {flight.arriveTime}
          {flight.arriveDayOffset > 0 && (
            <sup className="ml-0.5 text-[11px] font-semibold text-accent">+{flight.arriveDayOffset}</sup>
          )}
        </span>
        {flight.terminal && <span className="text-ink-soft">Terminal {flight.terminal}</span>}
      </div>
    </div>
  )
}

export function FlightSummaryRow({ flight }: { flight: FlightLeg }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(18,18,20,0.06)]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-sunk text-ink-soft">
        <PlaneIcon className="h-3.5 w-3.5 rotate-90" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          {flight.from} → {flight.to}
        </p>
        <p className="text-xs text-ink-soft">
          {formatDayMonth(flight.date)} · {flight.departTime}
        </p>
      </div>
      <span className="text-xs text-ink-faint">
        {flight.airline} {flight.flightNumber}
      </span>
    </div>
  )
}
