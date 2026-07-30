'use client'

import { Button } from '@/components/Button'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Badge } from '@/components/portal/Badge'
import { PortalSection } from '@/components/portal/PortalSection'
import { ClientAccountForm } from '@/components/portal/admin/ClientAccountForm'
import { usersCol } from '@/lib/portal/firestore'
import { useColSnapshot } from '@/lib/portal/hooks'

export default function AdminClientsPage() {
  const { data: users, error } = useColSnapshot(() => usersCol(), [])

  const sorted = [...(users ?? [])].sort((a, b) =>
    a.displayName.localeCompare(b.displayName),
  )

  return (
    <SimpleLayout
      title="Clients."
      intro="Everyone with an account. Creating one here is what lets a client sign in to their portal."
    >
      <div className="mb-12">
        <Button href="/portal/admin" variant="secondary">
          Back to projects
        </Button>
      </div>

      <PortalSection title="Accounts">
        {error ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Accounts failed to load.
          </p>
        ) : users === null ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading...
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-700/40">
            {sorted.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
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
      </PortalSection>

      <div className="mt-12">
        <PortalSection title="New client account">
          <ClientAccountForm />
        </PortalSection>
      </div>
    </SimpleLayout>
  )
}
