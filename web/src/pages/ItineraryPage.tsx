import { useState } from 'react'
import { useAppState } from '../state/AppStateContext'
import { useToast } from '../state/ToastContext'
import { participants } from '../data/mockParticipants'
import { sortedItineraryDates, itemsForDate } from '../lib/trip'
import { DayGroup } from '../components/itinerary/DayGroup'
import { ItineraryItemSheet } from '../components/itinerary/ItineraryItemSheet'
import { PlusIcon } from '../layout/icons'
import type { ItineraryItem } from '../models'

export function ItineraryPage() {
  const { itineraryItems, places, deleteItineraryItem } = useAppState()
  const showToast = useToast()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [presetDate, setPresetDate] = useState<string | undefined>(undefined)
  const [editItem, setEditItem] = useState<ItineraryItem | null>(null)

  const dates = sortedItineraryDates(itineraryItems)

  function handleQuickDelete(id: string) {
    deleteItineraryItem(id)
    showToast('Eintrag gelöscht')
  }

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-5 pb-1 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Itinerary</h1>
        <button
          onClick={() => {
            setPresetDate(undefined)
            setSheetOpen(true)
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white"
          aria-label="Add itinerary item"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="divide-y divide-line">
        {dates.map((date) => (
          <DayGroup
            key={date}
            date={date}
            items={itemsForDate(itineraryItems, date)}
            places={places}
            participants={participants}
            onAddIdea={(d) => {
              setPresetDate(d)
              setSheetOpen(true)
            }}
            onEditItem={setEditItem}
            onDeleteItem={handleQuickDelete}
          />
        ))}
      </div>

      <ItineraryItemSheet
        open={sheetOpen || editItem !== null}
        onClose={() => {
          setSheetOpen(false)
          setEditItem(null)
        }}
        presetDate={presetDate}
        presetType={presetDate ? 'idea' : undefined}
        editItem={editItem}
      />
    </div>
  )
}
