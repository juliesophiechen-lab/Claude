import { useRef, useState } from 'react'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { compressImageToDataUrl } from '../../lib/image'
import { useIdentity } from '../../state/IdentityContext'
import { useToast } from '../../state/ToastContext'
import { BottomSheet } from '../common/BottomSheet'
import { UploadIcon } from '../../layout/icons'

interface ScreenshotUploadSheetProps {
  open: boolean
  onClose: () => void
}

export function ScreenshotUploadSheet({ open, onClose }: ScreenshotUploadSheetProps) {
  const { me } = useIdentity()
  const showToast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [uploading, setUploading] = useState(false)

  function reset() {
    setFile(null)
    setPreviewUrl(null)
    setName('')
    setNote('')
    setUploading(false)
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

  async function handleSubmit() {
    if (!file) return
    setUploading(true)
    try {
      const id = `sg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const imageUrl = await compressImageToDataUrl(file)
      await setDoc(doc(collection(db, 'suggestedPlaces'), id), {
        name: name.trim() || undefined,
        note: note.trim() || undefined,
        imageUrl,
        addedBy: me?.id ?? null,
        addedByName: me?.name ?? null,
        addedAt: serverTimestamp(),
      })
      showToast('Screenshot hinzugefügt')
      handleClose()
    } catch (err) {
      console.error('screenshot upload failed', err)
      showToast('Bild konnte nicht verarbeitet werden — versuch ein kleineres Bild')
      setUploading(false)
    }
  }

  return (
    <BottomSheet open={open} onClose={handleClose} maxHeightClass="max-h-[85%]">
      <div className="px-5 pb-8">
        <h2 className="text-lg font-semibold text-ink">Screenshot hinzufügen</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Lade einen Screenshot von einem Ort hoch — er erscheint für alle in der Gallery.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFilePicked}
        />

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

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name des Orts (optional)"
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
          disabled={!file || uploading}
          className="mt-6 w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {uploading ? 'Wird hochgeladen…' : 'Hinzufügen'}
        </button>
      </div>
    </BottomSheet>
  )
}
