import { SearchIcon, UploadIcon } from '../../layout/icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onOpenImport?: () => void
  importAriaLabel?: string
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  onOpenImport,
  importAriaLabel = 'Upload CSV',
  placeholder = 'Search places...',
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-pill bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(18,18,20,0.08),0_8px_24px_-10px_rgba(18,18,20,0.25)]">
        <SearchIcon className="h-4 w-4 shrink-0 text-ink-faint" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>
      {onOpenImport && (
        <button
          onClick={onOpenImport}
          aria-label={importAriaLabel}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-white text-ink-soft shadow-[0_1px_2px_rgba(18,18,20,0.08),0_8px_24px_-10px_rgba(18,18,20,0.25)] active:bg-canvas-sunk"
        >
          <UploadIcon className="h-[18px] w-[18px]" />
        </button>
      )}
    </div>
  )
}
