import { useEffect, useRef } from 'react'
import type { GeocodedPlace } from '../types'
import { categoryColor } from '../categories'

interface NaverMapProps {
  places: GeocodedPlace[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }

function markerIcon(color: string, highlighted: boolean) {
  const size = highlighted ? 34 : 22
  const strokeWidth = highlighted ? 3 : 2
  return {
    content: `
      <div style="
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:${color};
        border:${strokeWidth}px solid white;
        box-shadow:0 1px 4px rgba(0,0,0,0.4);
        transform:translate(-50%,-50%);
      "></div>`,
    anchor: new window.naver.maps.Point(0, 0),
  }
}

function infoWindowContent(place: GeocodedPlace) {
  const color = categoryColor(place.category)
  return `
    <div style="padding:12px 14px;max-width:260px;font-family:system-ui,sans-serif;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;"></span>
        <strong style="font-size:14px;">${escapeHtml(place.name)}</strong>
      </div>
      <div style="font-size:12px;color:#555;margin-bottom:6px;">${escapeHtml(place.address)}</div>
      ${place.description ? `<div style="font-size:12px;color:#333;margin-bottom:8px;">${escapeHtml(place.description)}</div>` : ''}
      <a href="${place.googleMapsUrl}" target="_blank" rel="noreferrer" style="font-size:12px;color:#1a73e8;">Open in Google Maps →</a>
    </div>`
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function NaverMap({ places, selectedId, onSelect }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const infoWindowRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng),
      zoom: 12,
      minZoom: 8,
      maxZoom: 19,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    })

    infoWindowRef.current = new window.naver.maps.InfoWindow({
      content: '<div></div>',
      borderWidth: 0,
      backgroundColor: 'transparent',
      disableAnchor: true,
    })

    mapInstanceRef.current = map

    return () => {
      map.destroy()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = new Map()

    places.forEach((place) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.lat, place.lng),
        map,
        icon: markerIcon(categoryColor(place.category), place.id === selectedId),
        zIndex: place.id === selectedId ? 200 : 100,
      })

      window.naver.maps.Event.addListener(marker, 'click', () => {
        onSelect(place.id)
      })

      markersRef.current.set(place.id, marker)
    })
    // selectedId intentionally omitted: re-run only when the place set changes,
    // marker highlight/InfoWindow for selection is handled in the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places])

  useEffect(() => {
    const map = mapInstanceRef.current
    const infoWindow = infoWindowRef.current
    if (!map || !infoWindow) return

    markersRef.current.forEach((marker, id) => {
      const place = places.find((p) => p.id === id)
      if (!place) return
      marker.setIcon(markerIcon(categoryColor(place.category), id === selectedId))
      marker.setZIndex(id === selectedId ? 200 : 100)
    })

    if (!selectedId) {
      infoWindow.close()
      return
    }

    const marker = markersRef.current.get(selectedId)
    const place = places.find((p) => p.id === selectedId)
    if (!marker || !place) return

    infoWindow.setContent(infoWindowContent(place))
    infoWindow.open(map, marker)
    map.panTo(marker.getPosition())
  }, [selectedId, places])

  return <div ref={mapRef} className="naver-map" style={{ width: '100%', height: '100%' }} />
}
