import { RequireAdmin } from '@/components/portal/RequireAdmin'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAdmin>{children}</RequireAdmin>
}
