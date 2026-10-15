'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { useDisplay } from '@/lib/a11y/useDisplay'

// The home statement, morphing between the design face (Instrument Serif
// italic) and two engineering faces (Bitwise pixel, DM Mono). A wave sweeps
// through the sentence letter by letter, so mid-sweep it is half one, half
// the other.
//
// The three faces have different glyph widths, so swapping fonts in the text
// flow would reflow the paragraph every frame. Instead the serif sentence
// stays in flow as the real text (it sets the size, stays selectable, and is
// what screen readers get), and an aria-hidden layer draws each character on
// top of its measured serif position, in whatever face it is in right now.

type Face = 'serif' | 'pixel' | 'mono'
type State = Face | 'front'

const FACE_CLASS: Record<State, string> = {
  serif: 'inline-block font-serif italic',
  // Pixel and mono glyphs are wider than the italic serif; scale them down
  // so each one stays inside the serif character's box.
  pixel: 'inline-block font-pixel not-italic scale-[0.72]',
  mono: 'inline-block font-mono not-italic scale-[0.8]',
  // The leading edge of the wave: a coral scanline in pixel type.
  front: 'inline-block font-pixel not-italic scale-[0.72] text-coral-text',
}

// One loop, in milliseconds. Resting on the serif is the longest phase so the
// sentence is readable most of the time.
const PHASES: Array<
  { hold: Face; ms: number } | { from: Face; to: Face; ms: number }
> = [
  { hold: 'serif', ms: 3500 },
  { from: 'serif', to: 'pixel', ms: 1200 },
  { hold: 'pixel', ms: 800 },
  { from: 'pixel', to: 'mono', ms: 1200 },
  { hold: 'mono', ms: 600 },
  { from: 'mono', to: 'serif', ms: 1200 },
]
const CYCLE = PHASES.reduce((total, phase) => total + phase.ms, 0)

// Width of the coral front, as a share of the sentence.
const BAND = 0.06

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

// The state of the character at position p (0 to 1 through the sentence) at
// time t within the cycle.
function stateAt(t: number, p: number): State {
  let elapsed = 0
  for (let phase of PHASES) {
    if (t < elapsed + phase.ms) {
      if ('hold' in phase) return phase.hold
      let progress = ease((t - elapsed) / phase.ms)
      // Travel one band past the end so the last character settles too.
      let front = progress * (1 + 2 * BAND)
      if (p < front - BAND) return phase.to
      if (p < front) return 'front'
      return phase.from
    }
    elapsed += phase.ms
  }
  return 'serif'
}

interface Box {
  index: number
  char: string
  left: number
  top: number
  width: number
  height: number
}

export function MorphText({ text }: { text: string }) {
  let rootRef = useRef<HTMLSpanElement>(null)
  let baseRef = useRef<HTMLSpanElement>(null)
  let glyphRefs = useRef<Array<HTMLSpanElement | null>>([])
  const [boxes, setBoxes] = useState<Array<Box> | null>(null)
  // Only morph when motion is fully allowed (the OS setting and the site's
  // Display preferences both agree) and the visitor has not asked for
  // Readable type, where text must never change shape.
  let display = useDisplay()
  let enabled = display.motion === 'full' && !display.readable

  // Measure every visible character of the serif sentence, after fonts load
  // and again whenever the card changes size.
  useLayoutEffect(() => {
    if (!enabled) {
      setBoxes(null)
      return
    }
    const root = rootRef.current
    const node = baseRef.current?.firstChild
    if (!root || !node || node.nodeType !== Node.TEXT_NODE) return

    let measure = () => {
      let origin = root.getBoundingClientRect()
      let range = document.createRange()
      let next: Array<Box> = []
      for (let index = 0; index < text.length; index++) {
        if (text[index].trim() === '') continue
        range.setStart(node, index)
        range.setEnd(node, index + 1)
        let rect = range.getClientRects()[0]
        if (!rect) continue
        next.push({
          index,
          char: text[index],
          left: rect.left - origin.left,
          top: rect.top - origin.top,
          width: rect.width,
          height: rect.height,
        })
      }
      setBoxes(next)
    }

    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) measure()
    })
    let observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [enabled, text])

  // The animation loop. It only advances while the card is on screen, the
  // tab is visible, and the pointer or focus is not resting on it.
  useEffect(() => {
    if (!boxes) return
    const root = rootRef.current
    const card = root?.closest('[data-morph-card]') ?? root
    if (!root || !card) return

    let visible = true
    let paused = false
    let clock = 0
    let last = performance.now()
    let frame = 0
    let states: Array<State | null> = boxes.map(() => null)
    let span = Math.max(1, text.length - 1)

    let pause = () => (paused = true)
    let resume = () => (paused = false)
    // Focus on the card's own pause button must not hold the morph: that
    // button is how a keyboard user starts it again.
    let focusPause = (event: FocusEvent) => {
      if (!(event.target as Element).closest('button')) paused = true
    }
    card.addEventListener('pointerenter', pause)
    card.addEventListener('pointerleave', resume)
    card.addEventListener('focusin', focusPause as EventListener)
    card.addEventListener('focusout', resume)

    let observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(card)

    let tick = (now: number) => {
      let delta = now - last
      last = now
      // The card's pause button (WCAG 2.2.2) sets data-morph-paused.
      let stopped = (card as HTMLElement).dataset.morphPaused === 'true'
      if (visible && !paused && !stopped && !document.hidden) {
        clock = (clock + delta) % CYCLE
        boxes.forEach((box, i) => {
          let state = stateAt(clock, box.index / span)
          if (state === states[i]) return
          states[i] = state
          let glyph = glyphRefs.current[i]
          if (glyph) glyph.className = FACE_CLASS[state]
        })
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      card.removeEventListener('pointerenter', pause)
      card.removeEventListener('pointerleave', resume)
      card.removeEventListener('focusin', focusPause as EventListener)
      card.removeEventListener('focusout', resume)
    }
  }, [boxes, text])

  let morphing = boxes !== null

  return (
    <span ref={rootRef} className="relative block">
      <span ref={baseRef} className={clsx(morphing && 'text-transparent')}>
        {text}
      </span>
      {boxes && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 select-none"
        >
          {boxes.map((box, i) => (
            <span
              key={box.index}
              className="absolute flex items-center justify-center"
              style={{
                left: box.left,
                top: box.top,
                width: box.width,
                height: box.height,
              }}
            >
              <span
                ref={(element) => {
                  glyphRefs.current[i] = element
                }}
                className={FACE_CLASS.serif}
              >
                {box.char}
              </span>
            </span>
          ))}
        </span>
      )}
    </span>
  )
}
