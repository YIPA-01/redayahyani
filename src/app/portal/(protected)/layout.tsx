import { PortalDataProvider } from '@/components/portal/PortalDataProvider'
import { RequireAuth } from '@/components/portal/RequireAuth'
import { PortalShell } from '@/components/portal/shell/PortalShell'

export default function ProtectedPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <PortalDataProvider>
        <PortalShell>{children}</PortalShell>
      </PortalDataProvider>
    </RequireAuth>
  )
}
