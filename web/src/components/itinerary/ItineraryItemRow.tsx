import { Link } from 'react-router-dom'
import type { ItineraryItem, Participant, Place } from '../../models'
import { ITINERARY_TYPE_META } from '../../lib/itineraryTypes'
import { Avatar } from '../common/Avatar'

interface ItineraryItemRowProps {
  item: ItineraryItem
  place?: Place
  addedByParticipant?: Participant
  onEdit?: () => void
  onDelete?: () => void
}

export function ItineraryItemRow({ item, place, addedByParticipant, onEdit, onDelete }: ItineraryItemRowProps) {
  const meta = ITINERARY_TYPE_META[item.type]
  return (
    <div
      onClick={onEdit}
      role={onEdit ? 'button' : undefined}
      tabIndex={onEdit ? 0 : undefined}
      className="flex w-full gap-3 py-2.5 text-left"
    >
      <div className="flex w-12 shrink-0 flex-col items-end pt-0.5">
        {item.time && <span className="text-[13px] font-semibold text-ink">{item.time}</span>}
      </div>
      <div className="flex flex-col items-center pt-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas-soft text-sm">
          {meta.emoji}
        </span>
        <span className="mt-1 w-px flex-1 bg-line" />
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] font-medium leading-snug text-ink">{item.title}</p>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              aria-label="Eintrag löschen"
              className="shrink-0 px-1 text-base leading-none text-ink-faint"
            >
              ×
            </button>
          )}
        </div>
        {place && (
          <Link
            to="/places"
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 inline-block text-xs font-medium text-ink-soft underline-offset-2 hover:underline"
          >
            {place.neighborhood} · {place.category}
          </Link>
        )}
        {item.notes && <p className="mt-1 text-xs text-ink-faint">{item.notes}</p>}
        {addedByParticipant && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Avatar
              name={addedByParticipant.name}
              color={addedByParticipant.color}
              image={addedByParticipant.image}
              size={18}
            />
            <p className="text-[11px] font-medium text-ink-soft">Vorgeschlagen von {addedByParticipant.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}
