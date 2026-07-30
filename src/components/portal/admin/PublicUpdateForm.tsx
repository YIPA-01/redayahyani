'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { inputClasses, textareaClasses } from '@/components/portal/fieldStyles'
import { addPublicUpdate, type WithId } from '@/lib/portal/firestore'
import { formatTimestamp } from '@/lib/portal/format'
import type { PublicUpdateDoc } from '@/lib/portal/types'

export function PublicUpdateForm({
  projectId,
  updates,
}: {
  projectId: string
  updates: WithId<PublicUpdateDoc>[]
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = title.trim() && body.trim()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid) return
    setPending(true)
    setError(null)
    try {
      await addPublicUpdate(projectId, title.trim(), body.trim())
      setTitle('')
      setBody('')
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-700/40">
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
        Public journal
      </p>
      {updates.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          No public entries yet.
        </p>
      ) : (
        <ol className="mt-3 space-y-4">
          {updates.map((update) => (
            <li key={update.id}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  {update.title}
                </p>
                <p className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                  {formatTimestamp(update.publishedAt)}
                </p>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {update.body}
              </p>
            </li>
          ))}
        </ol>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Entry title"
          aria-label="Entry title"
          required
          className={inputClasses}
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="What is worth sharing publicly"
          aria-label="Entry body"
          rows={3}
          required
          className={textareaClasses}
        />
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Anything posted here is meant for the public. Keep client specifics
          out of it.
        </p>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <Button
          type="submit"
          disabled={pending || !valid}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Publishing...' : 'Publish entry'}
        </Button>
      </form>
    </div>
  )
}
