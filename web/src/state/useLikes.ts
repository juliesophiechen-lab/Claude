import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useIdentity } from './IdentityContext'

const EMPTY_SET: Set<string> = new Set()

export interface Likes {
  counts: Record<string, number>
  likedByMe: Set<string>
  toggleLike: (placeId: string) => void
}

export function useLikes(): Likes {
  const { me } = useIdentity()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [likedByMe, setLikedByMe] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'likeCounts'), (snap) => {
      const next: Record<string, number> = {}
      snap.forEach((d) => {
        next[d.id] = (d.data().count as number) ?? 0
      })
      setCounts(next)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (!me) return
    const q = query(collection(db, 'likes'), where('participantId', '==', me.id))
    const unsub = onSnapshot(q, (snap) => {
      setLikedByMe(new Set(snap.docs.map((d) => d.data().placeId as string)))
    })
    return unsub
  }, [me])

  function toggleLike(placeId: string) {
    if (!me) return
    const likeRef = doc(db, 'likes', `${placeId}_${me.id}`)
    const countRef = doc(db, 'likeCounts', placeId)
    runTransaction(db, async (tx) => {
      const likeSnap = await tx.get(likeRef)
      if (likeSnap.exists()) {
        tx.delete(likeRef)
        tx.set(countRef, { count: increment(-1) }, { merge: true })
      } else {
        tx.set(likeRef, { placeId, participantId: me.id, createdAt: serverTimestamp() })
        tx.set(countRef, { count: increment(1) }, { merge: true })
      }
    }).catch((err) => console.error('toggleLike failed', err))
  }

  return { counts, likedByMe: me ? likedByMe : EMPTY_SET, toggleLike }
}
