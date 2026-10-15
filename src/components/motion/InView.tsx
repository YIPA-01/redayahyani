'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'

import { motionLevel } from '@/lib/a11y/preferences'

// Runs a section's entrance the first time a quarter of it is on screen.
//
// Children describe only the hidden start, with the armed variant:
//   transition duration-700 group-data-[armed=true]/inview:opacity-0
// Entering removes data-armed, so each child transitions to its normal
// styles. The server render and a visitor without JS are never armed, so they
// see the finished state; arming is skipped under reduced motion and for
// anything already on screen at load, so nothing can get stuck invisible.
// data-inview is set on entry too, for children that start something (an SVG
// <animateMotion>, a counter) rather than transition.
export function InView({
  className,
  threshold = 0.25,
  children,
}: {
  className?: string
  threshold?: number
  children: React.ReactNode
}) {
  let ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Entrances only play with full motion: the OS setting and the site's
    // Display preferences both have to allow it.
    let reduce = motionLevel() !== 'full'
    let rect = element.getBoundingClientRect()
    let onScreen =
      rect.top < window.innerHeight * (1 - threshold) && rect.bottom > 0
    if (reduce || onScreen) {
      element.dataset.inview = 'true'
      return
    }

    element.dataset.armed = 'true'
    let observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        delete element.dataset.armed
        element.dataset.inview = 'true'
        element.dispatchEvent(new Event('inview'))
        observer.disconnect()
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className={clsx('group/inview', className)}>
      {children}
    </div>
  )
}
