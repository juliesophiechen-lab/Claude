export interface Place {
  id: string
  name: string
  address: string
  description: string
  category: string
  district: string
  googleMapsUrl: string
}

export interface GeocodedPlace extends Place {
  lat: number
  lng: number
}
