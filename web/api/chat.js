// Vercel serverless function — proxies chat questions to the Anthropic API so
// the API key never reaches the browser. Requires an ANTHROPIC_API_KEY
// environment variable set in the Vercel project (Settings → Environment
// Variables); without it every request replies with a clear setup error
// instead of leaking a stack trace.

const MODEL = 'claude-haiku-4-5'

function buildPlacesSummary(places) {
  if (!Array.isArray(places)) return ''
  return places
    .map((p) => {
      const bits = [p.name, p.category, p.neighborhood].filter(Boolean)
      if (p.description) bits.push(p.description)
      if (p.notes) bits.push(p.notes)
      const flags = [p.favorite && 'favorite', p.visited && 'visited', p.planned && 'planned'].filter(Boolean)
      if (flags.length) bits.push(`(${flags.join(', ')})`)
      return `- ${bits.join(' — ')}`
    })
    .join('\n')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' })
    return
  }

  const { question, places, history } = req.body ?? {}
  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Missing question' })
    return
  }

  const systemPrompt = `You are a helpful trip-planning assistant for a small group's trip to Seoul. Answer questions ONLY using the list of saved places below — recommend specific places by name, mention their neighborhood, and note if the group already marked one as a favorite/visited/planned. If nothing in the list fits the question, say so honestly instead of inventing a place. Keep answers short and conversational (2-4 sentences).

Saved places:
${buildPlacesSummary(places)}`

  const messages = [...(Array.isArray(history) ? history : []), { role: 'user', content: question }]

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      res.status(502).json({ error: `Anthropic API error: ${text}` })
      return
    }

    const data = await response.json()
    const answer = data.content?.find((block) => block.type === 'text')?.text ?? ''
    res.status(200).json({ answer })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}
