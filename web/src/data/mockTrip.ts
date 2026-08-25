import type { Trip } from '../models'

function toMinutes(dur: string): number {
  const h = /(\d+)\s*h/.exec(dur)?.[1]
  const m = /(\d+)\s*min/.exec(dur)?.[1]
  return (h ? parseInt(h, 10) * 60 : 0) + (m ? parseInt(m, 10) : 0)
}

// Julie's own flights (the app's primary user). Other travelers' flights show
// up as itinerary items instead — see mockItinerary.ts.
export const trip: Trip = {
  destination: 'Seoul',
  startDate: '2026-10-08',
  endDate: '2026-10-20',
  flights: [
    {
      id: 'b1',
      from: 'MUC',
      fromCity: 'Munich',
      to: 'DOH',
      toCity: 'Doha',
      date: '2026-10-08',
      departTime: '10:00',
      arriveTime: '16:35',
      arriveDayOffset: 0,
      airline: 'Qatar Airways',
      flightNumber: 'QR 060',
      durationMinutes: toMinutes('5 h 35 min'),
    },
    {
      id: 'b2',
      from: 'DOH',
      fromCity: 'Doha',
      to: 'ICN',
      toCity: 'Seoul',
      date: '2026-10-08',
      departTime: '19:45',
      arriveTime: '10:30',
      arriveDayOffset: 1,
      airline: 'Qatar Airways',
      flightNumber: 'QR 862',
      durationMinutes: toMinutes('8 h 45 min'),
      terminal: '1',
    },
  ],
  pendingFlight: {
    date: '2026-10-19',
    from: 'ICN',
    note: "Your return flight isn't booked yet.",
  },
}
