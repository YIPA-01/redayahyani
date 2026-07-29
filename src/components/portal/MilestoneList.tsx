import { Badge } from '@/components/portal/Badge'
import { formatTimestamp } from '@/lib/portal/format'
import type { WithId } from '@/lib/portal/firestore'
import type { MilestoneDoc, MilestoneStatus } from '@/lib/portal/types'

const statusLabels: Record<MilestoneStatus, string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
}

export function MilestoneList({
  milestones,
}: {
  milestones: WithId<MilestoneDoc>[]
}) {
  if (milestones.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No milestones yet.
      </p>
    )
  }

  return (
    <ol className="space-y-6">
      {milestones.map((milestone) => (
        <li key={milestone.id} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
          <p className="w-24 shrink-0 text-sm font-medium text-teal-500">
            {milestone.label}
          </p>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-zinc-800 dark:text-zinc-100">
                {milestone.title}
              </p>
              <Badge tone={milestone.status === 'in_progress' ? 'teal' : 'zinc'}>
                {statusLabels[milestone.status]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {milestone.description}
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Due {formatTimestamp(milestone.dueDate)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
