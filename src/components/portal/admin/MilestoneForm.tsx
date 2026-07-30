'use client'

import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'

import { Button } from '@/components/Button'
import {
  inputClasses,
  selectClasses,
  textareaClasses,
} from '@/components/portal/fieldStyles'
import { addMilestone } from '@/lib/portal/firestore'
import type { MilestoneStatus } from '@/lib/portal/types'

export function MilestoneForm({ projectId }: { projectId: string }) {
  const [label, setLabel] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<MilestoneStatus>('planned')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid =
    label.trim() && title.trim() && description.trim() && dueDate !== ''

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid) return
    setPending(true)
    setError(null)
    try {
      await addMilestone(projectId, {
        label: label.trim(),
        title: title.trim(),
        description: description.trim(),
        // UTC midnight so the picked date roundtrips in every timezone;
        // formatDateOnly renders it back in UTC.
        dueDate: Timestamp.fromDate(new Date(dueDate + 'T00:00:00Z')),
        status,
      })
      setLabel('')
      setTitle('')
      setDescription('')
      setDueDate('')
      setStatus('planned')
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-zinc-100 pt-6 dark:border-zinc-700/40">
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
        Add a milestone
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Label (e.g. Week 1-2)"
          aria-label="Milestone label"
          required
          className={inputClasses}
        />
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          aria-label="Milestone title"
          required
          className={inputClasses}
        />
      </div>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        aria-label="Milestone description"
        rows={2}
        required
        className={textareaClasses}
      />
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          aria-label="Due date"
          required
          className={inputClasses + ' w-auto'}
        />
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as MilestoneStatus)
          }
          aria-label="New milestone status"
          className={selectClasses}
        >
          <option value="planned">Planned</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <Button
          type="submit"
          disabled={pending || !valid}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Adding...' : 'Add milestone'}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  )
}
