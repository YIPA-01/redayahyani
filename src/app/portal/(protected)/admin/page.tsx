'use client'

import { Card } from '@/components/Card'
import { Badge } from '@/components/portal/Badge'
import { PortalSection } from '@/components/portal/PortalSection'
import { usePortalData } from '@/components/portal/PortalDataProvider'
import { ProjectForm } from '@/components/portal/admin/ProjectForm'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalEmpty, PortalLoading } from '@/components/portal/shell/PortalStatus'
import { projectStatusLabels } from '@/lib/portal/labels'

export default function AdminHomePage() {
  const { allProjects: projects, allProjectsError: error, users } = usePortalData()

  return (
    <PortalPage>
      <PageHeader
        title="Projects"
        description="Every project, including ones I am not a member of. This is where I run the work clients see from their side."
      />

      {error ? (
        <PortalEmpty>Projects failed to load.</PortalEmpty>
      ) : projects === null ? (
        <PortalLoading />
      ) : projects.length === 0 ? (
        <PortalEmpty>No projects yet. Create the first one below.</PortalEmpty>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
          {projects.map((project) => (
            <Card as="li" key={project.id}>
              <Card.Eyebrow>
                <span className="relative z-10">
                  <Badge tone={project.status === 'active' ? 'teal' : 'zinc'}>
                    {projectStatusLabels[project.status]}
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
    </PortalPage>
  )
}
