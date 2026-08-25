import { MockMapView } from './MockMapView'
import { LeafletMapView } from './LeafletMapView'
import { GoogleMapView } from './GoogleMapView'
import { useTileServerReachable } from './useTileServerReachable'
import { useGoogleMapsReady } from './useGoogleMapsReady'

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
  /** Bump this (e.g. on a "recenter" button tap) to re-fit the view to the current markers. */
  recenterSignal?: number
}

export type MapViewComponent = (props: MapViewProps) => React.JSX.Element

/**
 * Swappable map renderer. Tries real Google Maps first (richer Korean
 * POI/business data) when VITE_GOOGLE_MAPS_API_KEY is set; if that fails to
 * load (no key, invalid key, billing/auth issue — see the console for the
 * actual error), falls back to a real OpenStreetMap map via Leaflet, and
 * finally to a CSS/SVG mock if even the OSM tile server is unreachable —
 * so the product never hard-fails on a blank screen.
 */
export function MapView(props: MapViewProps) {
  const googleReady = useGoogleMapsReady()
  const tileReachable = useTileServerReachable()

  if (googleReady === true) return <GoogleMapView {...props} />

  if (googleReady === null) return <MapLoadingPlaceholder />

  // Google Maps failed to load — fall back to the Leaflet/OSM path.
  if (tileReachable === null) return <MapLoadingPlaceholder />
  if (!tileReachable) return <MockMapView {...props} />
  return <LeafletMapView {...props} />
}

function MapLoadingPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-canvas-sunk text-sm font-medium text-ink-faint">
      Loading map…
    </div>
  )
}
