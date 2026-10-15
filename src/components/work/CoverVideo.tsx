'use client'

import { useEffect, useRef, useState } from 'react'

import { useDisplay } from '@/lib/a11y/useDisplay'

// A case study cover that moves: a muted walkthrough on a loop. It plays on
// its own only when Motion is full and the cover is on screen, and it always
// has a visible pause control (WCAG 2.2.2, Pause, Stop, Hide). Under reduced
// or no motion it rests on the poster until the reader presses play.
export function CoverVideo({
  src,
  poster,
  label,
}: {
  src: string
  poster: string
  // Read in place of the video, which is hidden from screen readers.
  label: string
}) {
  let display = useDisplay()
  let video = useRef<HTMLVideoElement>(null)
  // null follows the Motion preference; true or false is the reader's choice.
  let [choice, setChoice] = useState<boolean | null>(null)
  let [inView, setInView] = useState(false)

  let playing = (choice ?? display.motion === 'full') && inView

  useEffect(() => {
    let element = video.current
    if (!element) return
    let observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let element = video.current
    if (!element) return
    if (playing) {
      // Browsers may still refuse; the poster stays, which is fine.
      element.play().catch(() => {})
    } else {
      element.pause()
    }
  }, [playing])

  return (
    <div className="relative h-full w-full" role="img" aria-label={label}>
      <video
        ref={video}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        aria-pressed={!playing}
        aria-label={playing ? 'Pause video' : 'Play video'}
        onClick={() => setChoice(!playing)}
        className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-canvas/85 text-ink backdrop-blur transition hover:border-ink sm:bottom-4 sm:right-4"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
          {playing ? (
            <path
              d="M5 3.5v9M11 3.5v9"
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M5 3.5v9l7-4.5z"
              className="fill-current stroke-current"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>
    </div>
  )
}
