'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

// Reads the h2 and h3 headings that rehype-slug gave ids to, straight from the
// rendered case study, so the contents can never drift from the MDX. The
// active entry is the last heading above a line 30% down the viewport.
function useHeadings(contentId: string) {
  let [headings, setHeadings] = useState<Array<Heading>>([])
  let [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let root = document.getElementById(contentId)
    if (!root) return
    let nodes = Array.from(
      root.querySelectorAll<HTMLElement>('h2[id], h3[id]'),
    )
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent ?? '',
        level: node.tagName === 'H2' ? 2 : 3,
      })),
    )

    let frame = 0
    let update = () => {
      frame = 0
      let line = window.innerHeight * 0.3
      let current: string | null = null
      for (let node of nodes) {
        if (node.getBoundingClientRect().top > line) break
        current = node.id
      }
      setActive(current)
    }
    let schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [contentId])

  return { headings, active }
}

function Links({
  headings,
  active,
  onNavigate,
}: {
  headings: Array<Heading>
  active: string | null
  onNavigate?: () => void
}) {
  // When a subsection is active, its section reads as current too (in ink,
  // without the coral marker), so the reader keeps their place in the outline.
  let parent: string | undefined
  for (let heading of headings) {
    if (heading.level === 2) parent = heading.id
    if (heading.id === active) break
  }
  if (!active) parent = undefined

  return (
    <ol className="flex flex-col">
      {headings.map((heading) => {
        let current = heading.id === active
        let inSection = !current && heading.id === parent
        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={onNavigate}
              aria-current={current ? 'location' : undefined}
              className={clsx(
                'block border-l-2 py-1.5 pr-2 text-sm leading-snug transition',
                heading.level === 3 ? 'pl-7' : 'pl-4',
                current
                  ? 'border-coral text-ink'
                  : inSection
                    ? 'border-line text-ink'
                    : 'border-line text-muted hover:border-muted hover:text-ink',
              )}
            >
              {heading.text}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

const LABEL =
  'font-mono text-xs uppercase tracking-[0.08em] text-muted'

// Sticky rail beside the case study, for wide screens.
export function TableOfContentsRail({ contentId }: { contentId: string }) {
  let { headings, active } = useHeadings(contentId)
  if (headings.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 flex max-h-[calc(100vh-9rem)] flex-col gap-4 overflow-y-auto pb-4"
    >
      <p className={LABEL}>On this page</p>
      <Links headings={headings} active={active} />
    </nav>
  )
}

// Collapsible contents above the case study, for phones and tablets.
export function TableOfContentsInline({ contentId }: { contentId: string }) {
  let { headings, active } = useHeadings(contentId)
  let details = useRef<HTMLDetailsElement>(null)
  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page" className="mt-8">
      <details
        ref={details}
        className="group rounded-xl border border-line bg-surface"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span className={LABEL}>On this page</span>
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="h-4 w-4 stroke-muted transition group-open:rotate-180"
            fill="none"
          >
            <path
              d="M4 6.5 8 10l4-3.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <div className="px-4 pb-4">
          <Links
            headings={headings}
            active={active}
            onNavigate={() => details.current?.removeAttribute('open')}
          />
        </div>
      </details>
    </nav>
  )
}
