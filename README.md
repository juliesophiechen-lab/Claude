# Seoul Trip Guide

A personal travel companion for a Seoul trip: countdown + flights, who's
around when, a day-by-day itinerary, a map of saved places with their
original source videos, and a Korean phrasebook.

**Status: Phase 1 — clickable mockup.** Everything runs on mock data and
local/localStorage state. No backend, auth, or live Naver Maps integration
yet — see [Naver Maps / MCP integration](#naver-maps--mcp-integration-phase-2)
below for what Phase 2 needs.

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
data/places.csv          Real saved-places export (Google My Maps), used by
                          the Places tab's "Try with sample file" CSV import
                          demo — not the Phase 1 seed data itself.
web/src/
  models.ts               Trip, Participant, Place, ItineraryItem, DictionaryPhrase types
  data/mock*.ts            Mock trip, participants, ~24 hand-placed places, itinerary, phrases
  state/AppStateContext.tsx  Itinerary items + place favorite/visited/imported state (localStorage)
  state/ToastContext.tsx    Lightweight confirmation toasts
  map/                     Swappable map abstraction (see below)
  layout/                  AppShell, BottomNav, icons
  components/{home,people,itinerary,places,korean,common}/
  pages/                   One page per bottom-nav tab
  lib/                     Date/trip/category/CSV helper functions
```

## Map abstraction

`map/MapProvider.tsx` defines a `MapViewComponent` interface (markers + bounds
in, marker-tap callback out). Phase 1 always resolves to `MockMapView.tsx`, a
CSS/SVG placeholder map (no tiles, no key, no network) so the product never
depends on a live Naver Maps key while designing the UX. A real
`NaverMapView` implementing the same interface can be swapped in later
without touching any Places screen code.

## CSV import

The Places tab's upload button (`components/places/CsvImportSheet.tsx`) is
genuinely functional, not just a mocked animation: it parses a real CSV
client-side (`lib/csv.ts`), previews the matched rows, and imports them into
app state on confirm. Try it with your own file or the bundled
`data/places.csv` sample (150 real saved places) via "Try with sample file".
Imported places get **placeholder coordinates** (no geocoding happens client
side yet) — see below for what real geocoding needs.

## Naver Maps / MCP integration (Phase 2)

To swap `MockMapView` for a real Naver Map:

1. **NCP account + credentials.** Register at [console.ncloud.com](https://console.ncloud.com)
   under **Application Services > Maps** (not "AI·NAVER API") → **Register
   Application** → **Web Dynamic Map**. Also enable **Geocoding** on the same
   application if imported/CSV places need addresses turned into
   coordinates. Register the web service host (no port) under **Web Service
   URL**. Copy the **Client ID** (`ncpKeyId`).
2. **Loading the SDK.** Inject
   `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=...&submodules=geocoder`
   at runtime (only when a key is configured, so the app degrades to the mock
   map otherwise) — see the note in `web/index.html`.
3. **A `NaverMapView` implementing `MapViewComponent`.** Same props as
   `MockMapView`: markers (id/lat/lng/color/selected) and bounds in, a
   `onSelectMarker(id)` callback out. Internally: `new naver.maps.Map(...)`,
   one `naver.maps.Marker` per place (colored via custom HTML icon content,
   matching `lib/categories.ts`), `naver.maps.Event.addListener(marker,
   'click', ...)` wired to `onSelectMarker`. `map/MapProvider.tsx`'s
   `resolveMapView()` picks this over the mock when `VITE_NAVER_MAP_CLIENT_ID`
   is set.
4. **Geocoding CSV/imported places.** `lib/csv.ts`'s `recordsToPlaces` and
   `mockCoordinate` are exactly where this plugs in: replace the placeholder
   coordinate with a real `naver.maps.Service.geocode({ query: address },
   callback)` call (needs the `geocoder` submodule from step 2), likely
   batched with a small delay between requests. This runs in the *user's*
   browser at import time, not at build time, so it needs no server.
5. **What stays inside the app either way:** all filtering (category/
   neighborhood/status/search), the results carousel, the place detail sheet,
   source-video display, favorite/visited/planned state, and the
   add-to-itinerary flow are all UI/state concerns independent of the map
   provider — none of that needs to change.

No other Phase 2 item (persistence, CSV production-hardening, auth) touches
the map abstraction.
