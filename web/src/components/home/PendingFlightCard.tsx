import type { Trip } from '../../models'

export function PendingFlightCard({ pendingFlight }: { pendingFlight: NonNullable<Trip['pendingFlight']> }) {
  return (
    <div className="rounded-2xl border border-dashed border-open/50 bg-open-soft/60 px-4 py-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-open">Open · to book</p>
      <p className="mt-1 text-sm font-semibold text-ink">{pendingFlight.note}</p>
      <p className="mt-0.5 text-xs text-ink-soft">Departing {pendingFlight.from}</p>
    </div>
  )
}
