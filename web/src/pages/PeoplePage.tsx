import { participants } from '../data/mockParticipants'
import { trip } from '../data/mockTrip'
import { dateRangeDays, formatDayMonth } from '../lib/dates'
import { fullOverlapDates } from '../lib/trip'
import { StayTimeline } from '../components/people/StayTimeline'
import { ParticipantCard } from '../components/people/ParticipantCard'

export function PeoplePage() {
  const days = dateRangeDays(trip.startDate, trip.endDate)
  const overlap = fullOverlapDates(participants)

  return (
    <div className="pb-6">
      <h1 className="px-5 pb-1 pt-6 text-2xl font-semibold tracking-tight text-ink">People</h1>

      {overlap.length > 0 && (
        <div className="mx-5 mt-3 rounded-2xl bg-ink px-5 py-4 text-white">
          <p className="text-3xl font-semibold leading-none">{overlap.length} days together</p>
          <p className="mt-1.5 text-sm text-white/70">
            {formatDayMonth(overlap[0])} – {formatDayMonth(overlap[overlap.length - 1])} · everyone in Seoul
          </p>
        </div>
      )}

      <div className="mt-5 px-5">
        <StayTimeline participants={participants} days={days} />
      </div>

      <div className="mt-6 space-y-2.5 px-5">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Everyone</p>
        {participants.map((p) => (
          <ParticipantCard key={p.id} participant={p} />
        ))}
      </div>
    </div>
  )
}
