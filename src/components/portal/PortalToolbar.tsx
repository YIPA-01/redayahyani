'use client'

import Link from 'next/link'

import { Container } from '@/components/Container'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { SignOutButton } from '@/components/portal/SignOutButton'

export function PortalToolbar() {
  const { status, user, isAdmin } = usePortalAuth()

  // Defensive: the gate already guarantees signed-in here.
  if (status !== 'signed-in') return null

  return (
    <Container className="mt-8">
      <div className="flex items-center justify-end gap-4">
        {isAdmin === true && (
          <Link
            href="/portal/admin"
            className="text-sm font-medium text-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
          >
            Admin
          </Link>
        )}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Signed in as {user.email}
        </p>
        <SignOutButton />
      </div>
    </Container>
  )
}
