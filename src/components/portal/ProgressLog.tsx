import { formatTimestamp } from '@/lib/portal/format'
import type { WithId } from '@/lib/portal/firestore'
import type { ProgressUpdateDoc } from '@/lib/portal/types'

export function ProgressLog({
  updates,
}: {
  updates: WithId<ProgressUpdateDoc>[]
}) {
  if (updates.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No progress updates yet.
      </p>
    )
  }

  return (
    <ol className="space-y-6">
      {updates.map((update) => (
        <li key={update.id}>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {formatTimestamp(update.createdAt)}
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {update.body}
          </p>
        </li>
      ))}
    </ol>
  )
}
