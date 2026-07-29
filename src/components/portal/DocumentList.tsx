import { formatTimestamp } from '@/lib/portal/format'
import type { WithId } from '@/lib/portal/firestore'
import type { DocumentDoc } from '@/lib/portal/types'

export function DocumentList({
  documents,
}: {
  documents: WithId<DocumentDoc>[]
}) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No documents yet.
      </p>
    )
  }

  return (
    <div>
      <ul className="space-y-3">
        {documents.map((document) => (
          <li key={document.id} className="flex items-baseline justify-between gap-4">
            <p className="font-medium text-zinc-800 dark:text-zinc-100">
              {document.title}
            </p>
            <p className="shrink-0 text-sm text-zinc-400 dark:text-zinc-500">
              {formatTimestamp(document.uploadedAt)}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
        Downloads arrive in a later phase. Ask me directly if you need a file
        now.
      </p>
    </div>
  )
}
