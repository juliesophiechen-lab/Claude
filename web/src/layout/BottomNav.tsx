import { NavLink } from 'react-router-dom'
import { GalleryIcon, HomeIcon, ItineraryIcon, KoreanIcon, PeopleIcon, PlacesIcon } from './icons'

type Tab = {
  to: string
  label: string
  Icon: typeof HomeIcon
  end: boolean
  emphasize: boolean
}

const TABS: Tab[] = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true, emphasize: false },
  { to: '/people', label: 'People', Icon: PeopleIcon, end: false, emphasize: false },
  { to: '/itinerary', label: 'Itinerary', Icon: ItineraryIcon, end: false, emphasize: false },
  { to: '/places', label: 'Places', Icon: PlacesIcon, end: false, emphasize: true },
  { to: '/gallery', label: 'Gallery', Icon: GalleryIcon, end: false, emphasize: false },
  { to: '/korean', label: 'Korean', Icon: KoreanIcon, end: false, emphasize: false },
]

export function BottomNav() {
  return (
    <nav className="z-40 shrink-0 border-t border-line bg-canvas/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {TABS.map(({ to, label, Icon, end, emphasize }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-ink-faint'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center rounded-2xl transition-all ${
                      emphasize
                        ? `h-10 w-14 ${isActive ? 'bg-accent text-white' : 'bg-canvas-sunk text-ink-soft'}`
                        : `h-8 w-8 ${isActive ? 'text-ink' : 'text-ink-faint'}`
                    }`}
                  >
                    <Icon className={emphasize ? 'h-5 w-5' : 'h-[22px] w-[22px]'} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
