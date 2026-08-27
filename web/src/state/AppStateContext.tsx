import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import type { ItineraryItem, ItineraryItemType, Place } from '../models'
import { places as seedPlaces } from '../data/mockPlaces'
import { itineraryItems as seedItinerary } from '../data/mockItinerary'
import { db } from '../lib/firebase'
import { useIdentity } from './IdentityContext'

const STORAGE_KEY = 'seoul-guide-state-v2'

interface StoredState {
  places: Place[]
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

const SEOUL_CENTER = { latitude: 37.55607, longitude: 126.97236 }

function suggestedPlaceFromDoc(id: string, data: Record<string, unknown>): Place {
  const hasRealCoords = typeof data.latitude === 'number' && typeof data.longitude === 'number'
  const sourceUrl = data.sourceUrl as string | undefined
  return {
    id,
    name: (data.name as string) || 'Suggested place',
    category: 'Suggested',
    address: 'Seoul, Seoul, South Korea',
    latitude: hasRealCoords ? (data.latitude as number) : SEOUL_CENTER.latitude,
    longitude: hasRealCoords ? (data.longitude as number) : SEOUL_CENTER.longitude,
    neighborhood: 'Seoul',
    description: data.note as string | undefined,
    sourceThumbnail: data.imageUrl as string | undefined,
    sourceType: sourceUrl ? 'Recommendation' : undefined,
    sourceUrl,
    googleMapsUrl: data.googleMapsUrl as string | undefined,
    creator: data.addedByName as string | undefined,
    favorite: false,
    visited: false,
    planned: false,
    priority: 3,
    geocoded: hasRealCoords,
  }
}

async function ensureItinerarySeeded() {
  const markerRef = doc(db, 'meta', 'itinerarySeeded')
  const shouldSeed = await runTransaction(db, async (tx) => {
    const snap = await tx.get(markerRef)
    if (snap.exists()) return false
    tx.set(markerRef, { seededAt: serverTimestamp() })
    return true
  })
  if (shouldSeed) {
    await Promise.all(seedItinerary.map((item) => setDoc(doc(db, 'itineraryItems', item.id), item)))
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
  updatePlaceCoordinates: (placeId: string, latitude: number, longitude: number) => void
  addItineraryItem: (input: NewItineraryItemInput) => void
  updateItineraryItem: (id: string, input: NewItineraryItemInput) => void
  deleteItineraryItem: (id: string) => void
  importPlaces: (newPlaces: Place[]) => void
  resetToMockData: () => void
}

const AppStateCtx = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { me } = useIdentity()
  const [places, setPlaces] = useState<Place[]>(() => loadStored()?.places ?? seedPlaces)
  const [suggestedPlaces, setSuggestedPlaces] = useState<Place[]>([])
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>(seedItinerary)

  useEffect(() => {
    saveStored({ places })
  }, [places])

  useEffect(() => {
    ensureItinerarySeeded().catch((err) => console.error('itinerary seed failed', err))
    const unsub = onSnapshot(collection(db, 'itineraryItems'), (snap) => {
      setItineraryItems(snap.docs.map((d) => d.data() as ItineraryItem))
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'suggestedPlaces'), (snap) => {
      setSuggestedPlaces(snap.docs.map((d) => suggestedPlaceFromDoc(d.id, d.data())))
    })
    return unsub
  }, [])

  function toggleFavorite(placeId: string) {
    setPlaces((prev) => prev.map((p) => (p.id === placeId ? { ...p, favorite: !p.favorite } : p)))
    setSuggestedPlaces((prev) => prev.map((p) => (p.id === placeId ? { ...p, favorite: !p.favorite } : p)))
  }

  function toggleVisited(placeId: string) {
    setPlaces((prev) => prev.map((p) => (p.id === placeId ? { ...p, visited: !p.visited } : p)))
    setSuggestedPlaces((prev) => prev.map((p) => (p.id === placeId ? { ...p, visited: !p.visited } : p)))
  }

  function updatePlaceCoordinates(placeId: string, latitude: number, longitude: number) {
    setPlaces((prev) =>
      prev.map((p) => (p.id === placeId ? { ...p, latitude, longitude, geocoded: true } : p)),
    )
  }

  function addItineraryItem(input: NewItineraryItemInput) {
    const id = `it-custom-${Date.now()}`
    const item: ItineraryItem = {
      id,
      status: 'confirmed',
      ...input,
      ...(me ? { addedBy: me.id } : {}),
    }
    setDoc(doc(db, 'itineraryItems', id), item).catch((err) => console.error('add itinerary item failed', err))
    if (input.placeId) {
      setPlaces((prev) => prev.map((p) => (p.id === input.placeId ? { ...p, planned: true } : p)))
      setSuggestedPlaces((prev) => prev.map((p) => (p.id === input.placeId ? { ...p, planned: true } : p)))
    }
  }

  function updateItineraryItem(id: string, input: NewItineraryItemInput) {
    updateDoc(doc(db, 'itineraryItems', id), { ...input }).catch((err) =>
      console.error('update itinerary item failed', err),
    )
  }

  function deleteItineraryItem(id: string) {
    deleteDoc(doc(db, 'itineraryItems', id)).catch((err) => console.error('delete itinerary item failed', err))
  }

  function importPlaces(newPlaces: Place[]) {
    setPlaces((prev) => [...prev, ...newPlaces])
  }

  function resetToMockData() {
    setPlaces(seedPlaces)
  }

  const value: AppState = {
    places: [...places, ...suggestedPlaces],
    itineraryItems,
    toggleFavorite,
    toggleVisited,
    updatePlaceCoordinates,
    addItineraryItem,
    updateItineraryItem,
    deleteItineraryItem,
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
