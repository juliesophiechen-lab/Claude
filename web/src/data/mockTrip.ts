import type { Trip } from '../models'

export const trip: Trip = {
  destination: 'Seoul',
  startDate: '2026-10-19',
  endDate: '2026-11-08',
  flights: [
    {
      id: 'out-1',
      from: 'MUC',
      fromCity: 'Munich',
      to: 'ICN',
      toCity: 'Seoul',
      date: '2026-10-19',
      departTime: '13:20',
      arriveTime: '08:10',
      arriveDayOffset: 1,
      airline: 'Lufthansa',
      flightNumber: 'LH 716',
      durationMinutes: 660,
      terminal: 'T2',
    },
    {
      id: 'ret-1',
      from: 'ICN',
      fromCity: 'Seoul',
      to: 'MUC',
      toCity: 'Munich',
      date: '2026-11-08',
      departTime: '20:30',
      arriveTime: '05:15',
      arriveDayOffset: 1,
      airline: 'Lufthansa',
      flightNumber: 'LH 717',
      durationMinutes: 765,
      terminal: '1',
    },
  ],
}
