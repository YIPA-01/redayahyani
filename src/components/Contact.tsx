'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/Button'

const WHATSAPP_NUMBER = '212621995530'
const EMAIL_ADDRESS = 'yahyanireda@gmail.com'

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

export function Contact() {
  let [message, setMessage] = useState('')
  let trimmedMessage = message.trim()
  let sendDisabled = trimmedMessage.length === 0

  function sendViaWhatsApp() {
    let url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(trimmedMessage)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function sendViaEmail() {
    let subject = encodeURIComponent('Message from your website')
    let body = encodeURIComponent(trimmedMessage)
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`
  }

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Get in touch</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Write a message and send it straight to me, via WhatsApp or email.
      </p>
      <div className="mt-6">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Your message"
          aria-label="Your message"
          rows={4}
          required
          className="w-full min-w-0 resize-none appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
        />
        <div className="mt-4 flex gap-3">
          <Button
            type="button"
            onClick={sendViaWhatsApp}
            disabled={sendDisabled}
            className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src="/whatsap.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 flex-none"
            />
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={sendViaEmail}
            disabled={sendDisabled}
            className="flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src="/mail.svg"
              alt=""
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 flex-none"
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
