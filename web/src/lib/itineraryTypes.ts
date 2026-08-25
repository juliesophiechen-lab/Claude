import type { ItineraryItemType } from '../models'

interface TypeMeta {
  emoji: string
  label: string
}

export const ITINERARY_TYPE_META: Record<ItineraryItemType, TypeMeta> = {
  flight: { emoji: '✈️', label: 'Flight' },
  transport: { emoji: '🚕', label: 'Transport' },
  confirmed: { emoji: '✅', label: 'Confirmed' },
  reservation: { emoji: '🍽️', label: 'Reservation' },
  activity: { emoji: '📍', label: 'Activity' },
  open: { emoji: '❔', label: 'Open' },
  idea: { emoji: '💡', label: 'Idea' },
  free_time: { emoji: '🌤️', label: 'Free time' },
}
