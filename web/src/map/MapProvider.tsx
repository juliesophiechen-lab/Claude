import { MockMapView } from './MockMapView'
import { GoogleMapView } from './GoogleMapView'
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
}

export type MapViewComponent = (props: MapViewProps) => React.JSX.Element

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

/**
 * Swappable map renderer. Falls back to the mock placeholder map whenever no
 * `VITE_GOOGLE_MAPS_API_KEY` is configured (or while the SDK is still
 * loading), so the product never hard-depends on a live Maps key. Set the key
 * in `.local/.env` to switch to the real Google Map — see the root README.
 */
export function MapView(props: MapViewProps) {
  const ready = useGoogleMapsReady(GOOGLE_MAPS_API_KEY)

  if (!GOOGLE_MAPS_API_KEY) return <MockMapView {...props} />
  if (!ready) return <MapLoadingPlaceholder />
  return <GoogleMapView {...props} />
}

function MapLoadingPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-canvas-sunk text-sm font-medium text-ink-faint">
      Loading map…
    </div>
  )
}
