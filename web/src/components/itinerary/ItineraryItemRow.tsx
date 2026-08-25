import { Link } from 'react-router-dom'
import type { ItineraryItem, Place } from '../../models'
import { ITINERARY_TYPE_META } from '../../lib/itineraryTypes'

export function ItineraryItemRow({ item, place }: { item: ItineraryItem; place?: Place }) {
  const meta = ITINERARY_TYPE_META[item.type]
  return (
    <div className="flex gap-3 py-2.5">
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
        <p className="text-[15px] font-medium leading-snug text-ink">{item.title}</p>
        {place && (
          <Link to="/places" className="mt-0.5 inline-block text-xs font-medium text-ink-soft underline-offset-2 hover:underline">
            {place.neighborhood} · {place.category}
          </Link>
        )}
        {item.notes && <p className="mt-1 text-xs text-ink-faint">{item.notes}</p>}
      </div>
    </div>
  )
}
