'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { auth } from '@/lib/firebase/client'

const inputClasses =
  'w-full min-w-0 appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10'

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

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="mx-auto max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Sign in to the project portal.
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          This is the private area for my clients. Sign in with the email and
          password I set up for you.
        </p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
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
      </div>
    </Container>
  )
}
