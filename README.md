# Seoul Trip Guide

A personal travel companion for the October 2026 Seoul trip: countdown +
flights, who's around when, a day-by-day itinerary, a map of saved places
with their original source videos, and a Korean phrasebook.

**Status:** running on the real trip data (real flights, 5 travelers, the
real day-by-day plan, 309 real saved places). The map is a real
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
desktop. **Places** is the map view; **Gallery** is the same 309 places as a
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

`map/MapProvider.tsx` exports a single `<MapView>` component that tries three
renderers in order, each falling back to the next if it can't be used:

1. **Google Maps** (`GoogleMapView.tsx`) — real Google Maps JS, with the
   richer Korean business/POI data that was the whole reason to revisit this.
   Only attempted if `VITE_GOOGLE_MAPS_API_KEY` is set (see below);
   `useGoogleMapsReady` loads the script once (shared across every mount via
   a module-level promise — an earlier version of this hook had each mounted
   map instance stomp on the others' load callback, so only the last one
   ever found out the script was ready) and times out after 8s if the script
   never calls back at all, so a stuck/blocked load can't hang the map
   forever.
2. **Leaflet + OpenStreetMap** (`LeafletMapView.tsx`) — used if Google Maps
   has no key, fails to load, or errors out (invalid key, billing/auth
   issue — the real error always goes to the browser console). No key, no
   account, ever. Markers cluster (`leaflet.markercluster`) so 309 pins stay
   tappable instead of overlapping; a "recenter" button (`recenterSignal`
   prop) re-fits the view to whatever's currently visible. Reachability is
   checked with `useTileServerReachable`, a quick image-load probe with a
   4s timeout.
3. **Mock map** (`MockMapView.tsx`) — a CSS/SVG placeholder, used only if
   even the OSM tile server is unreachable (offline, restrictive network),
   so the product never hard-fails on a blank screen.

All three implement the same `MapViewComponent` interface (markers in, a
marker-tap callback out), so none of the Places screen/filter/detail-sheet
code cares which one is active.

### Enabling Google Maps

Copy `web/.env.example` to `web/.env.local` and set `VITE_GOOGLE_MAPS_API_KEY`
to a key from `console.cloud.google.com/google/maps-apis` with the "Maps
JavaScript API" **and "Places API"** enabled (the second one powers the
real-place matching below). **Restrict it** (Application restrictions → HTTP
referrers) to your Vercel domain(s) — an unrestricted key can be used by
anyone who reads it out of the JS bundle, which is a real cost/abuse risk
once billing is active on the project. On Vercel, add the same variable
under Project Settings → Environment Variables, then redeploy.

If the key's project is still billing-restricted (the `InvalidKeyMapError` /
`gm_authFailure` this ran into before), the app falls back to the Leaflet map
automatically rather than breaking — check the browser console for the exact
error to see what's actually blocking it.

### Matching places to real Google Maps data

Opening a place's detail sheet (`PlaceDetailSheet.tsx`) tries, live, to match
it to a real place on Google Maps: `lib/googlePlaces.ts` runs a text search
on the name + address, then fetches details for the top match — rating,
review count, a real photo, opening hours, phone, website, and a genuine
`google.com/maps/place/...` link (all shown in place of/alongside the
curated notes). Many of the 309 saved places are deliberately vague
(neighborhood names, generic activities like "Karaoke", placeholder entries
like repeated "beauty spa" rows with no confirmed business) — those won't
match anything, and the sheet just falls back to the original curated
content, same as always. No offline batching or extra data files: the
lookup happens on demand each time a place is opened, using the same key/
billing as the map itself.

### Geocoding

184 of the 309 real places have confirmed real coordinates (`geocoded:
true`); the other 125 came from a pasted Google Maps list with no address
attached, so they sit on a jittered neighborhood-center fallback
(`geocoded: false` on the `Place`) until geocoded. CSV imports and manually
added places never come with coordinates either, so they start the same
way.

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
  phone) so likes/itinerary edits/uploads can be attributed. Right after
  that, a one-time `InterestsPage` lets them pick a few favorite categories
  (`state/usePreferences.ts`) — stored in `localStorage` so the gate never
  blocks on a network round-trip, and mirrored to Firestore best-effort.
  Chosen categories are surfaced first in the category chip row on Places
  and Gallery; skippable, and never asked again on that device either way.
- **Likes** (`state/useLikes.ts`): a `likes` doc per (place, person) plus a
  `likeCounts/{placeId}.count` maintained via an atomic transaction — so
  "X people like this" and the Gallery's "Most liked" sort read a live,
  already-aggregated number instead of counting 309 places' worth of docs
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
    match /participantPreferences/{id} { allow read, write: if true; }
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
