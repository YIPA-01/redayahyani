'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { Badge } from '@/components/portal/Badge'
import { selectClasses } from '@/components/portal/fieldStyles'
import {
  addProjectMember,
  removeProjectMember,
  type WithId,
} from '@/lib/portal/firestore'
import type { ProjectDoc, UserDoc } from '@/lib/portal/types'

export function MemberManager({
  projectId,
  project,
  users,
}: {
  projectId: string
  project: WithId<ProjectDoc>
  users: WithId<UserDoc>[]
}) {
  const [selected, setSelected] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const members = users.filter((u) => project.memberUids.includes(u.id))
  // Only client accounts can be members; the admin is never offered.
  const candidates = users.filter(
    (u) => u.role === 'client' && !project.memberUids.includes(u.id),
  )

  async function run(action: () => Promise<unknown>) {
    setPending(true)
    setError(null)
    try {
      await action()
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      {members.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No members yet. The client cannot see this project until you add
          them.
        </p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  {member.displayName}
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  {member.email}
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                disabled={pending}
                onClick={() => run(() => removeProjectMember(projectId, member.id))}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      {candidates.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <select
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            aria-label="Client to add"
            className={selectClasses + ' flex-1'}
          >
            <option value="">Choose a client to add</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.displayName} ({candidate.email})
              </option>
            ))}
          </select>
          <Button
            type="button"
            disabled={pending || selected === ''}
            onClick={() =>
              run(() => addProjectMember(projectId, selected)).then(() =>
                setSelected(''),
              )
            }
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add member
          </Button>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
        <Badge tone="zinc">Note</Badge> Members see the whole private record
        of this project the moment they are added.
      </p>
    </div>
  )
}
