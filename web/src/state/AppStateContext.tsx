import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ItineraryItem, ItineraryItemType, Place } from '../models'
import { places as seedPlaces } from '../data/mockPlaces'
import { itineraryItems as seedItinerary } from '../data/mockItinerary'

const STORAGE_KEY = 'seoul-guide-state-v1'

interface StoredState {
  places: Place[]
  itineraryItems: ItineraryItem[]
}

function loadStored(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredState
  } catch {
    return null
  }
}

function saveStored(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / private-mode errors
  }
}

export interface NewItineraryItemInput {
  date: string
  time?: string
  title: string
  type: ItineraryItemType
  placeId?: string
  notes?: string
}

interface AppState {
  places: Place[]
  itineraryItems: ItineraryItem[]
  toggleFavorite: (placeId: string) => void
  toggleVisited: (placeId: string) => void
  addItineraryItem: (input: NewItineraryItemInput) => ItineraryItem
  importPlaces: (newPlaces: Place[]) => void
  resetToMockData: () => void
}

const AppStateCtx = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const stored = useMemo(() => loadStored(), [])
  const [places, setPlaces] = useState<Place[]>(stored?.places ?? seedPlaces)
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>(
    stored?.itineraryItems ?? seedItinerary,
  )

  useEffect(() => {
    saveStored({ places, itineraryItems })
  }, [places, itineraryItems])

  function toggleFavorite(placeId: string) {
    setPlaces((prev) => prev.map((p) => (p.id === placeId ? { ...p, favorite: !p.favorite } : p)))
  }

  function toggleVisited(placeId: string) {
    setPlaces((prev) => prev.map((p) => (p.id === placeId ? { ...p, visited: !p.visited } : p)))
  }

  function addItineraryItem(input: NewItineraryItemInput): ItineraryItem {
    const item: ItineraryItem = {
      id: `it-custom-${Date.now()}`,
      status: 'confirmed',
      ...input,
    }
    setItineraryItems((prev) => [...prev, item])
    if (input.placeId) {
      setPlaces((prev) => prev.map((p) => (p.id === input.placeId ? { ...p, planned: true } : p)))
    }
    return item
  }

  function importPlaces(newPlaces: Place[]) {
    setPlaces((prev) => [...prev, ...newPlaces])
  }

  function resetToMockData() {
    setPlaces(seedPlaces)
    setItineraryItems(seedItinerary)
  }

  const value: AppState = {
    places,
    itineraryItems,
    toggleFavorite,
    toggleVisited,
    addItineraryItem,
    importPlaces,
    resetToMockData,
  }

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateCtx)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
