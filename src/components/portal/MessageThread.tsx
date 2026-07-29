'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/Button'
import { usePortalAuth } from '@/components/portal/PortalAuthProvider'
import { sendMessage } from '@/lib/portal/firestore'
import { formatTimestampTime } from '@/lib/portal/format'
import type { WithId } from '@/lib/portal/firestore'
import type { MessageDoc } from '@/lib/portal/types'

const textareaClasses =
  'w-full min-w-0 resize-none appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10'

export function MessageThread({
  projectId,
  messages,
}: {
  projectId: string
  messages: WithId<MessageDoc>[]
}) {
  const { user } = usePortalAuth()
  const [body, setBody] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages.length])

  if (!user) return null

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = body.trim()
    if (!trimmed || !user) return
    setPending(true)
    setError(null)
    try {
      await sendMessage(projectId, user.uid, trimmed)
      setBody('')
    } catch {
      setError('The message did not send. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      {messages.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No messages yet. Say hello.
        </p>
      ) : (
        <ol className="max-h-96 space-y-4 overflow-y-auto">
          {messages.map((message) => {
            const own = message.senderId === user.uid
            return (
              <li
                key={message.id}
                className={own ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={
                    own
                      ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-teal-50 px-4 py-2 dark:bg-teal-400/10'
                      : 'max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-50 px-4 py-2 dark:bg-zinc-800/50'
                  }
                >
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {/* The counterparty is always me for now. Multi-member
                        client teams need sender name resolution, blocked
                        today because rules only allow reading your own
                        users doc. Revisit with the admin phase. */}
                    {own ? 'You' : 'Reda'}
                  </p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {message.body}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {formatTimestampTime(message.createdAt)}
                  </p>
                </div>
              </li>
            )
          })}
          <div ref={bottomRef} />
        </ol>
      )}
      <form onSubmit={handleSend} className="mt-6">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write a message"
          aria-label="Write a message"
          rows={3}
          className={textareaClasses}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={pending || body.trim().length === 0}
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  )
}
