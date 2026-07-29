'use client'

import { orderBy, query } from 'firebase/firestore'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Badge } from '@/components/portal/Badge'
import { DocumentList } from '@/components/portal/DocumentList'
import { MessageThread } from '@/components/portal/MessageThread'
import { MilestoneList } from '@/components/portal/MilestoneList'
import { PortalSection } from '@/components/portal/PortalSection'
import { ProgressLog } from '@/components/portal/ProgressLog'
import { RequirementList } from '@/components/portal/RequirementList'
import {
  documentsCol,
  messagesCol,
  milestonesCol,
  progressUpdatesCol,
  projectRef,
  publicProfileRef,
  requirementRequestsCol,
} from '@/lib/portal/firestore'
import { useColSnapshot, useDocSnapshot } from '@/lib/portal/hooks'
import type { ProjectStatus } from '@/lib/portal/types'

const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
}

export default function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const { projectId } = params

  const { data: project, error: projectError } = useDocSnapshot(
    () => projectRef(projectId),
    [projectId],
  )

  // Subcollection listeners start only once the project doc read succeeds,
  // so a non-member gets one clean permission error instead of seven.
  const ready = Boolean(project)

  const { data: profile } = useDocSnapshot(
    () => (ready ? publicProfileRef(projectId) : null),
    [projectId, ready],
  )
  const { data: milestones } = useColSnapshot(
    () =>
      ready ? query(milestonesCol(projectId), orderBy('dueDate', 'asc')) : null,
    [projectId, ready],
  )
  const { data: progressUpdates } = useColSnapshot(
    () =>
      ready
        ? query(progressUpdatesCol(projectId), orderBy('createdAt', 'desc'))
        : null,
    [projectId, ready],
  )
  const { data: documents } = useColSnapshot(
    () =>
      ready
        ? query(documentsCol(projectId), orderBy('uploadedAt', 'desc'))
        : null,
    [projectId, ready],
  )
  const { data: messages } = useColSnapshot(
    () =>
      ready ? query(messagesCol(projectId), orderBy('createdAt', 'asc')) : null,
    [projectId, ready],
  )
  const { data: requirements } = useColSnapshot(
    () => (ready ? requirementRequestsCol(projectId) : null),
    [projectId, ready],
  )

  if (projectError || project === null) {
    return (
      <Container className="mt-16 sm:mt-32">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
          You do not have access to this project.
        </h1>
        <div className="mt-6">
          <Button href="/portal" variant="secondary">
            Back to your portal
          </Button>
        </div>
      </Container>
    )
  }

  if (project === undefined) {
    return (
      <Container className="mt-16 sm:mt-32">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </Container>
    )
  }

  return (
    <Container className="mt-16 sm:mt-24">
      <div className="mx-auto max-w-2xl lg:max-w-3xl">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {project.name}
          </h1>
          <div className="mt-4 flex items-center gap-2">
            <Badge tone={project.status === 'active' ? 'teal' : 'zinc'}>
              {statusLabels[project.status]}
            </Badge>
            {profile && <Badge tone="teal">{profile.phase}</Badge>}
          </div>
        </header>

        <div className="mt-12">
          <PortalSection title="Milestones">
            {milestones === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <MilestoneList milestones={milestones} />
            )}
          </PortalSection>

          <PortalSection title="Progress log">
            {progressUpdates === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <ProgressLog updates={progressUpdates} />
            )}
          </PortalSection>

          <PortalSection title="Documents">
            {documents === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <DocumentList documents={documents} />
            )}
          </PortalSection>

          <PortalSection title="What I need from you">
            {requirements === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <RequirementList projectId={projectId} requests={requirements} />
            )}
          </PortalSection>

          <PortalSection title="Messages">
            {messages === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <MessageThread projectId={projectId} messages={messages} />
            )}
          </PortalSection>
        </div>
      </div>
    </Container>
  )
}
