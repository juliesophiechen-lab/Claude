import type { ItineraryItem, Participant, Place } from '../models'
import { dateRangeDays, todayISO } from './dates'

export function participantsOnDate(participants: Participant[], dateStr: string): Participant[] {
  return participants.filter((p) => p.arrivalDate <= dateStr && p.departureDate >= dateStr)
}

/** Every date in the trip where all participants are present at once. */
export function fullOverlapDates(participants: Participant[]): string[] {
  if (participants.length < 2) return []
  const start = participants.reduce((a, p) => (p.arrivalDate > a ? p.arrivalDate : a), participants[0].arrivalDate)
  const end = participants.reduce((a, p) => (p.departureDate < a ? p.departureDate : a), participants[0].departureDate)
  if (start > end) return []
  return dateRangeDays(start, end)
}

export function daysInSeoul(participant: Participant): number {
  const start = new Date(participant.arrivalDate)
  const end = new Date(participant.departureDate)
  return Math.round((end.getTime() - start.getTime()) / 86400000) + 1
}

export function itemsForDate(items: ItineraryItem[], dateStr: string): ItineraryItem[] {
  return items
    .filter((i) => i.date === dateStr)
    .sort((a, b) => {
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.localeCompare(b.time)
    })
}

export function sortedItineraryDates(items: ItineraryItem[]): string[] {
  return Array.from(new Set(items.map((i) => i.date))).sort()
}

export function nextPlanItem(items: ItineraryItem[]): ItineraryItem | undefined {
  const today = todayISO()
  const upcoming = items.filter((i) => i.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  if (upcoming.length === 0) return items[0]
  return (
    upcoming.find((i) => i.featured) ??
    upcoming.find((i) => i.status === 'confirmed' && i.type !== 'flight' && i.type !== 'transport') ??
    upcoming[0]
  )
}

export function placeById(places: Place[], id?: string): Place | undefined {
  if (!id) return undefined
  return places.find((p) => p.id === id)
}
