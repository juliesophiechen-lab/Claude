export const CATEGORY_COLORS: Record<string, string> = {
  Diverses: '#64748b',
  Food: '#f97316',
  Shopping: '#ec4899',
  Sightseeing: '#3b82f6',
  Treatments: '#10b981',
}

export const DEFAULT_CATEGORY_COLOR = '#6b7280'

export function categoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR
}
