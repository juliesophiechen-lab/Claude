import type { Participant } from '../models'
import julieAvatar from '../assets/avatars/julie.jpg'
import lucaAvatar from '../assets/avatars/luca.jpg'
import nishaAvatar from '../assets/avatars/nisha.jpg'
import sofiaAvatar from '../assets/avatars/sofia.jpg'
import jojoAvatar from '../assets/avatars/jojo.jpg'

export const participants: Participant[] = [
  { id: 'p5', name: 'Julie', image: julieAvatar, color: '#c1522a', arrivalDate: '2026-10-09', departureDate: '2026-10-19' },
  { id: 'p3', name: 'Luca', image: lucaAvatar, color: '#3f6ea6', arrivalDate: '2026-10-09', departureDate: '2026-10-19' },
  { id: 'p4', name: 'Nisha', image: nishaAvatar, color: '#2f8f89', arrivalDate: '2026-10-09', departureDate: '2026-10-19' },
  { id: 'p1', name: 'Sofia', image: sofiaAvatar, color: '#96628f', arrivalDate: '2026-10-09', departureDate: '2026-10-18' },
  { id: 'p2', name: 'Jojo', image: jojoAvatar, color: '#a3661c', arrivalDate: '2026-10-09', departureDate: '2026-10-18' },
]
