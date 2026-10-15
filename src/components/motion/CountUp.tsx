'use client'

import { useEffect, useRef } from 'react'

// An SVG number that counts up from 0 to `to` when the surrounding InView
// enters the screen. The server render, reduced motion, and anything already
// on screen at load show the final number, because InView only fires its
// `inview` event for sections it armed (and hid) first.
export function CountUp({
  to,
  suffix = '',
  duration = 900,
}: {
  to: number
  suffix?: string
  duration?: number
}) {
  let ref = useRef<SVGTSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    // Listen on the InView wrapper. Its own effect runs after this one, so
    // the listener is in place before it can fire.
    const section = node?.closest('.group\\/inview')
    if (!node || !section) return

    let frame = 0
    let run = () => {
      let start = performance.now()
      let tick = (now: number) => {
        let t = Math.min(1, (now - start) / duration)
        let eased = 1 - Math.pow(1 - t, 3)
        node.textContent = `${Math.round(eased * to)}${suffix}`
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    section.addEventListener('inview', run, { once: true })
    return () => {
      section.removeEventListener('inview', run)
      cancelAnimationFrame(frame)
    }
  }, [to, suffix, duration])

  return (
    <tspan ref={ref}>
      {to}
      {suffix}
    </tspan>
  )
}
