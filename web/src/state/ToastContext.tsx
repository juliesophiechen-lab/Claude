import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type ShowToast = (message: string) => void

const ToastCtx = createContext<ShowToast | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<number | undefined>(undefined)

  const show = useCallback((msg: string) => {
    setMessage(msg)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setMessage(null), 2200)
  }, [])

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {message && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6">
          <div className="animate-fade-in pointer-events-auto rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-lg">
            {message}
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  )
}

export function useToast(): ShowToast {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
