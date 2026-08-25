import type { GeocodedPlace, Place } from '../types'
import { categoryColor } from '../categories'

interface SidebarProps {
  categories: string[]
  activeCategories: Set<string>
  onToggleCategory: (category: string) => void
  places: GeocodedPlace[]
  failed: Place[]
  selectedId: string | null
  onSelect: (id: string) => void
  progress: number
  total: number
}

export function Sidebar({
  categories,
  activeCategories,
  onToggleCategory,
  places,
  failed,
  selectedId,
  onSelect,
  progress,
  total,
}: SidebarProps) {
  const visible = places.filter((p) => activeCategories.has(p.category))

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Seoul Places</h1>
        <p className="subtitle">
          {progress < total ? `Locating places… ${progress}/${total}` : `${places.length} of ${total} places on the map`}
        </p>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${activeCategories.has(cat) ? 'active' : ''}`}
            style={{ '--chip-color': categoryColor(cat) } as React.CSSProperties}
            onClick={() => onToggleCategory(cat)}
          >
            <span className="dot" />
            {cat}
          </button>
        ))}
      </div>

      <div className="place-list">
        {visible.map((place) => (
          <button
            key={place.id}
            className={`place-item ${place.id === selectedId ? 'selected' : ''}`}
            onClick={() => onSelect(place.id)}
          >
            <span className="dot" style={{ background: categoryColor(place.category) }} />
            <span className="place-info">
              <span className="place-name">{place.name}</span>
              <span className="place-district">{place.district || place.address}</span>
            </span>
          </button>
        ))}
        {visible.length === 0 && progress >= total && (
          <p className="empty-hint">No places in the selected categories.</p>
        )}
      </div>

      {failed.length > 0 && (
        <details className="failed-list">
          <summary>{failed.length} place(s) could not be located</summary>
          <ul>
            {failed.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
