import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useIdentity } from './IdentityContext'

const STORAGE_KEY = 'seoul-guide-interests-v1'

function loadStoredInterests(): string[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : null
  } catch {
    return null
  }
}

export interface Preferences {
  /** null = onboarding not completed yet on this device (interests step should show). */
  interests: string[] | null
  saveInterests: (next: string[]) => void
}

export function usePreferences(): Preferences {
  const { me } = useIdentity()
  const [interests, setInterests] = useState<string[] | null>(() => loadStoredInterests())

  function saveInterests(next: string[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore quota / private-mode errors
    }
    setInterests(next)
    if (me) {
      setDoc(doc(db, 'participantPreferences', me.id), { interests: next }, { merge: true }).catch((err) =>
        console.error('saveInterests failed', err),
      )
    }
  }

  return { interests, saveInterests }
}
