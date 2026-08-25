import { trip } from '../data/mockTrip'
import { participants } from '../data/mockParticipants'
import { useAppState } from '../state/AppStateContext'
import { daysUntil } from '../lib/dates'
import { nextPlanItem, placeById } from '../lib/trip'
import { CountdownHero } from '../components/home/CountdownHero'
import { FlightCard, FlightSummaryRow } from '../components/home/FlightCard'
import { PeopleJoiningCard, NextPlanCard } from '../components/home/SummaryCards'

export function HomePage() {
  const { places, itineraryItems } = useAppState()
  const daysToGo = daysUntil(trip.startDate)
  const [outboundFlight, ...otherFlights] = trip.flights
  const nextItem = nextPlanItem(itineraryItems)
  const nextItemPlace = placeById(places, nextItem?.placeId)

  return (
    <div className="pb-6">
      <CountdownHero
        destination={trip.destination.toUpperCase()}
        daysToGo={daysToGo}
        startDate={trip.startDate}
        endDate={trip.endDate}
      />

      <div className="space-y-3 px-5 pt-5">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Your flight</p>
        <FlightCard flight={outboundFlight} />

        {otherFlights.length > 0 && (
          <div className="relative pl-4">
            <span className="absolute left-[7px] top-0 h-full w-px border-l border-dashed border-line" />
            <div className="space-y-2">
              {otherFlights.map((f) => (
                <FlightSummaryRow key={f.id} flight={f} />
              ))}
            </div>
          </div>
        )}

        <div className="!mt-6 space-y-2.5">
          <PeopleJoiningCard participants={participants} />
          <NextPlanCard item={nextItem} place={nextItemPlace} />
        </div>
      </div>
    </div>
  )
}
