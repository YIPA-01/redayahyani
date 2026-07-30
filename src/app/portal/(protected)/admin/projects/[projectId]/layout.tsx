import { ProjectProvider } from '@/components/portal/ProjectProvider'

// Same provider as the client side, different copy and back link. The admin
// reads every project through the admin claim, so a failure here means the
// project is gone rather than forbidden.
export default function AdminProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  return (
    <ProjectProvider
      projectId={params.projectId}
      deniedTitle="That project could not be loaded."
      backHref="/portal/admin"
      backLabel="Back to admin"
    >
      {children}
    </ProjectProvider>
  )
}
