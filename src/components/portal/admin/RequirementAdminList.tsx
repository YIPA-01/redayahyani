'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { Badge } from '@/components/portal/Badge'
import { deleteRequirement, type WithId } from '@/lib/portal/firestore'
import { formatTimestamp } from '@/lib/portal/format'
import type { RequirementRequestDoc } from '@/lib/portal/types'

export function RequirementAdminList({
  projectId,
  requests,
}: {
  projectId: string
  requests: WithId<RequirementRequestDoc>[]
}) {
  const [error, setError] = useState<string | null>(null)

  if (requests.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Nothing requested yet.
      </p>
    )
  }

  const sorted = [...requests].sort((a, b) => {
    if (a.status === b.status) return a.title.localeCompare(b.title)
    return a.status === 'open' ? -1 : 1
  })

  async function handleDelete(reqId: string) {
    setError(null)
    try {
      await deleteRequirement(projectId, reqId)
    } catch {
      setError('That did not go through. Try again.')
    }
  }

  return (
    <div>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
        {sorted.map((request) => (
          <li
            key={request.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                {request.type}
              </p>
              <p className="font-medium text-zinc-800 dark:text-zinc-100">
                {request.title}
              </p>
              <Badge tone={request.status === 'open' ? 'teal' : 'zinc'}>
                {request.status === 'open'
                  ? 'Open'
                  : `Fulfilled ${formatTimestamp(request.fulfilledAt)}`}
              </Badge>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleDelete(request.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
