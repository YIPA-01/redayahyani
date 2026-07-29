import { PortalToolbar } from '@/components/portal/PortalToolbar'
import { RequireAuth } from '@/components/portal/RequireAuth'

export default function ProtectedPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <PortalToolbar />
      {children}
    </RequireAuth>
  )
}
