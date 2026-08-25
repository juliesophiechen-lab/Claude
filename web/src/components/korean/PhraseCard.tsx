import type { DictionaryPhrase } from '../../models'

export function PhraseCard({ phrase, onTap }: { phrase: DictionaryPhrase; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="w-full rounded-2xl bg-white px-4 py-3.5 text-left shadow-[0_1px_2px_rgba(18,18,20,0.06)] active:bg-canvas-soft"
    >
      <p className="text-[12px] font-medium text-ink-faint">{phrase.english}</p>
      <p className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-accent">
        {phrase.pronunciation}
      </p>
      <p className="mt-1 text-[15px] text-ink-soft">{phrase.korean}</p>
    </button>
  )
}
