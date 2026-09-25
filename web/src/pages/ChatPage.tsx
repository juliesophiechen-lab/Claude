import { useEffect, useRef, useState } from 'react'
import { useAppState } from '../state/AppStateContext'
import { SendIcon } from '../layout/icons'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function ChatPage() {
  const { places } = useAppState()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  async function handleSend() {
    const question = input.trim()
    if (!question || sending) return
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: question }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)

    try {
      const lightPlaces = places.map((p) => ({
        name: p.name,
        category: p.category,
        neighborhood: p.neighborhood,
        address: p.address,
        description: p.description,
        notes: p.notes,
        favorite: p.favorite,
        visited: p.visited,
        planned: p.planned,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question,
          places: lightPlaces,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Chat request failed')
      setMessages([...nextMessages, { role: 'assistant', content: data.answer || "Hmm, I didn't get an answer." }])
    } catch (err) {
      console.error('chat failed', err)
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: 'Sorry, something went wrong reaching the assistant. Try again in a bit.' },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-2 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Chat</h1>
        <p className="mt-1 text-[13px] text-ink-soft">Ask about your saved places, e.g. "best food in Gangnam?"</p>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-3">
        {messages.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-2 px-6 text-center text-ink-soft">
            <p className="text-sm">Ask me anything about the places you've all saved.</p>
            <p className="text-xs text-ink-faint">e.g. "Wo gibt es das beste Essen in Gangnam?"</p>
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug ${
                m.role === 'user'
                  ? 'self-end bg-ink text-white'
                  : 'self-start bg-white text-ink shadow-[0_1px_2px_rgba(18,18,20,0.06)]'
              }`}
            >
              {m.content}
            </div>
          ))}
          {sending && (
            <div className="self-start rounded-2xl bg-white px-4 py-2.5 text-[14px] text-ink-faint shadow-[0_1px_2px_rgba(18,18,20,0.06)]">
              …
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-line px-4 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
          placeholder="Wo gibt's das beste Essen in Gangnam?"
          className="flex-1 rounded-full border border-line bg-canvas-soft px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white disabled:opacity-40"
          aria-label="Send"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
