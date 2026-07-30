'use client'

import { useState } from 'react'

import { selectClasses } from '@/components/portal/fieldStyles'
import { updateMilestoneStatus, type WithId } from '@/lib/portal/firestore'
import { formatDateOnly } from '@/lib/portal/format'
import type { MilestoneDoc, MilestoneStatus } from '@/lib/portal/types'

export function AdminMilestoneList({
  projectId,
  milestones,
}: {
  projectId: string
  milestones: WithId<MilestoneDoc>[]
}) {
  const [error, setError] = useState<string | null>(null)

  if (milestones.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No milestones yet.
      </p>
    )
  }

  async function changeStatus(milestoneId: string, status: MilestoneStatus) {
    setError(null)
    try {
      await updateMilestoneStatus(projectId, milestoneId, status)
    } catch {
      setError('That did not go through. Try again.')
    }
  }

  return (
    <div>
      <ol className="space-y-4">
        {milestones.map((milestone) => (
          <li
            key={milestone.id}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-teal-500">
                  {milestone.label}
                </p>
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  {milestone.title}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                Due {formatDateOnly(milestone.dueDate)}
              </p>
            </div>
            <select
              value={milestone.status}
              onChange={(event) =>
                changeStatus(
                  milestone.id,
                  event.target.value as MilestoneStatus,
                )
              }
              aria-label={`Status for ${milestone.title}`}
              className={selectClasses}
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </li>
        ))}
      </ol>
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
