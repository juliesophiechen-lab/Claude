# Seoul Trip Guide

A personal travel companion for the October 2026 Seoul trip: countdown +
flights, who's around when, a day-by-day itinerary, a map of saved places
with their original source videos, and a Korean phrasebook.

**Status:** running on the real trip data (real flights, 5 travelers, the
real day-by-day plan, 165 real saved places). The map is a real
**OpenStreetMap** map via Leaflet — no API key, no billing account, no
console setup, ever. Just `npm install && npm run dev` and it works.

Favorites/visited status stay local to each phone, but **likes, the
itinerary, and uploaded screenshots are shared live across all 5 travelers**
via a small Firebase backend (see below) — no login required, just picking
your name once.

## Running it

```bash
cd web
npm install
npm run dev
```

Open the printed local URL on your phone or in a narrow browser window — the
app is mobile-first (bottom tab bar: Home, People, Itinerary, Places,
Gallery, Korean). It also renders as a centered phone-width column on
desktop. **Places** is the map view; **Gallery** is the same 165 places as a
text-forward, browsable list (thumbnail + name + a mini description snippet,
search + category filters included) — tap a row for the same detail sheet
the map uses (description, source video, Naver/Google Maps links, actions).

A round **+** button, anchored above the bottom tab bar on every screen, opens
**Ort hinzufügen** ("Add place") — a 3-tab panel to contribute a new place by
screenshot, by pasting any link (Instagram/TikTok/website), or by pasting a
Google Maps link (coordinates are read directly out of the URL — no API key).
New places show up for everyone in the Gallery/map right away.

## Project structure

```
data/places.csv          Older saved-places export (Google My Maps), used by
                          the Places tab's "Try with sample file" CSV import
                          demo — not the seed data itself.
web/src/
  models.ts               Trip, Participant, Place, ItineraryItem, DictionaryPhrase types
  data/mock*.ts            Real trip, participants, places, itinerary, phrases
  lib/firebase.ts          Firebase app/Firestore init (shared backend, see below)
  lib/image.ts             Client-side image resize/compress for screenshot uploads
  state/AppStateContext.tsx  Places (local) + itinerary items (shared via Firestore)
  state/IdentityContext.tsx  "Who are you" picker, so shared actions can be attributed
  state/useLikes.ts        Shared like counts + "did I like this" (Firestore)
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

## Shared backend (Firebase)

`lib/firebase.ts` holds the Firebase project config (public by design —
Firebase's client config isn't a secret; access control is entirely in the
Firestore rules, not in hiding these values). Everything runs on **Firestore
only** — no Firebase Storage, since that now requires the paid Blaze plan
even for near-zero usage. It backs three shared features:

- **Identity** (`state/IdentityContext.tsx`): on first load, everyone picks
  their name from the 5 travelers (stored in `localStorage`, one popup per
  phone) so likes/itinerary edits/uploads can be attributed.
- **Likes** (`state/useLikes.ts`): a `likes` doc per (place, person) plus a
  `likeCounts/{placeId}.count` maintained via an atomic transaction — so
  "X people like this" and the Gallery's "Most liked" sort read a live,
  already-aggregated number instead of counting 165 places' worth of docs
  client-side.
- **Itinerary** (`state/AppStateContext.tsx`): `itineraryItems` is a
  Firestore collection (one-time seeded from `data/mockItinerary.ts`), synced
  live via `onSnapshot` — anyone can add, tap-to-edit, or delete an item, and
  it shows "Vorgeschlagen von <name>" for who added it.
- **Add place** (`components/places/AddPlaceSheet.tsx`, opened from the
  floating **+** button): three ways to contribute a place, all writing to
  the shared `suggestedPlaces` collection. **Screenshot** uses
  `lib/image.ts` to resize/compress the picked image client-side (canvas,
  down to ~900px wide JPEG, backing off quality/size until it fits) into a
  data URL small enough to store directly as a Firestore field, with the
  screenshot itself as the thumbnail. **Link** just stores whatever URL was
  pasted (Instagram/TikTok/website) as the place's source. **Google Maps**
  (`lib/googleMapsLink.ts`) reads coordinates and a name straight out of a
  pasted Google Maps URL (`@lat,lng` and `/place/<name>/`) — no API key,
  since that's just string parsing. Short `maps.app.goo.gl` links can't be
  resolved client-side (no readable redirect), so those fall back to no
  coordinates. Places without real coordinates sit at the Seoul-center
  fallback (same `geocoded: false` treatment as any other unlocated place).

**Firestore rules:** the console's default "test mode" rules expire after 30
days and everything shared here would silently stop working. In the Firebase
console, under **Firestore Database → Rules**, replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /itineraryItems/{id} { allow read, write: if true; }
    match /likes/{id} { allow read, write: if true; }
    match /likeCounts/{id} { allow read, write: if true; }
    match /suggestedPlaces/{id} { allow read, write: if true; }
    match /meta/{id} { allow read, write: if true; }
  }
}
```

This doesn't expire, and (since there's no login system) anyone with the app's
URL can read/write this data — fine for a private trip link shared with 5
people, but worth knowing.

## CSV import

The Places tab's upload button (`components/places/CsvImportSheet.tsx`) is
genuinely functional, not just a mocked animation: it parses a real CSV
client-side (`lib/csv.ts`), previews the matched rows, and imports them into
app state on confirm. Try it with your own file or the bundled
`data/places.csv` sample via "Try with sample file".
