'use client'

import { orderBy, query } from 'firebase/firestore'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Badge } from '@/components/portal/Badge'
import { DocumentList } from '@/components/portal/DocumentList'
import { MessageThread } from '@/components/portal/MessageThread'
import { PortalSection } from '@/components/portal/PortalSection'
import { ProgressLog } from '@/components/portal/ProgressLog'
import { selectClasses } from '@/components/portal/fieldStyles'
import { AdminMilestoneList } from '@/components/portal/admin/AdminMilestoneList'
import { MemberManager } from '@/components/portal/admin/MemberManager'
import { MilestoneForm } from '@/components/portal/admin/MilestoneForm'
import { ProgressUpdateForm } from '@/components/portal/admin/ProgressUpdateForm'
import { PublicProfileForm } from '@/components/portal/admin/PublicProfileForm'
import { PublicUpdateForm } from '@/components/portal/admin/PublicUpdateForm'
import { RequirementAdminList } from '@/components/portal/admin/RequirementAdminList'
import { RequirementForm } from '@/components/portal/admin/RequirementForm'
import {
  documentsCol,
  messagesCol,
  milestonesCol,
  progressUpdatesCol,
  projectRef,
  publicProfileRef,
  publicUpdatesCol,
  requirementRequestsCol,
  updateProjectStatus,
  usersCol,
} from '@/lib/portal/firestore'
import { useColSnapshot, useDocSnapshot } from '@/lib/portal/hooks'
import type { ProjectStatus } from '@/lib/portal/types'

const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
}

export default function AdminProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const { projectId } = params

  const { data: project, error: projectError } = useDocSnapshot(
    () => projectRef(projectId),
    [projectId],
  )

  // Subcollection listeners start only once the project doc read succeeds.
  const ready = Boolean(project)

  const { data: users } = useColSnapshot(() => usersCol(), [])
  const { data: profile } = useDocSnapshot(
    () => (ready ? publicProfileRef(projectId) : null),
    [projectId, ready],
  )
  const { data: publicUpdates } = useColSnapshot(
    () =>
      ready
        ? query(publicUpdatesCol(projectId), orderBy('publishedAt', 'desc'))
        : null,
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
          That project could not be loaded.
        </h1>
        <div className="mt-6">
          <Button href="/portal/admin" variant="secondary">
            Back to admin
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
          <Button href="/portal/admin" variant="secondary">
            Back to admin
          </Button>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {project.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <select
              value={project.status}
              onChange={(event) =>
                updateProjectStatus(
                  projectId,
                  event.target.value as ProjectStatus,
                )
              }
              aria-label="Project status"
              className={selectClasses}
            >
              {(
                Object.keys(statusLabels) as ProjectStatus[]
              ).map((value) => (
                <option key={value} value={value}>
                  {statusLabels[value]}
                </option>
              ))}
            </select>
            {profile && <Badge tone="teal">{profile.phase}</Badge>}
          </div>
        </header>

        <div className="mt-12">
          <PortalSection title="Members">
            <MemberManager
              projectId={projectId}
              project={{ ...project, id: projectId }}
              users={users ?? []}
            />
          </PortalSection>

          <PortalSection title="Milestones">
            {milestones === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <AdminMilestoneList
                projectId={projectId}
                milestones={milestones}
              />
            )}
            <MilestoneForm projectId={projectId} />
          </PortalSection>

          <PortalSection title="Progress log">
            {progressUpdates === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <ProgressLog updates={progressUpdates} />
            )}
            <ProgressUpdateForm projectId={projectId} />
          </PortalSection>

          <PortalSection title="Requirements">
            {requirements === null ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Loading...
              </p>
            ) : (
              <RequirementAdminList
                projectId={projectId}
                requests={requirements}
              />
            )}
            <RequirementForm projectId={projectId} />
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

          <PortalSection title="Public face">
            <PublicProfileForm projectId={projectId} profile={profile} />
            <PublicUpdateForm
              projectId={projectId}
              updates={publicUpdates ?? []}
            />
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
