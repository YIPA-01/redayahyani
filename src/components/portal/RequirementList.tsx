'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { Badge } from '@/components/portal/Badge'
import { fulfilRequirement } from '@/lib/portal/firestore'
import { formatTimestamp } from '@/lib/portal/format'
import type { WithId } from '@/lib/portal/firestore'
import type { RequirementRequestDoc } from '@/lib/portal/types'

function RequirementRow({
  projectId,
  request,
}: {
  projectId: string
  request: WithId<RequirementRequestDoc>
}) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const open = request.status === 'open'

  async function handleFulfil() {
    setPending(true)
    setError(null)
    try {
      await fulfilRequirement(projectId, request.id)
    } catch {
      setError('That did not go through. Try again.')
      setPending(false)
    }
  }

  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {request.type}
        </p>
        <p className="font-medium text-zinc-800 dark:text-zinc-100">
          {request.title}
        </p>
        <Badge tone={open ? 'teal' : 'zinc'}>
          {open ? 'Needed' : 'Fulfilled'}
        </Badge>
      </div>
      {open ? (
        <div className="mt-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Send this to me through {request.deliveryMethod}. Never paste keys
            or secrets into the portal. Once it is on its way, confirm below.
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={handleFulfil}
            disabled={pending}
            className="mt-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Confirming...' : 'I have sent it'}
          </Button>
        </div>
      ) : (
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          Fulfilled {formatTimestamp(request.fulfilledAt)}
        </p>
      )}
    </li>
  )
}

export function RequirementList({
  projectId,
  requests,
}: {
  projectId: string
  requests: WithId<RequirementRequestDoc>[]
}) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Nothing needed from you right now.
      </p>
    )
  }

  const sorted = [...requests].sort((a, b) => {
    if (a.status === b.status) return a.title.localeCompare(b.title)
    return a.status === 'open' ? -1 : 1
  })

  return (
    <ul className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
      {sorted.map((request) => (
        <RequirementRow
          key={request.id}
          projectId={projectId}
          request={request}
        />
      ))}
    </ul>
  )
}
