// Converts data/places.csv into web/src/data/places.json for the app to import.
// Pure local parsing, no network calls. Re-run after editing the CSV.
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, '..', 'data', 'places.csv');
const outPath = path.resolve(__dirname, '..', 'web', 'src', 'data', 'places.json');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = '';
      } else if (c === '\r') {
        // skip
      } else if (c === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += c;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== '');
}

function toRecords(rows) {
  const header = rows[0];
  return rows.slice(1).map((r) => {
    const obj = {};
    header.forEach((h, i) => {
      obj[h] = r[i] ?? '';
    });
    return obj;
  });
}

const csvText = readFileSync(csvPath, 'utf-8');
const records = toRecords(parseCsv(csvText));

const places = records
  .filter((rec) => rec.Name?.trim() && rec.Location?.trim())
  .map((rec) => ({
    id: rec.id?.trim() || rec.Name.trim(),
    name: rec.Name.trim(),
    address: rec.Location.trim(),
    description: rec.Beschreibung?.trim() || '',
    category: rec.Kategorie?.trim() || 'Diverses',
    district: rec.Viertel?.trim() || '',
    googleMapsUrl: rec.Google_Maps_Suche?.trim() || '',
  }));

writeFileSync(outPath, JSON.stringify(places, null, 2));
console.log(`Wrote ${places.length} places to ${outPath}`);
