import type { ItineraryItem } from '../../models'

export function OpenItemCard({ item }: { item: ItineraryItem }) {
  return (
    <div className="rounded-2xl border border-dashed border-open/50 bg-open-soft/60 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-open">Open · to decide</p>
      <p className="mt-1 text-[15px] font-medium text-ink">{item.title}</p>
      {item.notes && <p className="mt-1 text-xs text-ink-soft">{item.notes}</p>}
    </div>
  )
}
