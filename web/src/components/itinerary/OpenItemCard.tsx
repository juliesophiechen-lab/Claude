import type { ItineraryItem, Participant } from '../../models'
import { Avatar } from '../common/Avatar'

interface OpenItemCardProps {
  item: ItineraryItem
  addedByParticipant?: Participant
  onEdit?: () => void
}

export function OpenItemCard({ item, addedByParticipant, onEdit }: OpenItemCardProps) {
  return (
    <div
      onClick={onEdit}
      role={onEdit ? 'button' : undefined}
      tabIndex={onEdit ? 0 : undefined}
      className="rounded-2xl border border-dashed border-open/50 bg-open-soft/60 px-4 py-3 text-left"
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-open">Open · to decide</p>
      <p className="mt-1 text-[15px] font-medium text-ink">{item.title}</p>
      {item.notes && <p className="mt-1 text-xs text-ink-soft">{item.notes}</p>}
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
  )
}
