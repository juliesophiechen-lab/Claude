import type { MapViewProps } from './MapProvider'

const PADDING = 0.12 // fraction of width/height kept clear at the edges

function project(lat: number, lng: number, bounds: MapViewProps['bounds']) {
  const { minLat, maxLat, minLng, maxLng } = bounds
  const latSpan = maxLat - minLat || 1
  const lngSpan = maxLng - minLng || 1
  const xRaw = (lng - minLng) / lngSpan
  const yRaw = (maxLat - lat) / latSpan
  const x = PADDING * 100 + xRaw * (1 - PADDING * 2) * 100
  const y = PADDING * 100 + yRaw * (1 - PADDING * 2) * 100
  return { x, y }
}

export function MockMapView({ markers, onSelectMarker, bounds }: MapViewProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eae6dd]">
      {/* stylized backdrop: faint city block grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 34px, rgba(18,18,20,0.05) 34px, rgba(18,18,20,0.05) 35px), repeating-linear-gradient(90deg, transparent, transparent 34px, rgba(18,18,20,0.05) 34px, rgba(18,18,20,0.05) 35px)',
        }}
      />

      {/* Han river, stylized */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M-5 66 C 20 60, 35 72, 55 64 S 90 58, 105 66"
          stroke="#a9c3ce"
          strokeWidth="7"
          fill="none"
          opacity={0.55}
        />
      </svg>

      {markers.map((m) => {
        const { x, y } = project(m.lat, m.lng, bounds)
        return (
          <button
            key={m.id}
            onClick={() => onSelectMarker(m.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform"
            style={{ left: `${x}%`, top: `${y}%`, zIndex: m.selected ? 20 : 10 }}
            aria-label="place marker"
          >
            {m.selected && (
              <span
                className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full opacity-40"
                style={{ width: 34, height: 34, background: m.color }}
              />
            )}
            <span
              className="block rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.35)] transition-all"
              style={{
                width: m.selected ? 22 : 14,
                height: m.selected ? 22 : 14,
                background: m.color,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
