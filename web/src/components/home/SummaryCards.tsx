import { Link } from 'react-router-dom'
import type { ItineraryItem, Participant, Place } from '../../models'
import { Avatar } from '../common/Avatar'
import { formatDayMonth, formatWeekday } from '../../lib/dates'
import { ChevronLeftIcon } from '../../layout/icons'

export function PeopleJoiningCard({ participants }: { participants: Participant[] }) {
  return (
    <Link
      to="/people"
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(18,18,20,0.06)] active:scale-[0.98] transition-transform"
    >
      <div className="flex -space-x-2">
        {participants.map((p) => (
          <Avatar key={p.id} name={p.name} color={p.color} image={p.image} size={30} className="ring-2 ring-white" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{participants.length} people joining</p>
        <p className="text-xs text-ink-soft">See who's around when</p>
      </div>
      <ChevronLeftIcon className="h-4 w-4 rotate-180 text-ink-faint" />
    </Link>
  )
}

export function NextPlanCard({ item, place }: { item?: ItineraryItem; place?: Place }) {
  if (!item) return null
  return (
    <Link
      to="/itinerary"
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(18,18,20,0.06)] active:scale-[0.98] transition-transform"
    >
      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
        <span className="text-[9px] font-semibold uppercase leading-none">{formatWeekday(item.date)}</span>
        <span className="text-sm font-bold leading-none">{formatDayMonth(item.date).split(' ')[0]}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Next plan</p>
        <p className="truncate text-sm font-semibold text-ink">
          {item.title}
          {place && !item.title.includes(place.neighborhood) ? ` · ${place.neighborhood}` : ''}
        </p>
      </div>
      <ChevronLeftIcon className="h-4 w-4 rotate-180 text-ink-faint" />
    </Link>
  )
}
