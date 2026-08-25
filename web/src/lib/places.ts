import type { Place } from '../models'
import type { StatusFilter } from '../components/places/FilterSheet'

export interface PlaceFilters {
  category: string | null
  neighborhoods: Set<string>
  statuses: Set<StatusFilter>
  search: string
}

export function filterPlaces(places: Place[], filters: PlaceFilters): Place[] {
  const q = filters.search.trim().toLowerCase()
  return places.filter((p) => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.neighborhoods.size > 0 && !filters.neighborhoods.has(p.neighborhood)) return false
    if (filters.statuses.size > 0) {
      const matchesStatus =
        (filters.statuses.has('Favorite') && p.favorite) ||
        (filters.statuses.has('Planned') && p.planned) ||
        (filters.statuses.has('Visited') && p.visited)
      if (!matchesStatus) return false
    }
    if (q) {
      const haystack = `${p.name} ${p.neighborhood} ${p.category} ${p.subcategory ?? ''}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}
