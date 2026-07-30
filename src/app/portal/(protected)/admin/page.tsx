'use client'

import { orderBy, query } from 'firebase/firestore'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Badge } from '@/components/portal/Badge'
import { PortalSection } from '@/components/portal/PortalSection'
import { ProjectForm } from '@/components/portal/admin/ProjectForm'
import { projectsCol, usersCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'
import type { ProjectStatus } from '@/lib/portal/types'

const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
}

export default function AdminHomePage() {
  // No member filter: the rules let an admin list every project.
  const { data: projects, error } = useColSnapshot(
    () => query(projectsCol(), orderBy('createdAt', 'desc')),
    [],
  )
  const { data: users } = useColSnapshot(() => usersCol(), [])

  return (
    <SimpleLayout
      title="Admin."
      intro="Every project and every client, in one place. This is where I run the work that clients see from their side."
    >
      <div className="mb-12">
        <Button href="/portal/admin/clients" variant="secondary">
          Manage clients
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Projects failed to load.
        </p>
      ) : projects === null ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No projects yet. Create the first one below.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2">
          {projects.map((project) => (
            <Card as="li" key={project.id}>
              <Card.Eyebrow>
                <span className="relative z-10">
                  <Badge tone={project.status === 'active' ? 'teal' : 'zinc'}>
                    {statusLabels[project.status]}
                  </Badge>
                </span>
              </Card.Eyebrow>
              <Card.Title href={`/portal/admin/projects/${project.id}`}>
                {project.name}
              </Card.Title>
              <Card.Description>
                {project.memberUids.length === 0
                  ? 'No members yet, so no client can see it.'
                  : `${project.memberUids.length} member${project.memberUids.length === 1 ? '' : 's'}.`}
              </Card.Description>
              <Card.Cta>Manage project</Card.Cta>
            </Card>
          ))}
        </ul>
      )}

      <div className="mt-16">
        <PortalSection title="New project">
          <ProjectForm users={users ?? []} />
        </PortalSection>
      </div>
    </SimpleLayout>
  )
}
