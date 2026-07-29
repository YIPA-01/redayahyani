'use client'

// Snapshot hooks for the portal. Factory plus deps because Firestore query
// and ref objects are new on every render; the factory is memoized on deps
// so listeners do not resubscribe in a loop. A factory returning null skips
// subscription, which is how pages wait for auth or for a parent doc.

import { useEffect, useMemo, useState } from 'react'
import {
  onSnapshot,
  type DocumentReference,
  type FirestoreError,
  type Query,
} from 'firebase/firestore'

export function useColSnapshot<T>(
  makeQuery: () => Query<T> | null,
  deps: unknown[],
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const query = useMemo(makeQuery, deps)
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<FirestoreError | null>(null)

  useEffect(() => {
    if (!query) return
    setData(null)
    setError(null)
    return onSnapshot(
      query,
      { includeMetadataChanges: false },
      (snap) => {
        setData(snap.docs.map((d) => d.data({ serverTimestamps: 'estimate' })))
      },
      (err) => setError(err),
    )
  }, [query])

  return { data, error }
}

export function useDocSnapshot<T>(
  makeRef: () => DocumentReference<T> | null,
  deps: unknown[],
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ref = useMemo(makeRef, deps)
  // undefined = loading, null = document does not exist
  const [data, setData] = useState<T | null | undefined>(undefined)
  const [error, setError] = useState<FirestoreError | null>(null)

  useEffect(() => {
    if (!ref) return
    setData(undefined)
    setError(null)
    return onSnapshot(
      ref,
      (snap) => {
        setData(
          snap.exists() ? snap.data({ serverTimestamps: 'estimate' }) : null,
        )
      },
      (err) => setError(err),
    )
  }, [ref])

  return { data, error }
}
