// Display labels for the schema's status vocabularies. Shared so the client
// and admin views cannot drift apart.

import type { MilestoneStatus, ProjectStatus } from '@/lib/portal/types'

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
}

export const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
}
