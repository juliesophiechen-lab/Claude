import type { PlaceCategory } from '../models'

interface CategoryMeta {
  color: string
  emoji: string
}

const CATEGORY_META: Record<PlaceCategory, CategoryMeta> = {
  Restaurant: { color: 'var(--color-restaurant)', emoji: '🍽️' },
  Café: { color: 'var(--color-cafe)', emoji: '☕' },
  Shopping: { color: 'var(--color-shopping)', emoji: '🛍️' },
  'Beauty Treatments': { color: 'var(--color-beauty)', emoji: '✨' },
  Spa: { color: 'var(--color-spa)', emoji: '🧖' },
  Sightseeing: { color: 'var(--color-sightseeing)', emoji: '🏛️' },
  'Night Out': { color: 'var(--color-nightout)', emoji: '🌙' },
  Activity: { color: 'var(--color-activity)', emoji: '🧭' },
  Fitness: { color: 'var(--color-fitness)', emoji: '🏋️' },
}

const DEFAULT_META: CategoryMeta = { color: 'var(--color-ink-faint)', emoji: '📍' }

export function categoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category as PlaceCategory] ?? DEFAULT_META
}

export function categoryColor(category: string): string {
  return categoryMeta(category).color
}

export function categoryEmoji(category: string): string {
  return categoryMeta(category).emoji
}
