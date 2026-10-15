'use client'

import { useRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

// An outlined pill that fills on hover the way gsap.com's "Get GSAP" button
// does: the fill grows as a circle from the exact point where the pointer
// entered, and drains back toward the point where it left. The ease is long
// and soft so the fill pours rather than snaps.
//
// The inverted label is a second copy inside the fill, clipped to the same
// circle, so the text changes colour exactly along the fill's edge and is
// readable at every frame. Keyboard focus fills from the centre. Reduced
// motion switches instantly.

// circle() percentages are relative to the box diagonal divided by sqrt(2),
// so 150% always reaches the far corner from any starting point.
const FULL = 150

function clamp(percent: number) {
  return Math.min(100, Math.max(0, percent))
}

export function FillButton({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  let fillRef = useRef<HTMLSpanElement>(null)

  // Place the fill's origin at the pointer, in percent of the button.
  function origin(event: React.PointerEvent | null) {
    let fill = fillRef.current
    if (!fill) return
    let x = 50
    let y = 50
    if (event) {
      let rect = event.currentTarget.getBoundingClientRect()
      // Clamped to the edge: a fast flick can report a leave point well
      // outside the button, and the fill should drain to the edge it left by.
      x = clamp(((event.clientX - rect.left) / rect.width) * 100)
      y = clamp(((event.clientY - rect.top) / rect.height) * 100)
    }
    fill.style.setProperty('--fill-x', `${x}%`)
    fill.style.setProperty('--fill-y', `${y}%`)
  }

  function enter(event: React.PointerEvent | null) {
    let fill = fillRef.current
    if (!fill) return
    // Jump the empty circle to the entry point without animating, so the
    // fill grows from there instead of sliding over from the last exit.
    fill.style.transition = 'none'
    origin(event)
    fill.style.setProperty('--fill-r', '0%')
    void fill.offsetWidth
    fill.style.transition = ''
    fill.style.setProperty('--fill-r', `${FULL}%`)
  }

  function leave(event: React.PointerEvent | null) {
    let fill = fillRef.current
    if (!fill) return
    // Move the centre to the exit point while the circle still covers the
    // whole button, then shrink: the fill drains out where the pointer left.
    origin(event)
    fill.style.setProperty('--fill-r', '0%')
  }

  return (
    <Link
      href={href}
      onPointerEnter={(event) => event.pointerType === 'mouse' && enter(event)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && leave(event)}
      onFocus={(event) =>
        event.currentTarget.matches(':focus-visible') && enter(null)
      }
      onBlur={() => leave(null)}
      className={clsx(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full border-[1.5px] border-ink font-medium text-ink',
        className,
      )}
    >
      {children}
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-ink text-canvas transition-[clip-path] duration-700 ease-[cubic-bezier(0.45,0,0.15,1)] [--fill-r:0%] [--fill-x:50%] [--fill-y:100%] [clip-path:circle(var(--fill-r)_at_var(--fill-x)_var(--fill-y))] motion-reduce:transition-none"
      >
        {children}
      </span>
    </Link>
  )
}
