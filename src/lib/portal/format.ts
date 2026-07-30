// Timestamp formatters for portal UI. Defensive on null and undefined so
// pending server timestamps can never crash a render.

import type { Timestamp } from 'firebase/firestore'

export function formatTimestamp(t: Timestamp | null | undefined): string {
  if (!t) return ''
  return t.toDate().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// For date-only values stored as UTC midnight (e.g. milestone due dates).
// Rendering in UTC makes the picked date roundtrip in every timezone.
export function formatDateOnly(t: Timestamp | null | undefined): string {
  if (!t) return ''
  return t.toDate().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatTimestampTime(t: Timestamp | null | undefined): string {
  if (!t) return ''
  return t.toDate().toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
