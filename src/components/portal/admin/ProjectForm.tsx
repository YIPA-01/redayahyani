'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { inputClasses, selectClasses } from '@/components/portal/fieldStyles'
import { createProject, type WithId } from '@/lib/portal/firestore'
import type { ProjectStatus, UserDoc } from '@/lib/portal/types'

export function ProjectForm({ users }: { users: WithId<UserDoc>[] }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [memberUids, setMemberUids] = useState<string[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clients = users.filter((u) => u.role === 'client')

  function toggleMember(uid: string) {
    setMemberUids((current) =>
      current.includes(uid)
        ? current.filter((existing) => existing !== uid)
        : [...current, uid],
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setPending(true)
    setError(null)
    try {
      await createProject(trimmed, status, memberUids)
      setName('')
      setStatus('active')
      setMemberUids([])
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Project name"
        aria-label="Project name"
        required
        className={inputClasses}
      />
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as ProjectStatus)}
        aria-label="Status"
        className={selectClasses + ' w-full'}
      >
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="completed">Completed</option>
      </select>
      {clients.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Members
          </legend>
          <div className="mt-2 space-y-2">
            {clients.map((client) => (
              <label
                key={client.id}
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <input
                  type="checkbox"
                  checked={memberUids.includes(client.id)}
                  onChange={() => toggleMember(client.id)}
                  className="rounded border-zinc-300 text-teal-500 focus:ring-teal-500/50"
                />
                {client.displayName} ({client.email})
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <Button
        type="submit"
        disabled={pending || name.trim().length === 0}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Creating...' : 'Create project'}
      </Button>
    </form>
  )
}
