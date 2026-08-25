# Seoul Places Map

A map of saved Seoul places (from the Google My Maps export CSV) displayed on
a Naver Map, with a filterable sidebar list.

## Project structure

- `data/places.csv` — source data, exported from Google My Maps.
- `scripts/csv-to-json.mjs` — converts the CSV into `web/src/data/places.json`
  (pure local parsing, no network calls). Re-run this after editing the CSV.
- `web/` — the Vite + React + TypeScript app.

## Setup

### 1. Get a Naver Maps (NCP) Client ID

1. Go to the [NCP Console](https://console.ncloud.com).
2. **Console > Services > Application Services > Maps** (not "AI·NAVER API"!).
3. Apply for use, then **Register Application** > select **Web Dynamic Map**.
   Also enable **Geocoding** on the same application — the app geocodes
   addresses client-side using the Maps SDK's geocoder submodule, which needs
   this product enabled too.
4. Under **Web Service URL**, register the host only, without a port, e.g.
   `http://localhost` for local dev.
5. Copy the **Client ID** (`ncpKeyId`) from the application's credentials.

### 2. Configure the app

```bash
cp .local/.env.example .local/.env
```

Edit `.local/.env` and set:

```
VITE_NAVER_MAP_CLIENT_ID=your_ncp_key_id_here
```

This file is gitignored — never commit your real key.

### 3. Install and run

```bash
cd web
npm install
npm run dev
```

Open the printed local URL. On first load the app geocodes all ~150
addresses one by one via the Naver Maps geocoder (a couple of seconds);
results are cached in the browser's localStorage so later loads are instant.

## Updating the place list

Edit `data/places.csv`, then regenerate the JSON the app reads:

```bash
node scripts/csv-to-json.mjs
```

## Notes

- Categories (`Kategorie` column) are color-coded on the map and in the
  sidebar filter chips: Food, Shopping, Sightseeing, Treatments, Diverses.
- Any address that fails to geocode is listed under "could not be located"
  in the sidebar instead of silently disappearing.
