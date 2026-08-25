export interface GooglePlaceInfo {
  placeId: string
  name: string
  rating?: number
  userRatingsTotal?: number
  photoUrl?: string
  openingHours?: string[]
  websiteUrl?: string
  googleMapsUrl?: string
  phoneNumber?: string
  formattedAddress?: string
}

let serviceDiv: HTMLDivElement | null = null

function getService(): google.maps.places.PlacesService | null {
  if (!window.google?.maps?.places) return null
  if (!serviceDiv) serviceDiv = document.createElement('div')
  return new google.maps.places.PlacesService(serviceDiv)
}

/**
 * Resolves a saved place to a real Google Maps place (name + address text
 * search, then full details) so the detail sheet can show Google's own
 * rating/photo/hours/links instead of just our curated notes. Resolves to
 * null if Google Maps isn't loaded or no confident match is found — callers
 * should fall back to their own data in that case.
 */
export function findGooglePlace(name: string, address: string): Promise<GooglePlaceInfo | null> {
  return new Promise((resolve) => {
    const service = getService()
    if (!service) {
      resolve(null)
      return
    }

    service.findPlaceFromQuery(
      { query: `${name}, ${address}`, fields: ['place_id'] },
      (results, status) => {
        const placeId = results?.[0]?.place_id
        if (status !== google.maps.places.PlacesServiceStatus.OK || !placeId) {
          resolve(null)
          return
        }

        service.getDetails(
          {
            placeId,
            fields: [
              'name',
              'rating',
              'user_ratings_total',
              'photos',
              'opening_hours',
              'website',
              'url',
              'formatted_phone_number',
              'formatted_address',
            ],
          },
          (details, detailStatus) => {
            if (detailStatus !== google.maps.places.PlacesServiceStatus.OK || !details) {
              resolve(null)
              return
            }
            resolve({
              placeId,
              name: details.name ?? name,
              rating: details.rating,
              userRatingsTotal: details.user_ratings_total,
              photoUrl: details.photos?.[0]?.getUrl({ maxWidth: 640 }),
              openingHours: details.opening_hours?.weekday_text,
              websiteUrl: details.website,
              googleMapsUrl: details.url,
              phoneNumber: details.formatted_phone_number,
              formattedAddress: details.formatted_address,
            })
          },
        )
      },
    )
  })
}
