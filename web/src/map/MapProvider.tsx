import { MockMapView } from './MockMapView'

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

/**
 * Swappable map renderer. Phase 1 always resolves to the mock placeholder map
 * so the product never depends on a live Naver Maps key. A real
 * `NaverMapView` implementing the same `MapViewComponent` signature can be
 * dropped in later (see map/README.md) without touching any Places UI code.
 */
export function resolveMapView(): MapViewComponent {
  return MockMapView
}
