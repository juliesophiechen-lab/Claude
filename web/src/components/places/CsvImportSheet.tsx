import { useRef, useState } from 'react'
import { csvToRecords, parseCsv, previewRecords, recordsToPlaces, type ImportPreviewRow } from '../../lib/csv'
import { useAppState } from '../../state/AppStateContext'
import { useToast } from '../../state/ToastContext'
import { BottomSheet } from '../common/BottomSheet'
import { categoryColor, categoryEmoji } from '../../lib/categories'
import { UploadIcon } from '../../layout/icons'

interface CsvImportSheetProps {
  open: boolean
  onClose: () => void
}

type Stage = 'start' | 'preview'

export function CsvImportSheet({ open, onClose }: CsvImportSheetProps) {
  const { importPlaces } = useAppState()
  const showToast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState<Stage>('start')
  const [fileName, setFileName] = useState('')
  const [records, setRecords] = useState<Record<string, string>[]>([])
  const [preview, setPreview] = useState<ImportPreviewRow[]>([])
  const [loading, setLoading] = useState(false)

  function reset() {
    setStage('start')
    setFileName('')
    setRecords([])
    setPreview([])
    setLoading(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function loadCsvText(text: string, name: string) {
    const parsedRecords = csvToRecords(parseCsv(text))
    setRecords(parsedRecords)
    setPreview(previewRecords(parsedRecords))
    setFileName(name)
    setStage('preview')
    setLoading(false)
  }

  async function handleSample() {
    setLoading(true)
    try {
      const res = await fetch('/sample-places.csv')
      const text = await res.text()
      loadCsvText(text, 'Seoul_Google_MyMaps_Import.csv')
    } catch {
      showToast('Could not load the sample file')
      setLoading(false)
    }
  }

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const reader = new FileReader()
    reader.onload = () => loadCsvText(String(reader.result ?? ''), file.name)
    reader.onerror = () => {
      showToast('Could not read that file')
      setLoading(false)
    }
    reader.readAsText(file)
  }

  function handleImport() {
    const places = recordsToPlaces(records)
    importPlaces(places)
    showToast(`Imported ${places.length} places`)
    handleClose()
  }

  return (
    <BottomSheet open={open} onClose={handleClose} maxHeightClass="max-h-[85%]">
      <div className="px-5 pb-8">
        {stage === 'start' && (
          <>
            <h2 className="text-lg font-semibold text-ink">Import places from CSV</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Bring in a saved-places export. We'll match columns automatically — no field mapping needed for a
              standard Google My Maps export.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFilePicked}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              <UploadIcon className="h-4 w-4" /> Choose CSV file
            </button>
            <button
              onClick={handleSample}
              disabled={loading}
              className="mt-2.5 w-full rounded-full border border-line py-3.5 text-sm font-semibold text-ink disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Try with sample file'}
            </button>
          </>
        )}

        {stage === 'preview' && (
          <>
            <h2 className="text-lg font-semibold text-ink">Preview import</h2>
            <p className="mt-1 truncate text-sm text-ink-soft">{fileName}</p>
            <p className="mt-3 text-[13px] font-medium text-ink-soft">
              <span className="font-semibold text-ink">{records.length} rows</span> found · columns matched: Name,
              Location, Kategorie, Viertel
            </p>

            <div className="mt-4 space-y-1.5">
              {preview.slice(0, 6).map((row, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl bg-canvas-soft px-3 py-2">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm"
                    style={{ background: `${categoryColor(row.category)}33` }}
                  >
                    {categoryEmoji(row.category)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{row.name}</p>
                    <p className="truncate text-xs text-ink-soft">
                      {row.neighborhood} · {row.category}
                    </p>
                  </div>
                </div>
              ))}
              {records.length > 6 && (
                <p className="px-1 pt-1 text-xs text-ink-faint">+ {records.length - 6} more rows</p>
              )}
            </div>

            <p className="mt-4 text-xs text-ink-faint">
              Coordinates aren't in this export, so imported places get placeholder positions on the mock map until
              real geocoding is connected in Phase 2.
            </p>

            <button
              onClick={handleImport}
              className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-white"
            >
              Import {records.length} places
            </button>
            <button onClick={reset} className="mt-2.5 w-full rounded-full border border-line py-3.5 text-sm font-semibold text-ink">
              Choose a different file
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  )
}
