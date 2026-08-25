import { useState } from 'react'
import type { ItineraryItemType, Place } from '../../models'
import { trip } from '../../data/mockTrip'
import { dateRangeDays, formatDayMonth, formatWeekday } from '../../lib/dates'
import { useAppState } from '../../state/AppStateContext'
import { useToast } from '../../state/ToastContext'
import { BottomSheet } from '../common/BottomSheet'
import { Chip } from '../common/Chip'

const TYPE_OPTIONS: { label: string; value: ItineraryItemType }[] = [
  { label: 'Activity', value: 'activity' },
  { label: 'Dinner / reservation', value: 'reservation' },
  { label: 'Idea', value: 'idea' },
  { label: 'Open question', value: 'open' },
  { label: 'Free time', value: 'free_time' },
]

interface ItineraryItemSheetProps {
  open: boolean
  onClose: () => void
  place?: Place | null
  presetDate?: string
  presetType?: ItineraryItemType
}

export function ItineraryItemSheet({ open, onClose, place, presetDate, presetType }: ItineraryItemSheetProps) {
  const { addItineraryItem } = useAppState()
  const showToast = useToast()
  const tripDates = dateRangeDays(trip.startDate, trip.endDate)
  const [date, setDate] = useState<string>(presetDate ?? tripDates[1] ?? tripDates[0])
  const [time, setTime] = useState('')
  const [type, setType] = useState<ItineraryItemType>(presetType ?? (place ? 'activity' : 'idea'))
  const [title, setTitle] = useState('')

  if (!open) return null

  const resolvedTitle = place ? place.name : title
  const canSubmit = resolvedTitle.trim().length > 0

  function handleAdd() {
    if (!canSubmit) return
    addItineraryItem({
      date,
      time: time || undefined,
      title: resolvedTitle.trim(),
      type,
      placeId: place?.id,
    })
    showToast(`Added to ${formatDayMonth(date)}`)
    setTitle('')
    setTime('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} maxHeightClass="max-h-[85%]">
      <div className="px-5 pb-8">
        <h2 className="text-lg font-semibold text-ink">{place ? 'Add to itinerary' : 'New itinerary item'}</h2>

        {place ? (
          <p className="mt-0.5 text-sm text-ink-soft">{place.name}</p>
        ) : (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Where should we have dinner?"
            className="mt-3 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        )}

        <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Date</p>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {tripDates.map((d) => (
            <button
              key={d}
              onClick={() => setDate(d)}
              className={`flex shrink-0 flex-col items-center rounded-2xl border px-3.5 py-2 ${
                date === d ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink'
              }`}
            >
              <span className="text-[10px] font-medium uppercase opacity-70">{formatWeekday(d)}</span>
              <span className="text-sm font-semibold">{formatDayMonth(d)}</span>
            </button>
          ))}
        </div>

        <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          Time <span className="normal-case text-ink-faint/70">(optional)</span>
        </p>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
        />

        <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Type</p>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <Chip key={opt.value} label={opt.label} active={type === opt.value} onClick={() => setType(opt.value)} />
          ))}
        </div>

        <button
          onClick={handleAdd}
          disabled={!canSubmit}
          className="mt-7 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Add to {formatDayMonth(date)}
        </button>
      </div>
    </BottomSheet>
  )
}
