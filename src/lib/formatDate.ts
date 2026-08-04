// Accepts either a plain YYYY-MM-DD (how articles record dates) or a full ISO
// timestamp (how Firestore journal entries arrive). The slice makes the second
// case work instead of producing an invalid date.
export function formatDate(dateString: string) {
  return new Date(`${dateString.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
