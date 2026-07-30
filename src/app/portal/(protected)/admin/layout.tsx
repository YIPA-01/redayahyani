import { RequireAdmin } from '@/components/portal/RequireAdmin'

// The admin-wide collections (all projects, all users) are loaded by
// PortalDataProvider above the shell, because the top bar's project switcher
// needs them too.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAdmin>{children}</RequireAdmin>
}
