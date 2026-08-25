import { useState } from 'react'
import { DICTIONARY_CATEGORIES, type DictionaryPhrase } from '../models'
import { phrases } from '../data/mockPhrases'
import { Chip } from '../components/common/Chip'
import { PhraseCard } from '../components/korean/PhraseCard'
import { PhraseFullscreen } from '../components/korean/PhraseFullscreen'

export function KoreanPage() {
  const [category, setCategory] = useState<(typeof DICTIONARY_CATEGORIES)[number]>('Basics')
  const [active, setActive] = useState<DictionaryPhrase | null>(null)

  const shown = phrases.filter((p) => p.category === category)

  return (
    <div className="relative min-h-full pb-6">
      <h1 className="px-5 pb-1 pt-6 text-2xl font-semibold tracking-tight text-ink">Korean</h1>
      <p className="px-5 text-sm text-ink-soft">What do you need?</p>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {DICTIONARY_CATEGORIES.map((cat) => (
          <Chip key={cat} label={cat} active={category === cat} onClick={() => setCategory(cat)} />
        ))}
      </div>

      <div className="mt-4 space-y-2.5 px-5">
        {shown.map((phrase) => (
          <PhraseCard key={phrase.id} phrase={phrase} onTap={() => setActive(phrase)} />
        ))}
      </div>

      <PhraseFullscreen phrase={active} onClose={() => setActive(null)} />
    </div>
  )
}
