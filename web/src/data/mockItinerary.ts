import type { ItineraryItem } from '../models'

export const itineraryItems: ItineraryItem[] = [
  // Oct 8 — outbound flights
  { id: 'plf1', date: '2026-10-08', time: '10:00', title: 'Abflug Luca, Nisha & Julie · MUC → Doha (QR 060)', type: 'flight', status: 'confirmed' },
  { id: 'plf2', date: '2026-10-08', time: '15:55', title: 'Abflug Sofia & Jojo · MUC → ICN (LH 718)', type: 'flight', status: 'confirmed' },

  // Oct 9 — arrivals
  { id: 'plf3', date: '2026-10-09', time: '09:55', title: 'Ankunft Sofia & Jojo · ICN (LH 718)', type: 'flight', status: 'confirmed' },
  { id: 'plf4', date: '2026-10-09', time: '10:30', title: 'Ankunft Luca, Nisha & Julie · ICN Terminal 1 (QR 862)', type: 'flight', status: 'confirmed' },
  { id: 'pl202610090', date: '2026-10-09', title: 'Ankunft 11:30 >> airbnb', type: 'transport', status: 'confirmed' },
  { id: 'pl202610091', date: '2026-10-09', title: 'Wie kommen wir vom Flughafen zur airbnb?', type: 'open', status: 'open' },
  { id: 'pl202610092', date: '2026-10-09', title: 'Ankommen & chillen', type: 'activity', status: 'confirmed' },
  { id: 'pl202610093', date: '2026-10-09', title: 'Hop-on Hop-off bus tour', type: 'activity', status: 'confirmed' },
  { id: 'pl202610094', date: '2026-10-09', title: 'Anbieter?', type: 'open', status: 'open' },
  {
    id: 'plf7',
    date: '2026-10-09',
    title: 'Achtung: in eurer Timetable steht Ankunft 11:30, laut Buchungen ist es 09:55 und 10:30',
    type: 'open',
    status: 'open',
  },

  // Oct 10
  { id: 'pl202610100', date: '2026-10-10', time: '10:00', title: 'Consultation Skin clinic Sminskin (Gangnam)', type: 'activity', status: 'confirmed' },
  { id: 'pl202610101', date: '2026-10-10', title: 'Starfield Library', type: 'activity', status: 'confirmed', placeId: 'xl03' },

  // Oct 11
  { id: 'pl202610110', date: '2026-10-11', title: 'Tempel in Jongno', type: 'activity', status: 'confirmed' },
  { id: 'pl202610111', date: '2026-10-11', title: 'Bukchon hanok village', type: 'activity', status: 'confirmed', placeId: 'bukc' },

  // Oct 12
  { id: 'pl202610120', date: '2026-10-12', title: 'Shopping Myeongdong', type: 'activity', status: 'confirmed' },

  // Oct 13
  { id: 'pl202610130', date: '2026-10-13', title: '1/2 day Wanderung?', type: 'idea', status: 'confirmed' },
  { id: 'pl202610131', date: '2026-10-13', title: 'Empfehlungen suchen', type: 'open', status: 'open' },

  // Oct 15
  { id: 'pl202610150', date: '2026-10-15', title: 'Day Trip Nordkorea?', type: 'idea', status: 'confirmed' },
  { id: 'pl202610151', date: '2026-10-15', title: 'Anbieter?', type: 'open', status: 'open' },

  // Oct 18 — Sofia & Jojo depart
  {
    id: 'plf5',
    date: '2026-10-18',
    title: 'Sofia & Jojo reisen ab. Rückflug startet in Shanghai, die Strecke Seoul nach Shanghai fehlt noch',
    type: 'flight',
    status: 'open',
  },

  // Oct 19 — Luca & Nisha depart, Julie's return still open
  { id: 'pl202610190', date: '2026-10-19', time: '11:40', title: 'Abflug', type: 'flight', status: 'confirmed' },
  { id: 'plf6', date: '2026-10-19', time: '11:40', title: 'Abflug Luca & Nisha · ICN → MUC (LH 719)', type: 'flight', status: 'confirmed' },
  {
    id: 'it-julie-return',
    date: '2026-10-19',
    title: 'Your return flight — not booked yet',
    type: 'flight',
    status: 'open',
  },
]
