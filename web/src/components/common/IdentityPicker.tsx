import { participants } from '../../data/mockParticipants'
import { useIdentity } from '../../state/IdentityContext'
import { Avatar } from './Avatar'

export function IdentityPicker() {
  const { me, setMe } = useIdentity()

  if (me) return null

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/50 px-6">
      <div className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-ink">Wer bist du?</h2>
        <p className="mt-1 text-[13px] text-ink-soft">
          Damit Likes, Itinerary-Änderungen und Uploads zeigen, von wem sie kommen.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          {participants.map((p) => (
            <button
              key={p.id}
              onClick={() => setMe(p.id)}
              className="flex items-center gap-3 rounded-2xl border border-line px-3.5 py-2.5 text-left active:bg-canvas-sunk"
            >
              <Avatar name={p.name} color={p.color} image={p.image} size={44} />
              <span className="text-sm font-semibold text-ink">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
