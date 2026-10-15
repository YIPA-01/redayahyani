'use client'

import { useRef, useState } from 'react'
import clsx from 'clsx'

// Designer redlines on a heading, the way a spec looks in a design handoff:
// the type spec above, a width dimension over the text, and a height
// dimension beside it. Every value is read live from the rendered heading, so
// the annotation can never drift from the CSS. Shown on hover or focus, and
// only on devices with a real pointer.

interface Spec {
  label: string
  left: number
  top: number
  width: number
  height: number
}

// next/font names families like "__Instrument_Serif_ae301a"; turn that back
// into "INSTRUMENT SERIF".
function familyName(fontFamily: string) {
  let first = fontFamily.split(',')[0].replace(/['"]/g, '').trim()
  let match = first.match(/^__(.+?)_[0-9a-f]{6}$/)
  return (match ? match[1] : first).replace(/_/g, ' ').toUpperCase()
}

function trim(value: number) {
  return Number(value.toFixed(2)).toString()
}

function measure(element: HTMLElement, wrapper: HTMLElement): Spec {
  let style = getComputedStyle(element)
  let size = parseFloat(style.fontSize)
  let lineHeight =
    style.lineHeight === 'normal' ? size * 1.2 : parseFloat(style.lineHeight)
  let tracking =
    style.letterSpacing === 'normal'
      ? '0'
      : `${trim(parseFloat(style.letterSpacing) / size)}em`.replace('-', '−')

  // The text's own box, not the block's, so centred and short headings get
  // dimensions that hug the words.
  let range = document.createRange()
  range.selectNodeContents(element)
  let text = range.getBoundingClientRect()
  let origin = wrapper.getBoundingClientRect()

  return {
    label: [
      familyName(style.fontFamily),
      style.fontWeight,
      `${Math.round(size)}/${Math.round(lineHeight)}`,
      tracking,
    ].join(' · '),
    left: text.left - origin.left,
    top: text.top - origin.top,
    width: text.width,
    height: text.height,
  }
}

export function Redline({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  let ref = useRef<HTMLDivElement>(null)
  let [spec, setSpec] = useState<Spec | null>(null)

  function show() {
    let wrapper = ref.current
    let heading = wrapper?.firstElementChild
    if (!wrapper || !(heading instanceof HTMLElement)) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setSpec(measure(heading, wrapper))
  }

  return (
    <div
      ref={ref}
      onPointerEnter={show}
      onFocus={show}
      onPointerLeave={() => setSpec(null)}
      onBlur={() => setSpec(null)}
      className={clsx('relative', className)}
    >
      {children}
      {spec && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute animate-[redline_180ms_ease-out] font-mono text-[10px] uppercase leading-none tracking-[0.06em] text-coral motion-reduce:animate-none"
          style={{
            left: spec.left,
            top: spec.top,
            width: spec.width,
            height: spec.height,
          }}
        >
          {/* Type spec */}
          <span className="absolute -top-8 left-0 whitespace-nowrap rounded-sm bg-coral px-1.5 py-1 text-[10px] text-white">
            {spec.label}
          </span>
          {/* Width */}
          <span className="absolute -top-3 left-0 right-0 h-px bg-coral before:absolute before:-top-1 before:left-0 before:h-[9px] before:w-px before:bg-coral after:absolute after:-top-1 after:right-0 after:h-[9px] after:w-px after:bg-coral" />
          <span className="absolute -top-[1.15rem] right-0 bg-canvas px-1">
            {Math.round(spec.width)}
          </span>
          {/* Height */}
          <span className="absolute -left-3 bottom-0 top-0 w-px bg-coral before:absolute before:-left-1 before:top-0 before:h-px before:w-[9px] before:bg-coral after:absolute after:-left-1 after:bottom-0 after:h-px after:w-[9px] after:bg-coral" />
          <span className="absolute -left-3 top-1/2 -translate-x-full -translate-y-1/2 bg-canvas px-1">
            {Math.round(spec.height)}
          </span>
          {/* Text box outline */}
          <span className="absolute inset-0 outline outline-1 outline-coral/40" />
        </div>
      )}
    </div>
  )
}
