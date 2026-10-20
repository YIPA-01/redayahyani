import { Fragment } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

type MarqueeItem = { href: string; label: string }

function MarqueeSet({
  items,
  run,
  current,
  hidden = false,
  compact,
}: {
  items: Array<MarqueeItem>
  run: Array<MarqueeItem>
  current?: string
  hidden?: boolean
  compact: boolean
}) {
  return (
    <div
      className="flex flex-none items-center"
      aria-hidden={hidden || undefined}
    >
      {run.map((item, index) => {
        // Only the first copy of each link is reachable; the repeats exist
        // to fill the strip, so they stay out of the tab order and away from
        // assistive tech.
        let repeat = hidden || index >= items.length
        let active =
          current !== undefined &&
          (current === item.href || current.startsWith(`${item.href}/`))
        return (
          <Fragment key={index}>
            <Link
              href={item.href}
              tabIndex={repeat ? -1 : undefined}
              aria-hidden={repeat && !hidden ? true : undefined}
              aria-current={active && !repeat ? 'page' : undefined}
              className={clsx(
                'whitespace-nowrap font-mono uppercase tracking-[0.08em] transition hover:text-coral-text',
                compact
                  ? 'px-2.5 py-1 text-xs'
                  : 'px-3 py-2 text-[clamp(0.8125rem,1.6vw,1rem)]',
                active && 'text-coral-text',
              )}
            >
              {item.label}
            </Link>
            {/* The same divider after every item, seam included, so the loop
                reads as one even rhythm. */}
            <span className="px-1 font-mono text-muted">|</span>
          </Fragment>
        )
      })}
    </div>
  )
}

// A scrolling strip of links. Two copies slide left by half their width, so
// the loop is seamless. Pauses on hover or focus and holds still under
// reduced motion. The header uses the compact size as its navigation, with
// the current page in coral.
export function Marquee({
  items,
  label = 'Sections',
  current,
  compact = false,
  repeat = 3,
  paused = false,
  className,
}: {
  items: Array<MarqueeItem>
  label?: string
  current?: string
  compact?: boolean
  repeat?: number
  // Set by a visible pause control (WCAG 2.2.2); see the header.
  paused?: boolean
  className?: string
}) {
  let run = Array.from({ length: repeat }, () => items).flat()

  return (
    <nav
      aria-label={label}
      data-paused={paused || undefined}
      className={clsx(
        'group overflow-hidden border-ink [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        compact ? 'rounded-full border border-e trsnsparent' : 'rounded-xl border-[1.5px]',
        className,
      )}
    >
      <div
        className={clsx(
          'flex w-max animate-marquee group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none',
          compact && '[animation-duration:22s]',
        )}
      >
        <MarqueeSet
          items={items}
          run={run}
          current={current}
          compact={compact}
        />
        <MarqueeSet
          items={items}
          run={run}
          current={current}
          compact={compact}
          hidden
        />
      </div>
    </nav>
  )
}
