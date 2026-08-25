interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
  dotColor?: string
  emoji?: string
}

export function Chip({ label, active, onClick, dotColor, emoji }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border px-3.5 py-2 text-[13px] font-medium transition-colors ${
        active
          ? 'border-ink bg-ink text-white'
          : 'border-line bg-white text-ink-soft active:bg-canvas-sunk'
      }`}
    >
      {emoji && <span>{emoji}</span>}
      {dotColor && !emoji && (
        <span className="h-2 w-2 rounded-full" style={{ background: active ? 'white' : dotColor }} />
      )}
      {label}
    </button>
  )
}
