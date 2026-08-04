'use client'

import { useState } from 'react'
import Link from 'next/link'

import { LinkedInIcon, XIcon } from '@/components/SocialIcons'

function CopyIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 4.75h8.5a1.75 1.75 0 0 1 1.75 1.75v8.5M6.5 8.75h8.75a1.75 1.75 0 0 1 1.75 1.75v7A1.75 1.75 0 0 1 15.25 19.25h-8.75A1.75 1.75 0 0 1 4.75 17.5v-7A1.75 1.75 0 0 1 6.5 8.75Z" />
    </svg>
  )
}

const buttonClasses =
  'group flex items-center gap-2 rounded-full bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-600 ring-1 ring-zinc-900/5 transition hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'

/**
 * LinkedIn and X read the page's Open Graph tags rather than any title passed
 * on the query string, so only the URL is sent. LinkedIn also caches a preview
 * per URL for a long time: after deploying, run the URL through LinkedIn's
 * Post Inspector once to force it to refetch.
 */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be denied. The two share links still work, so
      // there is nothing useful to tell the reader here.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-zinc-400 dark:text-zinc-500">Share</span>
      <Link
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        <LinkedInIcon className="h-4 w-4 fill-current" />
        LinkedIn
      </Link>
      <Link
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        <XIcon className="h-4 w-4 fill-current" />
        X
      </Link>
      <button type="button" onClick={copy} className={buttonClasses}>
        <CopyIcon className="h-4 w-4" />
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
