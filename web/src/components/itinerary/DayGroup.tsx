import type { ItineraryItem, Participant, Place } from '../../models'
import { formatDayMonth, formatWeekday } from '../../lib/dates'
import { participantsOnDate } from '../../lib/trip'
import { Avatar } from '../common/Avatar'
import { ItineraryItemRow } from './ItineraryItemRow'
import { OpenItemCard } from './OpenItemCard'
import { PlusIcon } from '../../layout/icons'

interface DayGroupProps {
  date: string
  items: ItineraryItem[]
  places: Place[]
  participants: Participant[]
  onAddIdea: (date: string) => void
  onEditItem: (item: ItineraryItem) => void
}

export function DayGroup({ date, items, places, participants, onAddIdea, onEditItem }: DayGroupProps) {
  const confirmedItems = items.filter((i) => i.status === 'confirmed')
  const openItems = items.filter((i) => i.status === 'open')
  const present = participantsOnDate(participants, date)

  function participantFor(item: ItineraryItem) {
    return item.addedBy ? participants.find((p) => p.id === item.addedBy) : undefined
  }

  return (
    <section className="px-5 py-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-ink-faint">{formatWeekday(date)}</span>
          <h2 className="text-xl font-semibold tracking-tight text-ink">{formatDayMonth(date)}</h2>
        </div>
        {present.length > 0 && (
          <div className="flex -space-x-1.5">
            {present.map((p) => (
              <Avatar key={p.id} name={p.name} color={p.color} size={22} className="ring-2 ring-canvas-soft" />
            ))}
          </div>
        )}
      </div>

      {confirmedItems.length > 0 && (
        <div className="rounded-2xl bg-white px-3 shadow-[0_1px_2px_rgba(18,18,20,0.06)]">
          {confirmedItems.map((item, i) => (
            <div key={item.id} className={i === confirmedItems.length - 1 ? '[&>div>span:last-child]:hidden' : ''}>
              <ItineraryItemRow
                item={item}
                place={places.find((p) => p.id === item.placeId)}
                addedByParticipant={participantFor(item)}
                onEdit={() => onEditItem(item)}
              />
            </div>
          ))}
        </div>
      )}

      {openItems.length > 0 && (
        <div className="mt-3 space-y-2">
          {openItems.map((item) => (
            <OpenItemCard
              key={item.id}
              item={item}
              addedByParticipant={participantFor(item)}
              onEdit={() => onEditItem(item)}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => onAddIdea(date)}
        className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-ink-soft"
      >
        <PlusIcon className="h-3.5 w-3.5" /> Add idea
      </button>
    </section>
  )
}
