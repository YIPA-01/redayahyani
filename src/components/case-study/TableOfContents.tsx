'use client'

import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

import { variants } from '@/components/Signature'
import { useDisplay } from '@/lib/a11y/useDisplay'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

// Reads the h2 and h3 headings that rehype-slug gave ids to, straight from the
// rendered case study, so the contents can never drift from the MDX. The
// active entry is the last heading above a line 30% down the viewport, and
// progress is how far that line has travelled through the content.
function useHeadings(contentId: string) {
  let [headings, setHeadings] = useState<Array<Heading>>([])
  let [active, setActive] = useState<string | null>(null)
  let [progress, setProgress] = useState(0)

  useEffect(() => {
    let root = document.getElementById(contentId)
    if (!root) return
    let content = root
    let nodes = Array.from(root.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
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
      let box = content.getBoundingClientRect()
      setProgress(Math.min(1, Math.max(0, (line - box.top) / box.height)))
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

  return { headings, active, progress }
}

function Links({
  headings,
  active,
  onNavigate,
  itemClassName,
}: {
  headings: Array<Heading>
  active: string | null
  onNavigate?: () => void
  itemClassName?: (index: number) => {
    className: string
    style?: React.CSSProperties
  }
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
      {headings.map((heading, index) => {
        let current = heading.id === active
        let inSection = !current && heading.id === parent
        return (
          <li key={heading.id} {...itemClassName?.(index)}>
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

const LABEL = 'font-mono text-xs uppercase tracking-[0.08em] text-muted'

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

// The button's icon lives in the signature's own coordinates, so its open
// state is exactly the logo's Y hairline. Closed, it is two lines, the short
// one right-aligned under the long one; each line morphs into one of the Y's
// two segments, and both right ends meet at its top corner.
let [[ya, yb], [corner, cornerB], [yc, yd]] = (
  variants.compact.y.match(/\d+ \d+/g) ?? []
).map((point) => point.split(' ').map(Number))
const ICON_VIEWBOX = '311.5 377 400 400'
const TOP_CLOSED = 'M380 525 643 525'
const BOTTOM_CLOSED = 'M643 625 488 625'
const TOP_OPEN = `M${ya} ${yb} ${corner} ${cornerB}`
const BOTTOM_OPEN = `M${corner} ${cornerB} ${yc} ${yd}`

// Below xl: a round button in the bottom-right corner, within thumb reach on
// a phone, that appears once the reader reaches the case study body. Its coral
// ring fills with reading progress. Tapping it grows the contents out of the
// button (a clip-path circle) and the entries rise in one after another; at
// reduced or no Motion the panel just appears. It is a disclosure, not a
// modal: the page keeps scrolling and focus is not trapped.
export function TableOfContentsFloating({ contentId }: { contentId: string }) {
  let { headings, active, progress } = useHeadings(contentId)
  let animate = useDisplay().motion === 'full'
  let panelId = useId()

  let [visible, setVisible] = useState(false)
  let [open, setOpen] = useState(false)
  let wrapper = useRef<HTMLDivElement>(null)
  let panel = useRef<HTMLDivElement>(null)
  let button = useRef<HTMLButtonElement>(null)
  let topLine = useRef<SVGPathElement>(null)
  let bottomLine = useRef<SVGPathElement>(null)
  let morph = useRef<gsap.core.Timeline | null>(null)

  // Shown only while the body is on screen, so it never sits over the title
  // and cover.
  useEffect(() => {
    let root = document.getElementById(contentId)
    if (!root) return
    let observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [contentId])

  useEffect(() => {
    if (!visible) setOpen(false)
  }, [visible])

  // A closed panel is out of the tab order and the accessibility tree
  // (React 18 has no `inert` prop).
  useEffect(() => {
    panel.current?.toggleAttribute('inert', !open)
  }, [open, headings.length])

  // On open, focus lands on the current section, scrolled into view inside
  // the panel.
  useEffect(() => {
    if (!open || !panel.current) return
    let target =
      panel.current.querySelector<HTMLElement>('[aria-current]') ??
      panel.current.querySelector<HTMLElement>('a')
    target?.focus({ preventScroll: true })
    target?.scrollIntoView({ block: 'nearest' })
    // Only on opening, not on every change of the active section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Escape or a tap outside closes it.
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      button.current?.focus({ preventScroll: true })
    }
    function onPointer(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // The icon follows `open`, and nothing else touches the morph. Built once
  // the button exists, which is after the headings have been read.
  useEffect(() => {
    let top = topLine.current
    let bottom = bottomLine.current
    if (!top || !bottom) return
    if (!morph.current) {
      gsap.registerPlugin(MorphSVGPlugin)
      morph.current = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.45, ease: 'power3.inOut' },
        })
        .to(top, { morphSVG: TOP_OPEN }, 0)
        .to(bottom, { morphSVG: BOTTOM_OPEN }, 0)
    }
    if (animate) {
      if (open) morph.current.timeScale(1).play()
      else morph.current.timeScale(1.2).reverse()
    } else {
      morph.current.progress(open ? 1 : 0)
    }
  }, [open, animate, headings.length])

  useEffect(() => () => void morph.current?.kill(), [])

  if (headings.length === 0) return null

  return (
    <div
      ref={wrapper}
      data-open={open}
      className="group/toc fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30"
    >
      <div
        ref={panel}
        id={panelId}
        className={clsx(
          'absolute bottom-[calc(100%+0.75rem)] right-0 flex max-h-[60dvh] w-[min(20rem,calc(100vw-2rem))] flex-col gap-3 overflow-y-auto rounded-3xl bg-surface p-5 shadow-xl ring-1 ring-line',
          // The circle starts on the button's centre, just below the panel.
          '[clip-path:circle(0px_at_calc(100%-26px)_calc(100%+38px))] group-data-[open=true]/toc:[clip-path:circle(150%_at_calc(100%-26px)_calc(100%+38px))]',
          'invisible group-data-[open=true]/toc:visible',
          // Visible at once on opening, so focus can land in the panel; on
          // closing it stays painted until the circle has shrunk.
          animate &&
            '[transition:clip-path_300ms_ease-in,visibility_0s_300ms] group-data-[open=true]/toc:[transition:clip-path_500ms_cubic-bezier(0.2,0.8,0.2,1),visibility_0s]',
        )}
      >
        <p className={LABEL}>On this page</p>
        <Links
          headings={headings}
          active={active}
          onNavigate={() => setOpen(false)}
          itemClassName={(index) =>
            animate
              ? {
                  className:
                    'translate-y-1.5 opacity-0 transition duration-300 ease-out group-data-[open=true]/toc:translate-y-0 group-data-[open=true]/toc:opacity-100',
                  style: {
                    transitionDelay: open ? `${80 + index * 30}ms` : '0ms',
                  },
                }
              : { className: '' }
          }
        />
      </div>

      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close contents' : 'Contents'}
        onClick={() => setOpen((value) => !value)}
        className={clsx(
          'relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-ink text-canvas shadow-[0_8px_24px_-8px_rgba(0,0,0,.45)]',
          animate && 'transition duration-300 ease-out',
          visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0',
        )}
        tabIndex={visible ? undefined : -1}
      >
        {/* Reading progress */}
        <svg
          viewBox="0 0 52 52"
          aria-hidden="true"
          className="absolute inset-0 -rotate-90"
          fill="none"
        >
          <circle
            cx="26"
            cy="26"
            r="24.5"
            pathLength={1}
            strokeWidth="2"
            className="stroke-coral"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
          />
        </svg>
        <svg
          viewBox={ICON_VIEWBOX}
          aria-hidden="true"
          className="h-5 w-5 overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth={30}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path ref={topLine} d={TOP_CLOSED} />
          <path ref={bottomLine} d={BOTTOM_CLOSED} />
        </svg>
      </button>
    </div>
  )
}
