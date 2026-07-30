'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import {
  inputClasses,
  selectClasses,
  textareaClasses,
} from '@/components/portal/fieldStyles'
import { setPublicProfile } from '@/lib/portal/firestore'
import type { PublicPhase, PublicProfileDoc } from '@/lib/portal/types'

const phases: PublicPhase[] = ['Discovery', 'Build', 'QA & Launch', 'Completed']

export function PublicProfileForm({
  projectId,
  profile,
}: {
  projectId: string
  // undefined while loading, null when the project has no public face yet.
  profile: PublicProfileDoc | null | undefined
}) {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [phase, setPhase] = useState<PublicPhase>('Discovery')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Prefill once the profile arrives. Keyed on the loaded values so a
  // realtime change from elsewhere does not fight the admin mid-edit.
  useEffect(() => {
    if (!profile) return
    setSlug(profile.slug)
    setTitle(profile.title)
    setSummary(profile.summary)
    setPhase(profile.phase)
  }, [profile])

  const valid = slug.trim() && title.trim() && summary.trim()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid) return
    setPending(true)
    setError(null)
    setSaved(false)
    try {
      await setPublicProfile(projectId, {
        slug: slug.trim(),
        title: title.trim(),
        summary: summary.trim(),
        phase,
      })
      setSaved(true)
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      {profile === null && (
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          This project has no public face yet. Nothing about it is visible to
          anyone until you publish the profile below.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="Slug"
            aria-label="Slug"
            required
            className={inputClasses}
          />
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Public title"
            aria-label="Public title"
            required
            className={inputClasses}
          />
        </div>
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder="Public summary"
          aria-label="Public summary"
          rows={2}
          required
          className={textareaClasses}
        />
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={phase}
            onChange={(event) => setPhase(event.target.value as PublicPhase)}
            aria-label="Phase"
            className={selectClasses}
          >
            {phases.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            disabled={pending || !valid}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending
              ? 'Publishing...'
              : profile
                ? 'Update public face'
                : 'Publish public face'}
          </Button>
          {saved && (
            <p className="text-sm text-teal-500">Saved.</p>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </form>
    </div>
  )
}
