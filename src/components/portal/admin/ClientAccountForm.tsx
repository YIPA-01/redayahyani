'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { inputClasses } from '@/components/portal/fieldStyles'

// Account creation is the one operation the browser cannot do, so it goes
// through the authenticated API route. The new user appears in the list
// automatically: the route writes the /users doc and the admin's snapshot
// listener picks it up.
export function ClientAccountForm() {
  const { user } = usePortalAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<string | null>(null)

  if (!user) return null

  const valid =
    displayName.trim() && email.includes('@') && password.length >= 6

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid || !user) return
    setPending(true)
    setError(null)
    setCreated(null)
    try {
      const token = await user.getIdToken()
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          displayName: displayName.trim(),
          password,
        }),
      })
      if (response.status === 201) {
        setCreated(email)
        setDisplayName('')
        setEmail('')
        setPassword('')
      } else if (response.status === 409) {
        setError('That email already has an account.')
      } else if (response.status === 400) {
        setError(
          'Check the fields: a valid email and a password of at least 6 characters.',
        )
      } else {
        setError('That did not go through. Try again.')
      }
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Display name"
          aria-label="Display name"
          required
          className={inputClasses}
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          required
          className={inputClasses}
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Temporary password"
          aria-label="Temporary password"
          autoComplete="new-password"
          required
          className={inputClasses}
        />
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        At least 6 characters. Pass it to the client through whatever channel
        you already use with them, then they sign in at the portal.
      </p>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {created && (
        <p className="text-sm text-teal-500">
          Account created for {created}.
        </p>
      )}
      <Button
        type="submit"
        disabled={pending || !valid}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Creating...' : 'Create client account'}
      </Button>
    </form>
  )
}
