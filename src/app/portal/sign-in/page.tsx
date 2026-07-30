'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'

import Link from 'next/link'

import { Button } from '@/components/Button'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { inputClasses } from '@/components/portal/fieldStyles'
import { auth } from '@/lib/firebase/client'

const badCredentialCodes = new Set([
  'auth/invalid-credential',
  'auth/wrong-password',
  'auth/user-not-found',
  'auth/invalid-email',
])

export default function SignInPage() {
  const { status } = usePortalAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handles already-signed-in visits and doubles as the post-sign-in
  // navigation: the auth state flips and this effect fires.
  useEffect(() => {
    if (status === 'signed-in') {
      router.replace('/portal')
    }
  }, [status, router])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      if (err instanceof FirebaseError && badCredentialCodes.has(err.code)) {
        setError('That email and password combination did not work.')
      } else {
        setError('Sign in failed. Try again.')
      }
      setPending(false)
    }
  }

  // Standalone: there is no site header here, so the card carries its own
  // way back out to the site.
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          Sign in to the project portal.
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          This is the private area for my clients. Sign in with the email and
          password I set up for you.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            aria-label="Email address"
            autoComplete="email"
            required
            className={inputClasses}
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            required
            className={inputClasses}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <Button
            type="submit"
            disabled={pending}
            className="w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-zinc-500 transition hover:text-teal-500 dark:text-zinc-400 dark:hover:text-teal-400"
        >
          Back to the site
        </Link>
      </div>
    </div>
  )
}
