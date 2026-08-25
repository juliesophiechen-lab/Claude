import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import type { MapViewProps } from './MapProvider'

function circleMarkerOptions(color: string, selected: boolean): L.CircleMarkerOptions {
  return {
    radius: selected ? 11 : 7,
    color: '#ffffff',
    weight: 2,
    fillColor: color,
    fillOpacity: 1,
  }
}

export function LeafletMapView({ markers, onSelectMarker, bounds, recenterSignal }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null)
  const leafletMarkersRef = useRef<Map<string, L.CircleMarker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [(bounds.minLat + bounds.maxLat) / 2, (bounds.minLng + bounds.maxLng) / 2],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
      const leafletMarker = L.circleMarker(
        [marker.lat, marker.lng],
        circleMarkerOptions(marker.color, marker.selected),
      )
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
      leafletMarker.setStyle(circleMarkerOptions(marker.color, marker.selected))
      const pos = leafletMarker.getLatLng()
      if (pos.lat !== marker.lat || pos.lng !== marker.lng) {
        leafletMarker.setLatLng([marker.lat, marker.lng])
      }
      if (marker.selected) leafletMarker.bringToFront()
    })
  }, [markers])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
