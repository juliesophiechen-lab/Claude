import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxHeightClass?: string
}

export function BottomSheet({ open, onClose, children, maxHeightClass = 'max-h-[85%]' }: BottomSheetProps) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-[1100]">
      <div className="animate-fade-in absolute inset-0 bg-ink/35" onClick={onClose} />
      <div
        className={`animate-sheet-up absolute inset-x-0 bottom-0 flex ${maxHeightClass} flex-col rounded-t-[26px] bg-white shadow-[0_-8px_30px_rgba(18,18,20,0.2)]`}
      >
        <button
          onClick={onClose}
          className="flex shrink-0 justify-center py-2.5"
          aria-label="Close"
        >
          <span className="h-1.5 w-10 rounded-full bg-line" />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  )
}
