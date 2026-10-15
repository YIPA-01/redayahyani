'use client'

import { useState } from 'react'

import { useDisplay } from '@/lib/a11y/useDisplay'

// The statement morph loops on its own, so it gets a visible pause control
// (WCAG 2.2.2, Pause, Stop, Hide). It flags the surrounding card with
// data-morph-paused, which MorphText checks every frame. Not rendered when
// the morph is not running anyway (reduced motion or Readable type).
export function MorphPauseButton() {
  let display = useDisplay()
  let [paused, setPaused] = useState(false)

  if (display.motion !== 'full' || display.readable) return null

  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label="Pause the text animation"
      onClick={(event) => {
        let next = !paused
        setPaused(next)
        let card = event.currentTarget.closest<HTMLElement>('[data-morph-card]')
        if (card) card.dataset.morphPaused = String(next)
      }}
      className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-canvas/80 text-muted backdrop-blur transition hover:border-ink hover:text-ink sm:bottom-4 sm:right-4"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
        {paused ? (
          <path
            d="M5 3.5v9l7-4.5z"
            className="fill-current stroke-current"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 3.5v9M11 3.5v9"
            className="stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  )
}
