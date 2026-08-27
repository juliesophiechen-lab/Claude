import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { GalleryIcon, HomeIcon, ItineraryIcon, KoreanIcon, PlacesIcon, PlusIcon } from './icons'
import { AddPlaceSheet } from '../components/places/AddPlaceSheet'

type Tab = {
  to: string
  label: string
  Icon: typeof HomeIcon
  end: boolean
  emphasize: boolean
}

const LEFT_TABS: Tab[] = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true, emphasize: false },
  { to: '/itinerary', label: 'Itinerary', Icon: ItineraryIcon, end: false, emphasize: false },
  { to: '/places', label: 'Places', Icon: PlacesIcon, end: false, emphasize: true },
]

const RIGHT_TABS: Tab[] = [
  { to: '/gallery', label: 'Gallery', Icon: GalleryIcon, end: false, emphasize: false },
  { to: '/korean', label: 'Korean', Icon: KoreanIcon, end: false, emphasize: false },
]

function NavTab({ to, label, Icon, end, emphasize }: Tab) {
  return (
    <li className="flex-1">
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
  )
}

export function BottomNav() {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <nav className="z-40 shrink-0 border-t border-line bg-canvas/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {LEFT_TABS.map((tab) => (
          <NavTab key={tab.to} {...tab} />
        ))}
        <li className="flex flex-1 items-center justify-center">
          <button
            onClick={() => setAddOpen(true)}
            aria-label="Ort hinzufügen"
            className="flex h-12 w-12 -translate-y-2.5 items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_14px_rgba(193,82,42,0.45)] active:scale-95"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        </li>
        {RIGHT_TABS.map((tab) => (
          <NavTab key={tab.to} {...tab} />
        ))}
      </ul>

      <AddPlaceSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </nav>
  )
}
