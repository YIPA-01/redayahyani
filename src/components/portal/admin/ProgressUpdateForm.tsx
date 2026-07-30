'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { textareaClasses } from '@/components/portal/fieldStyles'
import { addProgressUpdate } from '@/lib/portal/firestore'

export function ProgressUpdateForm({ projectId }: { projectId: string }) {
  const { user } = usePortalAuth()
  const [body, setBody] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = body.trim()
    if (!trimmed || !user) return
    setPending(true)
    setError(null)
    try {
      await addProgressUpdate(projectId, user.uid, trimmed)
      setBody('')
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="What moved forward"
        aria-label="Progress update"
        rows={2}
        className={textareaClasses}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <Button
        type="submit"
        disabled={pending || body.trim().length === 0}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Posting...' : 'Post update'}
      </Button>
    </form>
  )
}
