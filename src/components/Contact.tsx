'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

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
  let messageRef = useRef<HTMLTextAreaElement>(null)
  let trimmedMessage = message.trim()

  // Every "Start a project" link points at /services#contact, so arriving
  // there puts the cursor straight in the message. Two ways in: a page load or
  // navigation that lands with the hash (mount), and a click while already on
  // /services, where the router updates the hash with pushState and no
  // hashchange fires (the click listener). preventScroll leaves the scroll to
  // the hash, which respects the section's scroll margin under the header.
  useEffect(() => {
    let frame = 0
    let focusIfContact = () => {
      if (window.location.hash === '#contact') {
        messageRef.current?.focus({ preventScroll: true })
      }
    }
    let onClick = (event: MouseEvent) => {
      let link = (event.target as Element | null)?.closest('a[href]')
      if (!(link instanceof HTMLAnchorElement)) return
      let url = new URL(link.href)
      if (url.hash !== '#contact' || url.pathname !== window.location.pathname)
        return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(focusIfContact)
    }

    focusIfContact()
    window.addEventListener('hashchange', focusIfContact)
    document.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', focusIfContact)
      document.removeEventListener('click', onClick)
    }
  }, [])
  let sendDisabled = trimmedMessage.length === 0

  function sendViaWhatsApp() {
    let url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      trimmedMessage,
    )}`
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
          ref={messageRef}
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Your message"
          aria-label="Your message"
          rows={4}
          required
          className="w-full min-w-0 resize-none appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-2 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-accent-400 dark:focus:ring-accent-400/10"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
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
            {/* Visible words, not just a logo: clearer for everyone, and the
                button's name for screen readers. */}
            Send on WhatsApp
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
            Send by email
          </Button>
        </div>
      </div>
    </div>
  )
}
