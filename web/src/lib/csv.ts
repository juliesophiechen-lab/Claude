import type { Place } from '../models'

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let clean = text
  if (clean.charCodeAt(0) === 0xfeff) clean = clean.slice(1)

  for (let i = 0; i < clean.length; i++) {
    const c = clean[i]
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\r') {
      // skip
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.length > 1 || r[0] !== '')
}

export function csvToRecords(rows: string[][]): Record<string, string>[] {
  const header = rows[0] ?? []
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {}
    header.forEach((h, i) => {
      obj[h.trim()] = (r[i] ?? '').trim()
    })
    return obj
  })
}

// Our known Google-My-Maps-export shape, mapped onto the new richer Place
// model. Any CSV with these headers (Name/Location/Kategorie/...) works;
// other shapes still preview but skip cleanly.
const CATEGORY_MAP: Record<string, string> = {
  Food: 'Restaurant',
  Shopping: 'Shopping',
  Sightseeing: 'Sightseeing',
  Treatments: 'Beauty Treatments',
  Diverses: 'Activity',
}

const SEOUL_BOUNDS = { minLat: 37.49, maxLat: 37.595, minLng: 126.915, maxLng: 127.065 }

function hashToUnit(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 100000
  }
  return h / 100000
}

/** Deterministic placeholder coordinate until real geocoding is wired up. */
function mockCoordinate(seed: string) {
  const ux = hashToUnit(seed)
  const uy = hashToUnit(seed + '-y')
  return {
    latitude: SEOUL_BOUNDS.minLat + uy * (SEOUL_BOUNDS.maxLat - SEOUL_BOUNDS.minLat),
    longitude: SEOUL_BOUNDS.minLng + ux * (SEOUL_BOUNDS.maxLng - SEOUL_BOUNDS.minLng),
  }
}

export interface ImportPreviewRow {
  name: string
  category: string
  neighborhood: string
  address: string
}

export function previewRecords(records: Record<string, string>[]): ImportPreviewRow[] {
  return records
    .filter((r) => r.Name)
    .map((r) => ({
      name: r.Name,
      category: CATEGORY_MAP[r.Kategorie] ?? 'Activity',
      neighborhood: r.Viertel || 'Seoul',
      address: r.Location || '',
    }))
}

export function recordsToPlaces(records: Record<string, string>[]): Place[] {
  return records
    .filter((r) => r.Name)
    .map((r, i) => {
      const seed = r.id || `${r.Name}-${i}`
      const { latitude, longitude } = mockCoordinate(seed)
      return {
        id: `csv-${seed}`,
        name: r.Name,
        category: CATEGORY_MAP[r.Kategorie] ?? 'Activity',
        address: r.Location || '',
        latitude,
        longitude,
        neighborhood: r.Viertel || 'Seoul',
        description: r.Beschreibung || '',
        sourceType: 'Recommendation',
        favorite: false,
        visited: false,
        planned: false,
        priority: 3,
        geocoded: false,
      } satisfies Place
    })
}
