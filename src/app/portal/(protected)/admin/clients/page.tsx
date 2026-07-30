'use client'

import { Badge } from '@/components/portal/Badge'
import { PortalSection } from '@/components/portal/PortalSection'
import { usePortalData } from '@/components/portal/PortalDataProvider'
import { ClientAccountForm } from '@/components/portal/admin/ClientAccountForm'
import { PageHeader } from '@/components/portal/shell/PageHeader'
import { PortalPage } from '@/components/portal/shell/PortalPage'
import { PortalLoading } from '@/components/portal/shell/PortalStatus'

export default function AdminClientsPage() {
  const { users } = usePortalData()

  const sorted = [...(users ?? [])].sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  )

  return (
    <PortalPage>
      <PageHeader
        title="Clients"
        description="Everyone with an account. Creating one here is what lets a client sign in to their portal."
      />

      {users === null ? (
        <PortalLoading />
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
          {sorted.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  {user.displayName}
                </p>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  {user.email}
                </p>
              </div>
              <Badge tone={user.role === 'admin' ? 'teal' : 'zinc'}>
                {user.role === 'admin' ? 'Admin' : 'Client'}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12">
        <PortalSection title="New client account">
          <ClientAccountForm />
        </PortalSection>
      </div>
    </PortalPage>
  )
}
