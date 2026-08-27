import { useMemo, useState } from 'react'
import type { ItineraryItem, ItineraryItemType, Place } from '../../models'
import { trip } from '../../data/mockTrip'
import { dateRangeDays, formatDayMonth, formatWeekday } from '../../lib/dates'
import { useAppState } from '../../state/AppStateContext'
import { useToast } from '../../state/ToastContext'
import { BottomSheet } from '../common/BottomSheet'
import { Chip } from '../common/Chip'
import { PlaceThumb } from '../places/PlaceThumb'
import { SearchIcon } from '../../layout/icons'

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
  editItem?: ItineraryItem | null
}

export function ItineraryItemSheet({
  open,
  onClose,
  place,
  presetDate,
  presetType,
  editItem,
}: ItineraryItemSheetProps) {
  const { places, addItineraryItem, updateItineraryItem, deleteItineraryItem } = useAppState()
  const showToast = useToast()
  const tripDates = dateRangeDays(trip.startDate, trip.endDate)
  const [date, setDate] = useState<string>(editItem?.date ?? presetDate ?? tripDates[1] ?? tripDates[0])
  const [time, setTime] = useState(editItem?.time ?? '')
  const [type, setType] = useState<ItineraryItemType>(
    editItem?.type ?? presetType ?? (place ? 'activity' : 'idea'),
  )
  const [title, setTitle] = useState(editItem?.title ?? '')
  const [linkedPlaceId, setLinkedPlaceId] = useState<string | null>(editItem?.placeId ?? null)
  const [placeQuery, setPlaceQuery] = useState('')

  const linkedPlace = places.find((p) => p.id === linkedPlaceId)

  const placeMatches = useMemo(() => {
    const q = placeQuery.trim().toLowerCase()
    if (!q) return []
    return places.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6)
  }, [places, placeQuery])

  if (!open) return null

  const resolvedTitle = place ? place.name : title
  const canSubmit = resolvedTitle.trim().length > 0

  function handleAdd() {
    if (!canSubmit) return
    const resolvedPlaceId = place?.id ?? linkedPlaceId ?? undefined
    // Firestore's setDoc/updateDoc reject `undefined` field values outright, so
    // optional fields must be omitted entirely rather than set to undefined.
    const input = {
      date,
      ...(time ? { time } : {}),
      title: resolvedTitle.trim(),
      type,
      ...(resolvedPlaceId ? { placeId: resolvedPlaceId } : {}),
    }
    if (editItem) {
      updateItineraryItem(editItem.id, input)
      showToast('Änderung gespeichert')
    } else {
      addItineraryItem(input)
      showToast(`Added to ${formatDayMonth(date)}`)
    }
    setTitle('')
    setTime('')
    onClose()
  }

  function handleDelete() {
    if (!editItem) return
    deleteItineraryItem(editItem.id)
    showToast('Eintrag gelöscht')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} maxHeightClass="max-h-[85%]">
      <div className="px-5 pb-8">
        <h2 className="text-lg font-semibold text-ink">
          {editItem ? 'Eintrag bearbeiten' : place ? 'Add to itinerary' : 'New itinerary item'}
        </h2>

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

        {!place && (
          <>
            <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
              Link to a place <span className="normal-case text-ink-faint/70">(optional)</span>
            </p>
            {linkedPlace ? (
              <div className="flex items-center gap-2.5 rounded-2xl bg-canvas-soft py-2 pl-2 pr-3">
                <PlaceThumb category={linkedPlace.category} className="h-9 w-9 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{linkedPlace.name}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {linkedPlace.neighborhood} · {linkedPlace.category}
                  </p>
                </div>
                <button
                  onClick={() => setLinkedPlaceId(null)}
                  aria-label="Verknüpfung entfernen"
                  className="shrink-0 px-1.5 text-lg leading-none text-ink-faint"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  value={placeQuery}
                  onChange={(e) => setPlaceQuery(e.target.value)}
                  placeholder="Search saved places..."
                  className="w-full rounded-2xl border border-line bg-white py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
                />
                {placeMatches.length > 0 && (
                  <div className="mt-1.5 space-y-1 rounded-2xl border border-line bg-white p-1.5 shadow-[0_4px_16px_rgba(18,18,20,0.08)]">
                    {placeMatches.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setLinkedPlaceId(p.id)
                          setPlaceQuery('')
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left active:bg-canvas-soft"
                      >
                        <PlaceThumb category={p.category} className="h-8 w-8 shrink-0 rounded-lg" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                          <p className="truncate text-[11px] text-ink-soft">
                            {p.neighborhood} · {p.category}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
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
          className="mt-7 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {editItem ? 'Änderungen speichern' : `Add to ${formatDayMonth(date)}`}
        </button>

        {editItem && (
          <button
            onClick={handleDelete}
            className="mt-2.5 w-full rounded-full border border-line py-3 text-sm font-semibold text-ink-soft"
          >
            Eintrag löschen
          </button>
        )}
      </div>
    </BottomSheet>
  )
}
