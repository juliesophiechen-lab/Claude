import { useEffect, useRef } from 'react'
import type { MapViewProps } from './MapProvider'

function emojiMarkerIcon(emoji: string, color: string, selected: boolean): google.maps.Icon {
  const px = selected ? 40 : 32
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="${color}" stroke="#ffffff" stroke-width="3" />
    <text x="20" y="27" font-size="19" text-anchor="middle">${emoji}</text>
  </svg>`
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(px, px),
    anchor: new google.maps.Point(px / 2, px / 2),
  }
}

export function GoogleMapView({ markers, onSelectMarker, bounds, recenterSignal }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const googleMarkersRef = useRef<Map<string, google.maps.Marker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: { lat: (bounds.minLat + bounds.maxLat) / 2, lng: (bounds.minLng + bounds.maxLng) / 2 },
      zoom: 12,
      disableDefaultUI: false,
      clickableIcons: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const existing = googleMarkersRef.current
    const seen = new Set<string>()
    const bounds = new google.maps.LatLngBounds()

    markers.forEach((marker) => {
      seen.add(marker.id)
      let gMarker = existing.get(marker.id)
      const position = { lat: marker.lat, lng: marker.lng }
      const icon = emojiMarkerIcon(marker.emoji, marker.color, marker.selected)

      if (!gMarker) {
        gMarker = new google.maps.Marker({ map, position, icon })
        gMarker.addListener('click', () => onSelectMarker(marker.id))
        existing.set(marker.id, gMarker)
      } else {
        gMarker.setPosition(position)
        gMarker.setIcon(icon)
      }
      if (marker.selected) gMarker.setZIndex(999)
      bounds.extend(position)
    })

    existing.forEach((gMarker, id) => {
      if (!seen.has(id)) {
        gMarker.setMap(null)
        existing.delete(id)
      }
    })

    if (markers.length > 0) {
      map.fitBounds(bounds, 48)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, recenterSignal])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
