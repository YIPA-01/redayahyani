'use client'

import { Container } from '@/components/Container'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { SignOutButton } from '@/components/portal/SignOutButton'

export function PortalToolbar() {
  const { status, user } = usePortalAuth()

  // Defensive: the gate already guarantees signed-in here.
  if (status !== 'signed-in') return null

  return (
    <Container className="mt-8">
      <div className="flex items-center justify-end gap-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Signed in as {user.email}
        </p>
        <SignOutButton />
      </div>
    </Container>
  )
}
