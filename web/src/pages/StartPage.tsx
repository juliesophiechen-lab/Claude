import { participants } from '../data/mockParticipants'
import { useIdentity } from '../state/IdentityContext'

export function StartPage() {
  const { setMe } = useIdentity()

  return (
    <div
      className="relative flex h-dvh flex-col items-center justify-center overflow-hidden px-6 text-white"
      style={{ background: 'linear-gradient(165deg, #35216b 0%, #1a1038 55%, #0d0818 100%)' }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path d="M-10 60 C 60 30, 120 90, 190 55 S 320 20, 410 70" stroke="#c8b6ff" strokeWidth="1.2" fill="none" />
        <path d="M-10 140 C 70 110, 130 170, 200 135 S 330 100, 410 150" stroke="#c8b6ff" strokeWidth="1.2" fill="none" />
        <path d="M-10 220 C 80 190, 140 250, 210 210 S 330 180, 410 230" stroke="#c8b6ff" strokeWidth="1.2" fill="none" />
      </svg>

      <div className="relative w-full max-w-xs text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Seoul Trip</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Wer bist du?</h1>
        <p className="mt-2 text-sm text-white/55">
          Damit Likes, Itinerary-Änderungen und Uploads zeigen, von wem sie kommen.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => setMe(p.id)}
              className="flex w-[152px] flex-col items-center gap-2.5 transition-transform active:translate-x-[3px] active:translate-y-[3px]"
            >
              <div
                className="aspect-[4/5] w-full overflow-hidden rounded-xl ring-2 ring-accent/60"
                style={{ boxShadow: '6px 6px 0 0 rgba(124,92,255,0.4)' }}
              >
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-black" style={{ background: p.color }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-base font-bold uppercase tracking-wide">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
