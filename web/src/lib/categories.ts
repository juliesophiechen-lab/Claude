import type { PlaceCategory } from '../models'

interface CategoryMeta {
  color: string
  emoji: string
}

const CATEGORY_META: Record<PlaceCategory, CategoryMeta> = {
  Food: { color: 'var(--color-food)', emoji: '🍜' },
  Café: { color: 'var(--color-cafe)', emoji: '☕' },
  Shopping: { color: 'var(--color-shopping)', emoji: '🛍️' },
  Beauty: { color: 'var(--color-beauty)', emoji: '✨' },
  Culture: { color: 'var(--color-culture)', emoji: '🖼️' },
  Sightseeing: { color: 'var(--color-sightseeing)', emoji: '🏯' },
  Nightlife: { color: 'var(--color-nightlife)', emoji: '🌙' },
  Activity: { color: 'var(--color-activity)', emoji: '🎨' },
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
