import { useEffect, useRef } from 'react'
import type { MapViewProps } from './MapProvider'

// Muted, low-clutter style so pins stay the focus (hides POI/transit labels
// that would otherwise compete with our own category pins).
const MAP_STYLE = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
]

function markerIcon(google: any, color: string, selected: boolean) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: selected ? 11 : 7,
  }
}

export function GoogleMapView({ markers, onSelectMarker, bounds }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const gMarkersRef = useRef<Map<string, any>>(new Map())

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    const google = window.google

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: (bounds.minLat + bounds.maxLat) / 2, lng: (bounds.minLng + bounds.maxLng) / 2 },
      zoom: 12,
      styles: MAP_STYLE,
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
    })

    mapInstanceRef.current = map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    const google = window.google
    if (!map || !google) return

    gMarkersRef.current.forEach((m) => m.setMap(null))
    gMarkersRef.current = new Map()

    const latLngBounds = new google.maps.LatLngBounds()

    markers.forEach((marker) => {
      const gMarker = new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map,
        icon: markerIcon(google, marker.color, marker.selected),
        zIndex: marker.selected ? 200 : 100,
      })
      gMarker.addListener('click', () => onSelectMarker(marker.id))
      gMarkersRef.current.set(marker.id, gMarker)
      latLngBounds.extend(gMarker.getPosition())
    })

    if (markers.length > 0) {
      map.fitBounds(latLngBounds, 48)
    }
    // Re-run only when the marker set changes; per-marker selection styling is
    // handled in the effect below so this doesn't reset the map's viewport
    // every time the user just taps a pin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers.map((m) => m.id).join(',')])

  useEffect(() => {
    const google = window.google
    if (!google) return
    markers.forEach((marker) => {
      const gMarker = gMarkersRef.current.get(marker.id)
      if (!gMarker) return
      gMarker.setIcon(markerIcon(google, marker.color, marker.selected))
      gMarker.setZIndex(marker.selected ? 200 : 100)
      // Picks up e.g. a geocoding result landing after the marker was first
      // created (same id, so the effect above won't have re-run for it).
      const pos = gMarker.getPosition()
      if (!pos || pos.lat() !== marker.lat || pos.lng() !== marker.lng) {
        gMarker.setPosition({ lat: marker.lat, lng: marker.lng })
      }
    })
  }, [markers])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
