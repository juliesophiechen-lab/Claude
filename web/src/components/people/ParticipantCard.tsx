import type { Participant } from '../../models'
import { formatDayMonth } from '../../lib/dates'
import { daysInSeoul } from '../../lib/trip'
import { Avatar } from '../common/Avatar'

export function ParticipantCard({ participant }: { participant: Participant }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(18,18,20,0.06)]">
      <Avatar name={participant.name} color={participant.color} image={participant.image} size={38} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{participant.name}</p>
        <p className="text-xs text-ink-soft">
          {formatDayMonth(participant.arrivalDate)} → {formatDayMonth(participant.departureDate)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold leading-none text-ink">{daysInSeoul(participant)}</p>
        <p className="text-[10px] font-medium uppercase tracking-wide text-ink-faint">days</p>
      </div>
    </div>
  )
}
