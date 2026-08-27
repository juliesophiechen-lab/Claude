import { participants } from '../data/mockParticipants'
import { useIdentity } from '../state/IdentityContext'
import { Avatar } from '../components/common/Avatar'

export function StartPage() {
  const { setMe } = useIdentity()

  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-white">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path d="M-10 60 C 60 30, 120 90, 190 55 S 320 20, 410 70" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M-10 140 C 70 110, 130 170, 200 135 S 330 100, 410 150" stroke="white" strokeWidth="1.2" fill="none" />
        <path d="M-10 220 C 80 190, 140 250, 210 210 S 330 180, 410 230" stroke="white" strokeWidth="1.2" fill="none" />
      </svg>

      <div className="relative w-full max-w-xs text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Seoul Trip</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Wer bist du?</h1>
        <p className="mt-2 text-sm text-white/60">
          Damit Likes, Itinerary-Änderungen und Uploads zeigen, von wem sie kommen.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-5">
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => setMe(p.id)}
              className="flex flex-col items-center gap-2 active:scale-95"
            >
              <Avatar name={p.name} color={p.color} image={p.image} size={76} className="ring-4 ring-white/10" />
              <span className="text-sm font-semibold">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
