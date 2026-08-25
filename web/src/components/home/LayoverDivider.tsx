function minutesBetween(from: string, to: string): number {
  const [fh, fm] = from.split(':').map(Number)
  const [th, tm] = to.split(':').map(Number)
  return th * 60 + tm - (fh * 60 + fm)
}

export function LayoverDivider({ city, arriveTime, departTime }: { city: string; arriveTime: string; departTime: string }) {
  const minutes = minutesBetween(arriveTime, departTime)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return (
    <div className="flex items-center gap-3 py-1 pl-6 text-xs font-medium text-ink-faint">
      <span className="h-8 w-px border-l border-dashed border-line" />
      Layover in {city} · {h}h {m > 0 ? `${m}m` : ''}
    </div>
  )
}
