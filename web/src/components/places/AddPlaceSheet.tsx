import { useRef, useState } from 'react'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { compressImageToDataUrl } from '../../lib/image'
import { isShortGoogleMapsLink, parseGoogleMapsLink } from '../../lib/googleMapsLink'
import { useIdentity } from '../../state/IdentityContext'
import { useToast } from '../../state/ToastContext'
import { BottomSheet } from '../common/BottomSheet'
import { UploadIcon } from '../../layout/icons'

interface AddPlaceSheetProps {
  open: boolean
  onClose: () => void
}

type Tab = 'screenshot' | 'link' | 'google'

const TABS: { value: Tab; label: string }[] = [
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'link', label: 'Link' },
  { value: 'google', label: 'Google Maps' },
]

export function AddPlaceSheet({ open, onClose }: AddPlaceSheetProps) {
  const { me } = useIdentity()
  const showToast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState<Tab>('screenshot')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  function reset() {
    setTab('screenshot')
    setFile(null)
    setPreviewUrl(null)
    setLinkUrl('')
    setName('')
    setNote('')
    setSaving(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    if (!picked) return
    setFile(picked)
    setPreviewUrl(URL.createObjectURL(picked))
  }

  const googleParsed = tab === 'google' && linkUrl.trim() ? parseGoogleMapsLink(linkUrl.trim()) : null
  const googleIsShort = tab === 'google' && linkUrl.trim() ? isShortGoogleMapsLink(linkUrl.trim()) : false

  const canSubmit =
    tab === 'screenshot' ? !!file : tab === 'link' ? linkUrl.trim().length > 0 : linkUrl.trim().length > 0

  async function handleSubmit() {
    if (!canSubmit || saving) return
    setSaving(true)
    try {
      const id = `sg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const base = {
        name: name.trim() || undefined,
        note: note.trim() || undefined,
        addedBy: me?.id ?? null,
        addedByName: me?.name ?? null,
        addedAt: serverTimestamp(),
      }

      if (tab === 'screenshot') {
        const imageUrl = await compressImageToDataUrl(file as File)
        await setDoc(doc(collection(db, 'suggestedPlaces'), id), { ...base, imageUrl })
      } else if (tab === 'link') {
        await setDoc(doc(collection(db, 'suggestedPlaces'), id), { ...base, sourceUrl: linkUrl.trim() })
      } else {
        const parsed = parseGoogleMapsLink(linkUrl.trim())
        await setDoc(doc(collection(db, 'suggestedPlaces'), id), {
          ...base,
          name: base.name || parsed.name,
          googleMapsUrl: linkUrl.trim(),
          ...(parsed.latitude != null && parsed.longitude != null
            ? { latitude: parsed.latitude, longitude: parsed.longitude }
            : {}),
        })
      }

      showToast('Ort hinzugefügt')
      handleClose()
    } catch (err) {
      console.error('add place failed', err)
      showToast('Konnte nicht gespeichert werden')
      setSaving(false)
    }
  }

  return (
    <BottomSheet open={open} onClose={handleClose} maxHeightClass="max-h-[85%]">
      <div className="px-5 pb-8">
        <h2 className="text-lg font-semibold text-ink">Ort hinzufügen</h2>
        <p className="mt-1 text-sm text-ink-soft">Erscheint für alle in der Gallery.</p>

        <div className="mt-4 flex gap-1.5 rounded-full bg-canvas-soft p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${
                tab === t.value ? 'bg-white text-ink shadow-sm' : 'text-ink-soft'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'screenshot' && (
          <>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFilePicked} />
            {previewUrl ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 block aspect-square w-full overflow-hidden rounded-2xl"
              >
                <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white"
              >
                <UploadIcon className="h-4 w-4" /> Screenshot auswählen
              </button>
            )}
          </>
        )}

        {tab === 'link' && (
          <>
            <p className="mt-5 text-xs text-ink-faint">z. B. ein Instagram-Post, TikTok oder eine Website</p>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://instagram.com/p/..."
              className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </>
        )}

        {tab === 'google' && (
          <>
            <p className="mt-5 text-xs text-ink-faint">
              Google-Maps-Link einfügen — Koordinaten werden direkt daraus gelesen
            </p>
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://www.google.com/maps/place/..."
              className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            {linkUrl.trim() && (
              <p className="mt-2 text-xs">
                {googleIsShort ? (
                  <span className="text-ink-faint">
                    Kurzlinks (maps.app.goo.gl) lassen sich nicht auslesen — der Ort wird ungefähr platziert. Am
                    besten den vollen Link teilen (in Google Maps auf den Ortsnamen tippen, dann "Teilen").
                  </span>
                ) : googleParsed?.latitude != null ? (
                  <span className="font-medium text-confirmed">✓ Koordinaten gefunden</span>
                ) : (
                  <span className="text-ink-faint">Keine Koordinaten im Link gefunden — Ort wird ungefähr platziert.</span>
                )}
              </p>
            )}
          </>
        )}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={tab === 'google' && googleParsed?.name ? googleParsed.name : 'Name des Orts (optional)'}
          className="mt-4 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notiz (optional)"
          rows={2}
          className="mt-2.5 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
        />

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || saving}
          className="mt-6 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {saving ? 'Wird gespeichert…' : 'Hinzufügen'}
        </button>
      </div>
    </BottomSheet>
  )
}
