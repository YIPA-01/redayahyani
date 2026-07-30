'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { inputClasses } from '@/components/portal/fieldStyles'
import { addRequirement } from '@/lib/portal/firestore'

export function RequirementForm({ projectId }: { projectId: string }) {
  const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = type.trim() && title.trim() && deliveryMethod.trim()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid) return
    setPending(true)
    setError(null)
    try {
      await addRequirement(projectId, {
        type: type.trim(),
        title: title.trim(),
        deliveryMethod: deliveryMethod.trim(),
      })
      setType('')
      setTitle('')
      setDeliveryMethod('')
    } catch {
      setError('That did not go through. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-zinc-100 pt-6 dark:border-zinc-700/40">
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
        Request something from the client
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          type="text"
          value={type}
          onChange={(event) => setType(event.target.value)}
          placeholder="Type (e.g. api_key)"
          aria-label="Requirement type"
          required
          className={inputClasses}
        />
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          aria-label="Requirement title"
          required
          className={inputClasses}
        />
        <input
          type="text"
          value={deliveryMethod}
          onChange={(event) => setDeliveryMethod(event.target.value)}
          placeholder="Delivery method"
          aria-label="Delivery method"
          required
          className={inputClasses}
        />
      </div>
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        The delivery method is the out-of-band channel the client should use.
        The portal never carries the secret itself.
      </p>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <Button
        type="submit"
        disabled={pending || !valid}
        className="disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Creating...' : 'Create request'}
      </Button>
    </form>
  )
}
