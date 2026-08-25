import { BottomSheet } from '../common/BottomSheet'
import { Chip } from '../common/Chip'

export type StatusFilter = 'Favorite' | 'Planned' | 'Visited'
const STATUSES: StatusFilter[] = ['Favorite', 'Planned', 'Visited']

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  availableNeighborhoods: string[]
  neighborhoods: Set<string>
  onToggleNeighborhood: (n: string) => void
  statuses: Set<StatusFilter>
  onToggleStatus: (s: StatusFilter) => void
  onClear: () => void
}

export function FilterSheet({
  open,
  onClose,
  availableNeighborhoods,
  neighborhoods,
  onToggleNeighborhood,
  statuses,
  onToggleStatus,
  onClear,
}: FilterSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} maxHeightClass="max-h-[70%]">
      <div className="px-5 pb-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Filters</h2>
          <button onClick={onClear} className="text-sm font-medium text-accent">
            Clear
          </button>
        </div>

        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Neighborhood</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {availableNeighborhoods.map((n) => (
            <Chip key={n} label={n} active={neighborhoods.has(n)} onClick={() => onToggleNeighborhood(n)} />
          ))}
        </div>

        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Status</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Chip key={s} label={s} active={statuses.has(s)} onClick={() => onToggleStatus(s)} />
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-white"
        >
          Show results
        </button>
      </div>
    </BottomSheet>
  )
}
