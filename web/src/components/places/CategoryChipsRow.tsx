import { PLACE_CATEGORIES } from '../../models'
import { categoryColor, categoryEmoji } from '../../lib/categories'
import { Chip } from '../common/Chip'

interface CategoryChipsRowProps {
  active: string | null
  onSelect: (category: string | null) => void
  onOpenFilters: () => void
  filterCount: number
  /** Categories to surface first (e.g. from onboarding), other categories follow in their default order. */
  preferredOrder?: string[]
}

function orderCategories(preferredOrder?: string[]): readonly string[] {
  if (!preferredOrder || preferredOrder.length === 0) return PLACE_CATEGORIES
  const preferred = PLACE_CATEGORIES.filter((cat) => preferredOrder.includes(cat))
  const rest = PLACE_CATEGORIES.filter((cat) => !preferredOrder.includes(cat))
  return [...preferred, ...rest]
}

export function CategoryChipsRow({
  active,
  onSelect,
  onOpenFilters,
  filterCount,
  preferredOrder,
}: CategoryChipsRowProps) {
  const categories = orderCategories(preferredOrder)
  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-5 pb-1">
      <Chip label="All" active={active === null} onClick={() => onSelect(null)} />
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          active={active === cat}
          onClick={() => onSelect(active === cat ? null : cat)}
          emoji={categoryEmoji(cat)}
          dotColor={categoryColor(cat)}
        />
      ))}
      <button
        onClick={onOpenFilters}
        className={`relative flex shrink-0 items-center gap-1 whitespace-nowrap rounded-pill border px-3.5 py-2 text-[13px] font-medium transition-colors ${
          filterCount > 0 ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-soft'
        }`}
      >
        More
        {filterCount > 0 && (
          <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ink">
            {filterCount}
          </span>
        )}
      </button>
    </div>
  )
}
