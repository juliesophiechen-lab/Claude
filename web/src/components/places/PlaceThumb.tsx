import { categoryColor, categoryEmoji } from '../../lib/categories'

export function PlaceThumb({ category, className = '' }: { category: string; className?: string }) {
  const color = categoryColor(category)
  return (
    <div
      className={`flex items-center justify-center text-2xl ${className}`}
      style={{
        background: `linear-gradient(155deg, ${color}33, ${color}99)`,
      }}
    >
      <span style={{ filter: 'saturate(1.1)' }}>{categoryEmoji(category)}</span>
    </div>
  )
}
