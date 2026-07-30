'use client'

// Client-side gate for the protected portal segment. UX only: the real
// security boundary is firestore.rules. Children never mount before the
// auth state resolves to signed-in, so protected content cannot flash.
//
// This renders before the shell exists, so it fills the viewport itself.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { FullPageStatus } from '@/components/portal/shell/PortalStatus'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = usePortalAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'signed-out') {
      router.replace('/portal/sign-in')
    }
  }, [status, router])

  if (status !== 'signed-in') {
    return (
      <FullPageStatus>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {status === 'loading'
            ? 'Checking your session...'
            : 'Taking you to sign in...'}
        </p>
      </FullPageStatus>
    )
  }

  return <>{children}</>
}
