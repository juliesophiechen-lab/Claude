import { MockMapView } from './MockMapView'
import { LeafletMapView } from './LeafletMapView'
import { useTileServerReachable } from './useTileServerReachable'

export interface MapMarkerData {
  id: string
  lat: number
  lng: number
  color: string
  selected: boolean
}

export interface MapViewProps {
  markers: MapMarkerData[]
  onSelectMarker: (id: string) => void
  /** Bounding box hint so the provider can frame all markers. */
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }
}

export type MapViewComponent = (props: MapViewProps) => React.JSX.Element

/** True once OpenStreetMap's tile server is confirmed reachable (no key/account needed either way). */
export function useMapReady(): boolean {
  return useTileServerReachable() === true
}

/**
 * Swappable map renderer. Uses a real OpenStreetMap tile map via Leaflet —
 * no API key, no billing account, no console setup. Falls back to the mock
 * placeholder map only if the tile server can't be reached (offline, or a
 * restrictive network), so the product never hard-fails on a blank screen.
 */
export function MapView(props: MapViewProps) {
  const reachable = useTileServerReachable()

  if (reachable === null) return <MapLoadingPlaceholder />
  if (!reachable) return <MockMapView {...props} />
  return <LeafletMapView {...props} />
}

function MapLoadingPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-canvas-sunk text-sm font-medium text-ink-faint">
      Loading map…
    </div>
  )
}
