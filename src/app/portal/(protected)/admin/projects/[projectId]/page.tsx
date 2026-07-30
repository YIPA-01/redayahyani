'use client'

import { orderBy, query } from 'firebase/firestore'

import { Badge } from '@/components/portal/Badge'
import { useProject } from '@/components/portal/ProjectProvider'
import { selectClasses } from '@/components/portal/fieldStyles'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { StatTile } from '@/components/portal/shell/StatTile'
import {
  milestonesCol,
  requirementRequestsCol,
  updateProjectStatus,
} from '@/lib/portal/firestore'
import { formatDateOnly } from '@/lib/portal/format'
import { useColSnapshot } from '@/lib/portal/hooks'
import { projectStatusLabels } from '@/lib/portal/labels'
import type { ProjectStatus } from '@/lib/portal/types'

export default function AdminProjectOverviewPage() {
  const { projectId, project, profile } = useProject()
  const base = `/portal/admin/projects/${projectId}`

  const { data: milestones } = useColSnapshot(
    () => query(milestonesCol(projectId), orderBy('dueDate', 'asc')),
    [projectId],
  )
  const { data: requirements } = useColSnapshot(
    () => requirementRequestsCol(projectId),
    [projectId],
  )

  const nextMilestone = (milestones ?? []).find((m) => m.status !== 'done')
  const openCount = (requirements ?? []).filter(
    (r) => r.status === 'open',
  ).length

  return (
    <PortalPage>
      <PageHeader
        title={project.name}
        description="Status, and the shortcuts into everything this project holds."
        actions={profile && <Badge tone="teal">{profile.phase}</Badge>}
      />

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="project-status"
          className="text-sm text-zinc-600 dark:text-zinc-400"
        >
          Status
        </label>
        <select
          id="project-status"
          value={project.status}
          onChange={(event) =>
            updateProjectStatus(projectId, event.target.value as ProjectStatus)
          }
          className={selectClasses}
        >
          {(Object.keys(projectStatusLabels) as ProjectStatus[]).map(
            (value) => (
              <option key={value} value={value}>
                {projectStatusLabels[value]}
              </option>
            ),
          )}
        </select>
        {!profile && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            No public face yet.
          </span>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Next milestone"
          value={nextMilestone ? nextMilestone.title : 'Nothing outstanding'}
          hint={
            nextMilestone
              ? `Due ${formatDateOnly(nextMilestone.dueDate)}`
              : undefined
          }
          href={`${base}/milestones`}
        />
        <StatTile
          label="Waiting on the client"
          value={
            openCount === 0
              ? 'Nothing open'
              : `${openCount} open request${openCount === 1 ? '' : 's'}`
          }
          href={`${base}/requirements`}
        />
        <StatTile
          label="Members"
          value={
            project.memberUids.length === 0
              ? 'No members yet'
              : `${project.memberUids.length} member${project.memberUids.length === 1 ? '' : 's'}`
          }
          hint={
            project.memberUids.length === 0
              ? 'No client can see this project'
              : undefined
          }
          href={`${base}/members`}
        />
      </div>
    </PortalPage>
  )
}
