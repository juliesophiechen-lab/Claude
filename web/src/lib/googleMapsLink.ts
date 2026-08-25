export interface ParsedGoogleMapsLink {
  name?: string
  latitude?: number
  longitude?: number
}

/**
 * Reads coordinates/name straight out of a full Google Maps URL — no API
 * call, no key, works entirely offline. Short share links (maps.app.goo.gl)
 * can't be resolved client-side (they redirect, and that redirect isn't
 * readable across origins), so those come back empty.
 */
export function parseGoogleMapsLink(url: string): ParsedGoogleMapsLink {
  const result: ParsedGoogleMapsLink = {}

  const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (coordMatch) {
    result.latitude = parseFloat(coordMatch[1])
    result.longitude = parseFloat(coordMatch[2])
  }

  const placeMatch = url.match(/\/place\/([^/@]+)/)
  if (placeMatch) {
    result.name = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ')
  }

  return result
}

export function isShortGoogleMapsLink(url: string): boolean {
  return /maps\.app\.goo\.gl|goo\.gl\/maps/.test(url)
}
