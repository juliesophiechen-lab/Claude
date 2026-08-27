import { trip } from '../data/mockTrip'
import { participants } from '../data/mockParticipants'
import { useAppState } from '../state/AppStateContext'
import { nextPlanItem, placeById } from '../lib/trip'
import { CountdownHero } from '../components/home/CountdownHero'
import { FlightCard } from '../components/home/FlightCard'
import { LayoverDivider } from '../components/home/LayoverDivider'
import { PendingFlightCard } from '../components/home/PendingFlightCard'
import { PeopleJoiningCard, NextPlanCard } from '../components/home/SummaryCards'

export function HomePage() {
  const { places, itineraryItems } = useAppState()
  const firstFlight = trip.flights[0]
  const departureAt = new Date(`${firstFlight.date}T${firstFlight.departTime}:00`)
  const nextItem = nextPlanItem(itineraryItems)
  const nextItemPlace = placeById(places, nextItem?.placeId)

  return (
    <div className="pb-6">
      <CountdownHero
        destination={trip.destination.toUpperCase()}
        departureAt={departureAt}
        startDate={trip.startDate}
        endDate={trip.endDate}
      />

      <div className="space-y-3 px-5 pt-5">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Your flight</p>

        {trip.flights.map((flight, i) => {
          const prev = trip.flights[i - 1]
          return (
            <div key={flight.id}>
              {prev && (
                <LayoverDivider city={prev.toCity} arriveTime={prev.arriveTime} departTime={flight.departTime} />
              )}
              <FlightCard flight={flight} />
            </div>
          )
        })}

        {trip.pendingFlight && (
          <div className="pt-1">
            <PendingFlightCard pendingFlight={trip.pendingFlight} />
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
