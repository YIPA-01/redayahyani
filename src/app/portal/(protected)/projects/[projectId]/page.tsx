'use client'

import Link from 'next/link'
import { orderBy, query } from 'firebase/firestore'

import { Badge } from '@/components/portal/Badge'
import { useProject } from '@/components/portal/ProjectProvider'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'
import { StatTile } from '@/components/portal/shell/StatTile'
import {
  milestonesCol,
  progressUpdatesCol,
  requirementRequestsCol,
} from '@/lib/portal/firestore'
import { formatDateOnly, formatTimestamp } from '@/lib/portal/format'
import { useColSnapshot } from '@/lib/portal/hooks'
import { projectStatusLabels } from '@/lib/portal/labels'

export default function ProjectOverviewPage() {
  const { projectId, project, profile } = useProject()
  const base = `/portal/projects/${projectId}`

  // The same queries the section pages use, so clicking through finds a warm
  // local cache.
  const { data: milestones } = useColSnapshot(
    () => query(milestonesCol(projectId), orderBy('dueDate', 'asc')),
    [projectId],
  )
  const { data: updates } = useColSnapshot(
    () => query(progressUpdatesCol(projectId), orderBy('createdAt', 'desc')),
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
  const latest = (updates ?? [])[0]

  return (
    <PortalPage>
      <PageHeader
        title={project.name}
        description="Where the work stands right now."
        actions={
          <>
            <Badge tone={project.status === 'active' ? 'teal' : 'zinc'}>
              {projectStatusLabels[project.status]}
            </Badge>
            {profile && <Badge tone="teal">{profile.phase}</Badge>}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Next milestone"
          value={nextMilestone ? nextMilestone.title : 'Nothing outstanding'}
          hint={
            nextMilestone ? `Due ${formatDateOnly(nextMilestone.dueDate)}` : undefined
          }
          href={`${base}/milestones`}
        />
        <StatTile
          label="Needed from you"
          value={
            openCount === 0
              ? 'Nothing right now'
              : `${openCount} open request${openCount === 1 ? '' : 's'}`
          }
          href={`${base}/requirements`}
        />
        <StatTile
          label="Last update"
          value={latest ? formatTimestamp(latest.createdAt) : 'No updates yet'}
          href={`${base}/progress`}
        />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          Latest update
        </h2>
        {updates === null ? (
          <div className="mt-3">
            <PortalLoading />
          </div>
        ) : latest ? (
          <>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {latest.body}
            </p>
            <Link
              href={`${base}/progress`}
              className="mt-4 inline-block text-sm font-medium text-teal-500 transition hover:text-teal-600 dark:hover:text-teal-400"
            >
              See the full log
            </Link>
          </>
        ) : (
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Nothing posted yet. I will write here as work lands.
          </p>
        )}
      </section>
    </PortalPage>
  )
}
