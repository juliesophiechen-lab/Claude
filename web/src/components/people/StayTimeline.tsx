import { useState } from 'react'
import type { Participant } from '../../models'
import { formatDayMonth, formatWeekday, parseISO } from '../../lib/dates'
import { participantsOnDate } from '../../lib/trip'
import { Avatar } from '../common/Avatar'

const COL_WIDTH = 34
const ROW_HEIGHT = 44
const AXIS_HEIGHT = 30

interface StayTimelineProps {
  participants: Participant[]
  days: string[]
}

export function StayTimeline({ participants, days }: StayTimelineProps) {
  const [selectedDay, setSelectedDay] = useState<string>(days[Math.floor(days.length / 2)])

  const presentOnSelected = participantsOnDate(participants, selectedDay)
  const totalWidth = days.length * COL_WIDTH

  return (
    <div>
      <div className="flex">
        <div className="shrink-0" style={{ width: 92 }}>
          <div style={{ height: AXIS_HEIGHT }} />
          {participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 pr-2"
              style={{ height: ROW_HEIGHT }}
            >
              <Avatar name={p.name} color={p.color} image={p.image} size={26} />
              <span className="truncate text-[13px] font-medium text-ink">{p.name}</span>
            </div>
          ))}
        </div>

        <div className="no-scrollbar min-w-0 flex-1 overflow-x-auto">
          <div style={{ width: totalWidth }}>
            <div className="flex" style={{ height: AXIS_HEIGHT }}>
              {days.map((d) => {
                const present = participantsOnDate(participants, d).length
                const isSelected = d === selectedDay
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className="flex shrink-0 flex-col items-center justify-center"
                    style={{ width: COL_WIDTH }}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                        isSelected
                          ? 'bg-ink text-white'
                          : present >= 2
                            ? 'bg-accent-soft text-accent-ink'
                            : 'text-ink-soft'
                      }`}
                    >
                      {parseISO(d).getDate()}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="relative" style={{ height: ROW_HEIGHT * participants.length }}>
              {/* overlap background bands */}
              {days.map((d, i) => {
                const present = participantsOnDate(participants, d).length
                if (present < 2) return null
                const full = present === participants.length
                return (
                  <div
                    key={d}
                    className={`absolute top-0 ${full ? 'bg-accent-soft/70' : 'bg-canvas-sunk/70'}`}
                    style={{ left: i * COL_WIDTH, width: COL_WIDTH, height: '100%' }}
                  />
                )
              })}

              {participants.map((p, rowIndex) => {
                const startIdx = Math.max(
                  0,
                  days.findIndex((d) => d === p.arrivalDate),
                )
                const endIdx = days.findIndex((d) => d === p.departureDate)
                const clampedEnd = endIdx === -1 ? days.length - 1 : endIdx
                const left = startIdx * COL_WIDTH + 3
                const width = (clampedEnd - startIdx + 1) * COL_WIDTH - 6

                return (
                  <div
                    key={p.id}
                    className="absolute flex items-center"
                    style={{ top: rowIndex * ROW_HEIGHT, height: ROW_HEIGHT, left, width }}
                  >
                    <div className="h-2.5 w-full rounded-full" style={{ background: p.color }} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-canvas-soft px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          {formatWeekday(selectedDay)} {formatDayMonth(selectedDay)}
        </p>
        {presentOnSelected.length > 0 ? (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {presentOnSelected.map((p) => (
                <Avatar key={p.id} name={p.name} color={p.color} image={p.image} size={22} className="ring-2 ring-canvas-soft" />
              ))}
            </div>
            <p className="text-sm font-medium text-ink">
              {presentOnSelected.map((p) => p.name).join(', ')} {presentOnSelected.length === 1 ? 'is' : 'are'} in
              Seoul
            </p>
          </div>
        ) : (
          <p className="mt-1.5 text-sm font-medium text-ink-faint">No one has arrived yet</p>
        )}
      </div>
    </div>
  )
}
