import type { DictionaryPhrase } from '../../models'
import { useToast } from '../../state/ToastContext'
import { ChevronLeftIcon, PlayIcon } from '../../layout/icons'

export function PhraseFullscreen({
  phrase,
  onClose,
}: {
  phrase: DictionaryPhrase | null
  onClose: () => void
}) {
  const showToast = useToast()
  if (!phrase) return null

  return (
    <div className="animate-fade-in fixed inset-0 z-50 mx-auto flex max-w-md flex-col bg-ink text-white md:max-w-lg">
      <div className="flex items-center px-3 pt-3">
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full active:bg-white/10">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-white/50">{phrase.english}</p>
        <p className="mt-5 w-full break-words text-4xl font-bold leading-[1.1] tracking-tight">
          {phrase.pronunciation}
        </p>
        <p className="mt-6 text-2xl text-white/70">{phrase.korean}</p>
      </div>

      <div className="px-8 pb-12">
        <button
          onClick={() => showToast('Audio playback coming in a later phase')}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink active:opacity-90"
          aria-label="Play pronunciation"
        >
          <PlayIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
