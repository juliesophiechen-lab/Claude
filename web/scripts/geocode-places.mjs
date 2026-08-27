#!/usr/bin/env node
// One-time script: fills in real coordinates for every place in
// src/data/mockPlaces.ts that's currently geocoded: false (a jittered
// neighborhood-center placeholder), using Nominatim (OpenStreetMap's free
// geocoder — no API key needed).
//
// Usage:
//   node scripts/geocode-places.mjs
//
// Nominatim doesn't reliably support being called from a browser (no CORS,
// hard rate-limiting on browser-pattern requests), so this runs from Node,
// paced at ~1 request/second with a proper User-Agent per Nominatim's usage
// policy. Its address coverage for exact Korean building addresses is
// spottier than Google's/Naver's, so some places may still land on the
// neighborhood fallback even after running it — safe to re-run, places
// already geocoded: true are left untouched.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, '../src/data/mockPlaces.ts')
const USER_AGENT = 'seoul-trip-app/1.0 (private trip planner, one-time geocoding pass)'

const AUTO_NOTE_PREFIX = 'Koordinaten sind eine grobe Schätzung'

function loadPlaces() {
  const raw = readFileSync(DATA_PATH, 'utf8')
  const start = raw.indexOf('[')
  const end = raw.lastIndexOf(']')
  const header = raw.slice(0, start)
  const arrayText = raw.slice(start, end + 1)
  const footer = raw.slice(end + 1)
  return { header, footer, places: JSON.parse(arrayText) }
}

function writePlaces(header, places, footer) {
  const body = places
    .map((p) => {
      const lines = Object.entries(p).map(
        ([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`,
      )
      return `  {\n${lines.join(',\n')}\n  }`
    })
    .join(',\n')
  writeFileSync(DATA_PATH, `${header}${body}\n${footer}`)
}

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  const results = await res.json()
  if (!results?.[0]) return null
  return { lat: Number(results[0].lat), lng: Number(results[0].lon) }
}

async function main() {
  const { header, footer, places } = loadPlaces()
  const todo = places.filter((p) => p.geocoded === false)
  console.log(`${todo.length} places need geocoding (out of ${places.length} total).`)

  let updated = 0
  let failed = 0
  for (const place of todo) {
    const query = `${place.name}, ${place.address}`
    try {
      const result = await geocode(query)
      if (result) {
        place.latitude = result.lat
        place.longitude = result.lng
        place.geocoded = true
        if (typeof place.notes === 'string' && place.notes.startsWith(AUTO_NOTE_PREFIX)) {
          delete place.notes
        }
        updated++
        console.log(`✓ ${place.name}`)
      } else {
        failed++
        console.log(`✗ ${place.name} (no match)`)
      }
    } catch (err) {
      failed++
      console.log(`✗ ${place.name} (${err.message})`)
    }
    // Nominatim's usage policy caps at ~1 request/second.
    await new Promise((resolve) => setTimeout(resolve, 1100))
  }

  writePlaces(header, places, footer)
  console.log(`\nDone. Updated ${updated}, failed ${failed}. Re-run to retry failures.`)
}

main()
