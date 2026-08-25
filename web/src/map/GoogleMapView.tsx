import { useEffect, useRef } from 'react'
import type { MapViewProps } from './MapProvider'

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
      const icon: google.maps.Symbol = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: marker.selected ? 11 : 7,
        fillColor: marker.color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      }

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
