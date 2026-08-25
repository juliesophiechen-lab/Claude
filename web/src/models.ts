export type FlightLeg = {
  id: string
  from: string
  fromCity: string
  to: string
  toCity: string
  date: string // ISO date, e.g. 2026-10-19
  departTime: string // HH:mm
  arriveTime: string // HH:mm
  arriveDayOffset: number // 0 = same day, 1 = next day
  airline: string
  flightNumber: string
  durationMinutes: number
  terminal?: string
}

export type Trip = {
  destination: string
  startDate: string // ISO date
  endDate: string // ISO date
  flights: FlightLeg[]
  /** Known-incomplete leg (e.g. return flight not booked yet) shown as a TBD card instead of a full FlightCard. */
  pendingFlight?: {
    date: string
    from: string
    note: string
  }
}

export type Participant = {
  id: string
  name: string
  image?: string
  color: string
  arrivalDate: string // ISO date
  departureDate: string // ISO date
}

export const PLACE_CATEGORIES = [
  'Food',
  'Café',
  'Shopping',
  'Beauty',
  'Culture',
  'Sightseeing',
  'Nightlife',
  'Activity',
] as const

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]

export const NEIGHBORHOODS = [
  'Hongdae',
  'Gangnam',
  'Seongsu',
  'Hannam',
  'Itaewon',
  'Myeongdong',
  'Insadong',
  'Bukchon',
] as const

export type Neighborhood = (typeof NEIGHBORHOODS)[number] | (string & {})

export type SourceType =
  | 'Instagram Reel'
  | 'Instagram Post'
  | 'TikTok'
  | 'YouTube'
  | 'Blog'
  | 'Recommendation'

export type Place = {
  id: string
  name: string
  category: PlaceCategory | string
  subcategory?: string
  address: string
  latitude: number
  longitude: number
  neighborhood: Neighborhood
  description?: string
  notes?: string
  sourceType?: SourceType
  sourceUrl?: string
  sourceThumbnail?: string
  creator?: string
  favorite: boolean
  visited: boolean
  planned: boolean
  priority: 1 | 2 | 3
  /** False/undefined = latitude/longitude is a neighborhood-fallback guess, not a real geocode. */
  geocoded?: boolean
}

export type ItineraryItemType =
  | 'flight'
  | 'transport'
  | 'confirmed'
  | 'reservation'
  | 'activity'
  | 'open'
  | 'idea'
  | 'free_time'

export type ItineraryItemStatus = 'confirmed' | 'open'

export type ItineraryItem = {
  id: string
  date: string // ISO date
  time?: string // HH:mm, absent for "open" items without a set time
  title: string
  type: ItineraryItemType
  placeId?: string
  status: ItineraryItemStatus
  notes?: string
  /** Marks the item Home's "next plan" card should feature, if any. */
  featured?: boolean
}

export const DICTIONARY_CATEGORIES = ['Basics', 'Restaurant', 'Café', 'Airport', 'Taxi', 'Shopping'] as const

export type DictionaryCategory = (typeof DICTIONARY_CATEGORIES)[number]

export type DictionaryPhrase = {
  id: string
  category: DictionaryCategory
  english: string
  korean: string
  pronunciation: string
}
