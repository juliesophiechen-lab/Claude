import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type { MapViewProps } from './MapProvider'

function emojiDivIcon(emoji: string, color: string, selected: boolean): L.DivIcon {
  const size = selected ? 34 : 26
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.55)}px;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,0.35);">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function LeafletMapView({ markers, onSelectMarker, bounds, recenterSignal }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null)
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [(bounds.minLat + bounds.maxLat) / 2, (bounds.minLng + bounds.maxLng) / 2],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    })

    // Pastel basemap (CARTO Positron) instead of OSM's default saturated
    // tiles, to match the app's soft/editorial map styling.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map)

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 44,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    })
    map.addLayer(clusterGroup)
    clusterGroupRef.current = clusterGroup

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
      clusterGroupRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    const clusterGroup = clusterGroupRef.current
    if (!map || !clusterGroup) return

    clusterGroup.clearLayers()
    leafletMarkersRef.current = new Map()

    const points: L.LatLngExpression[] = []

    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: emojiDivIcon(marker.emoji, marker.color, marker.selected),
      })
      leafletMarker.on('click', () => onSelectMarker(marker.id))
      clusterGroup.addLayer(leafletMarker)
      leafletMarkersRef.current.set(marker.id, leafletMarker)
      points.push([marker.lat, marker.lng])
    })

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [48, 48] })
    }
    // Re-run when the marker set changes or the user taps "recenter"; per-marker
    // selection styling is handled in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers.map((m) => m.id).join(','), recenterSignal])

  useEffect(() => {
    markers.forEach((marker) => {
      const leafletMarker = leafletMarkersRef.current.get(marker.id)
      if (!leafletMarker) return
      leafletMarker.setIcon(emojiDivIcon(marker.emoji, marker.color, marker.selected))
      const pos = leafletMarker.getLatLng()
      if (pos.lat !== marker.lat || pos.lng !== marker.lng) {
        leafletMarker.setLatLng([marker.lat, marker.lng])
      }
      if (marker.selected) leafletMarker.setZIndexOffset(1000)
      else leafletMarker.setZIndexOffset(0)
    })
  }, [markers])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
