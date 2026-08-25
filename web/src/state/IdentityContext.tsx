import { createContext, useContext, useState, type ReactNode } from 'react'
import { participants } from '../data/mockParticipants'
import type { Participant } from '../models'

const STORAGE_KEY = 'seoul-guide-identity-v1'

interface IdentityState {
  me: Participant | null
  setMe: (participantId: string) => void
  clearMe: () => void
}

const IdentityCtx = createContext<IdentityState | null>(null)

function loadStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [meId, setMeId] = useState<string | null>(() => loadStoredId())

  function setMe(participantId: string) {
    try {
      localStorage.setItem(STORAGE_KEY, participantId)
    } catch {
      // ignore quota / private-mode errors
    }
    setMeId(participantId)
  }

  function clearMe() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setMeId(null)
  }

  const me = participants.find((p) => p.id === meId) ?? null

  return <IdentityCtx.Provider value={{ me, setMe, clearMe }}>{children}</IdentityCtx.Provider>
}

export function useIdentity(): IdentityState {
  const ctx = useContext(IdentityCtx)
  if (!ctx) throw new Error('useIdentity must be used within IdentityProvider')
  return ctx
}
