// One-time data-prep script: geocodes every place in mockPlaces.ts that
// doesn't already have a real (geocoded: true) position, using Nominatim
// (OpenStreetMap's free geocoder). Run this from your own machine, not in a
// browser — Nominatim doesn't reliably support direct browser calls (no CORS
// headers, aggressive rate limiting on browser-pattern requests), but a
// Node script with a proper User-Agent and paced requests is exactly the
// sanctioned way to use it.
//
// Usage: node scripts/geocode-places.mjs
// Then commit the updated web/src/data/mockPlaces.ts.
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, '..', 'web', 'src', 'data', 'mockPlaces.ts');
const REQUEST_DELAY_MS = 1100;
const USER_AGENT = 'seoul-trip-guide-personal-app/1.0 (one-time geocode script)';

function extractArray(source) {
  const marker = 'Place[] = ';
  const markerPos = source.indexOf(marker);
  if (markerPos === -1) throw new Error('Could not find "Place[] = " marker in mockPlaces.ts');
  const start = source.indexOf('[', markerPos + marker.length);
  const end = source.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('Could not find array literal in mockPlaces.ts');
  return {
    before: source.slice(0, start),
    array: JSON.parse(source.slice(start, end + 1)),
    after: source.slice(end + 1),
  };
}

async function geocodeOne(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const results = await res.json();
  if (!Array.isArray(results) || results.length === 0) return null;
  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const source = readFileSync(FILE, 'utf-8');
  const { before, array: places, after } = extractArray(source);

  const todo = places.filter((p) => !p.geocoded);
  console.log(`${places.length} places total, ${todo.length} need geocoding.\n`);

  let geocoded = 0;
  let failed = [];

  for (const place of todo) {
    try {
      const result = await geocodeOne(place.address);
      if (result) {
        place.latitude = Number(result.lat.toFixed(5));
        place.longitude = Number(result.lng.toFixed(5));
        place.geocoded = true;
        geocoded++;
        console.log(`  ok    ${place.name}`);
      } else {
        failed.push(place.name);
        console.log(`  none  ${place.name}`);
      }
    } catch (err) {
      failed.push(place.name);
      console.log(`  error ${place.name}: ${err.message}`);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  writeFileSync(FILE, before + JSON.stringify(places, null, 2) + after);

  console.log(`\nDone. Geocoded ${geocoded}/${todo.length}.`);
  if (failed.length > 0) {
    console.log(`Still on the neighborhood fallback (${failed.length}):`);
    for (const name of failed) console.log(`  - ${name}`);
  }
  console.log('\nNow commit the updated web/src/data/mockPlaces.ts.');
}

main();
