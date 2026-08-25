# Seoul Trip Guide

A personal travel companion for the October 2026 Seoul trip: countdown +
flights, who's around when, a day-by-day itinerary, a map of saved places
with their original source videos, and a Korean phrasebook.

**Status:** running on the real trip data (real flights, 5 travelers, the
real day-by-day plan, 165 real saved places). State is local/localStorage —
no backend or auth yet. The map has a real **Google Maps** provider that
activates once you add an API key (falls back to a mock placeholder map
otherwise) — see [Google Maps setup](#google-maps-setup) below.

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
renderer at runtime:

- **No `VITE_GOOGLE_MAPS_API_KEY` configured** → `MockMapView.tsx`, a CSS/SVG
  placeholder map (no tiles, no key, no network) — the product never
  hard-depends on a live Maps key.
- **Key configured, SDK still loading** → a small "Loading map…" placeholder.
- **Key configured and ready** → `GoogleMapView.tsx`, a real Google Map.

Both real and mock renderers implement the same `MapViewComponent` interface
(markers in, a marker-tap callback out), so none of the Places screen/filter/
detail-sheet code cares which one is active.

## Google Maps setup

1. In the [Google Cloud Console](https://console.cloud.google.com), create a
   project (or reuse one) and enable the **Maps JavaScript API** under
   *APIs & Services*.
2. Create an API key under *APIs & Services > Credentials*. For local dev
   you can leave it unrestricted; once you know your deployed domain, restrict
   the key to that **HTTP referrer**.
3. `cp .local/.env.example .local/.env` and set
   `VITE_GOOGLE_MAPS_API_KEY=your_key`. This file is gitignored — never
   commit a real key.
4. Restart `npm run dev`. `map/useGoogleMapsReady.ts` injects the SDK script
   itself once the key is present; `map/GoogleMapView.tsx` then renders
   markers colored by category (`lib/categories.ts`) and calls `fitBounds` so
   all visible places frame themselves automatically.

### Geocoding (not wired up yet)

~70 of the 165 real places didn't come with coordinates in the source export
(see the `priority: 3` entries in `data/mockPlaces.ts`) and currently sit at a
jittered neighborhood-center fallback. The CSV import flow
(`lib/csv.ts`'s `recordsToPlaces`) has the same limitation for freshly
imported rows. Both are exactly where a real geocoder plugs in: once the Maps
JS API is loaded, `new google.maps.Geocoder().geocode({ address }, callback)`
runs client-side in the *user's* browser (no server needed) and can replace
the placeholder coordinate — likely batched with a small delay between
requests to stay within Google's rate limits.

## CSV import

The Places tab's upload button (`components/places/CsvImportSheet.tsx`) is
genuinely functional, not just a mocked animation: it parses a real CSV
client-side (`lib/csv.ts`), previews the matched rows, and imports them into
app state on confirm. Try it with your own file or the bundled
`data/places.csv` sample via "Try with sample file".
