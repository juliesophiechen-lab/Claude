# Seoul Trip Guide

A personal travel companion for the October 2026 Seoul trip: countdown +
flights, who's around when, a day-by-day itinerary, a map of saved places
with their original source videos, and a Korean phrasebook.

**Status:** running on the real trip data (real flights, 5 travelers, the
real day-by-day plan, 165 real saved places). State is local/localStorage —
no backend or auth yet. The map is a real **OpenStreetMap** map via Leaflet —
no API key, no billing account, no console setup, ever. Just `npm install &&
npm run dev` and it works.

## Running it

```bash
cd web
npm install
npm run dev
```

Open the printed local URL on your phone or in a narrow browser window — the
app is mobile-first (bottom tab bar: Home, People, Itinerary, Places,
Korean). It also renders as a centered phone-width column on desktop.

## Project structure

```
data/places.csv          Older saved-places export (Google My Maps), used by
                          the Places tab's "Try with sample file" CSV import
                          demo — not the seed data itself.
web/src/
  models.ts               Trip, Participant, Place, ItineraryItem, DictionaryPhrase types
  data/mock*.ts            Real trip, participants, places, itinerary, phrases
  state/AppStateContext.tsx  Itinerary items + place favorite/visited/imported state (localStorage)
  state/ToastContext.tsx    Lightweight confirmation toasts
  map/                     Swappable map abstraction (see below)
  layout/                  AppShell, BottomNav, icons
  components/{home,people,itinerary,places,korean,common}/
  pages/                   One page per bottom-nav tab
  lib/                     Date/trip/category/CSV helper functions
```

## Map abstraction

`map/MapProvider.tsx` exports a single `<MapView>` component that picks the
renderer at runtime based on whether OpenStreetMap's tile server responds
(`useTileServerReachable`, a quick image-load probe with a 4s timeout):

- **Checking** → a small "Loading map…" placeholder.
- **Reachable** → `LeafletMapView.tsx`, a real OpenStreetMap map (Leaflet +
  the free public OSM tile server — no key, no account, ever). Markers cluster
  (`leaflet.markercluster`) so 165 pins stay tappable instead of overlapping;
  a "recenter" button (`recenterSignal` prop) re-fits the view to whatever's
  currently visible.
- **Not reachable** (offline, or a restrictive network) → `MockMapView.tsx`,
  a CSS/SVG placeholder map, so the product never hard-fails on a blank
  screen.

Both real and mock renderers implement the same `MapViewComponent` interface
(markers in, a marker-tap callback out), so none of the Places screen/filter/
detail-sheet code cares which one is active.

### Geocoding

~70 of the 165 real places didn't come with coordinates in the source export
and CSV imports never do either — both start with a jittered
neighborhood-center fallback (`geocoded: false` on the `Place`).

Geocoding those runs as a **one-time script, not live in the browser**:

```bash
node scripts/geocode-places.mjs
```

It geocodes every non-`geocoded` place via **Nominatim** (OpenStreetMap's
free geocoder — no key needed), paced at ~1 request/second per Nominatim's
usage policy with a proper `User-Agent` header, and writes the real
coordinates straight into `web/src/data/mockPlaces.ts` — commit that file
afterward. (Nominatim doesn't reliably support being called directly from a
browser — no CORS headers, and it rate-limits browser-pattern requests hard
— so this has to run from Node, not `useEffect`.) Its address coverage for
exact Korean building addresses is spottier than Google's/Naver's, so some
places may still land on the neighborhood fallback even after running it.

## CSV import

The Places tab's upload button (`components/places/CsvImportSheet.tsx`) is
genuinely functional, not just a mocked animation: it parses a real CSV
client-side (`lib/csv.ts`), previews the matched rows, and imports them into
app state on confirm. Try it with your own file or the bundled
`data/places.csv` sample via "Try with sample file".
