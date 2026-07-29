'use client'

import { signOut } from 'firebase/auth'

import { Button } from '@/components/Button'
import { auth } from '@/lib/firebase/client'

// No manual redirect: the auth state flips to signed-out and RequireAuth
// takes care of the navigation.
export function SignOutButton() {
  return (
    <Button variant="secondary" type="button" onClick={() => signOut(auth)}>
      Sign out
    </Button>
  )
}
