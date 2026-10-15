'use client'

import { useEffect, useRef, useState } from 'react'

// The statement card's background: a drafting surface. A 24px graph-paper
// grid (CSS, .blueprint-grid in src/styles/tailwind.css) with a few coral
// hairline shapes snapped to it, like a designer's construction sketch. With
// a fine pointer, shapes near the cursor turn and lean toward it, and a snap
// guide outlines the grid cell under the pointer with its coordinates.
//
// Shapes are placed in grid cells and anchored to the card's top and bottom
// bands, where the centred statement never reaches. Small cards get corner
// fragments only.

const CELL = 24
const REACH = 220 // px: how far a shape notices the pointer
const MAX_TURN = 25 // degrees at zero distance
const MAX_LEAN = 6 // px toward the pointer at zero distance

type Shape = {
  key: string
  // Centre used for the cursor reaction, in px.
  cx: number
  cy: number
  draw: React.ReactNode
}

function label(x: number, y: number, text: string, anchor = 'start') {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="fill-coral font-mono text-[10px] uppercase tracking-[0.06em]"
      stroke="none"
    >
      {text}
    </text>
  )
}

function layout(width: number, height: number): Array<Shape> {
  let cols = Math.floor(width / CELL)
  let rows = Math.floor(height / CELL)
  let at = (col: number) => col * CELL
  let mid = Math.floor(cols / 2)

  // Small cards: the statement fills most of the card, so only fragments
  // tucked into the corners, mostly clipped by the card's edge.
  if (width < 640) {
    return [
      {
        key: 'circle',
        cx: at(0),
        cy: at(0),
        draw: <circle cx={at(0)} cy={at(0)} r={CELL * 2.5} />,
      },
      {
        key: 'square',
        cx: at(cols),
        cy: at(0),
        draw: (
          <rect x={at(cols - 2)} y={-CELL} width={CELL * 3} height={CELL * 3} />
        ),
      },
      {
        key: 'triangle',
        cx: at(1),
        cy: at(rows),
        draw: (
          <path
            d={`M${at(-1)} ${at(rows + 1)}L${at(1)} ${at(rows - 2)}L${at(
              3,
            )} ${at(rows + 1)}Z`}
          />
        ),
      },
      {
        key: 'rounded',
        cx: at(cols - 1),
        cy: at(rows),
        draw: (
          <rect
            x={at(cols - 3)}
            y={at(rows - 1)}
            width={CELL * 5}
            height={CELL * 3}
            rx={10}
          />
        ),
      },
    ]
  }

  return [
    // Top left: a circle with its radius drawn and labelled.
    {
      key: 'circle',
      cx: at(3),
      cy: at(3),
      draw: (
        <>
          <circle cx={at(3)} cy={at(3)} r={CELL * 2} />
          <path d={`M${at(3)} ${at(3)}H${at(5)}`} strokeDasharray="3 3" />
          <circle cx={at(3)} cy={at(3)} r={2} className="fill-coral" />
          {label(at(5) + 6, at(3) + 3, `R ${CELL * 2}`)}
        </>
      ),
    },
    // Top, left of centre: a quarter arc with its angle.
    {
      key: 'arc',
      cx: at(mid - 8),
      cy: at(3),
      draw: (
        <>
          <path
            d={`M${at(mid - 10)} ${at(1)}V${at(4)}H${at(mid - 7)}`}
            strokeDasharray="2 3"
            opacity={0.6}
          />
          <path
            d={`M${at(mid - 10)} ${at(1)}A${CELL * 3} ${CELL * 3} 0 0 0 ${at(
              mid - 7,
            )} ${at(4)}`}
          />
          {label(at(mid - 10) + 5, at(4) - 6, '90°')}
        </>
      ),
    },
    // Top right: a square with a corner tick.
    {
      key: 'square',
      cx: at(cols - 4) + CELL / 2,
      cy: at(2) + CELL * 1.5,
      draw: (
        <>
          <rect x={at(cols - 6)} y={at(2)} width={CELL * 3} height={CELL * 3} />
          <path
            d={`M${at(cols - 6)} ${at(2) + 10}H${at(cols - 6) + 10}V${at(2)}`}
          />
        </>
      ),
    },
    // Top right, inside: a crosshair.
    {
      key: 'crosshair',
      cx: at(cols - 10),
      cy: at(3),
      draw: (
        <>
          <path
            d={`M${at(cols - 11)} ${at(3)}H${at(cols - 9)}M${at(
              cols - 10,
            )} ${at(2)}V${at(4)}`}
          />
          <circle cx={at(cols - 10)} cy={at(3)} r={CELL / 3} />
        </>
      ),
    },
    // Bottom left: a triangle.
    {
      key: 'triangle',
      cx: at(4),
      cy: at(rows - 2),
      draw: (
        <path
          d={`M${at(2)} ${at(rows - 1)}L${at(4)} ${at(rows - 4)}L${at(6)} ${at(
            rows - 1,
          )}Z`}
        />
      ),
    },
    // Bottom centre: a dimension line, labelled with its real length.
    {
      key: 'dimension',
      cx: at(mid),
      cy: at(rows - 2),
      draw: (
        <>
          <path
            d={`M${at(mid - 5)} ${at(rows - 2)}H${at(mid + 5)}M${at(mid - 5)} ${
              at(rows - 2) - 6
            }v12M${at(mid + 5)} ${at(rows - 2) - 6}v12`}
          />
          {label(at(mid), at(rows - 2) - 8, `${CELL * 10}`, 'middle')}
        </>
      ),
    },
    // Bottom right: a rounded rectangle, a component placeholder.
    {
      key: 'rounded',
      cx: at(cols - 5) - CELL / 2,
      cy: at(rows - 3),
      draw: (
        <rect
          x={at(cols - 8)}
          y={at(rows - 4)}
          width={CELL * 5}
          height={CELL * 2}
          rx={8}
        />
      ),
    },
  ]
}

export function BlueprintGrid() {
  let rootRef = useRef<HTMLDivElement>(null)
  let groupRefs = useRef<Record<string, SVGGElement | null>>({})
  let guideRef = useRef<SVGGElement>(null)
  let [size, setSize] = useState<{ width: number; height: number } | null>(null)

  // Lay out against the card's real size.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let observer = new ResizeObserver(([entry]) => {
      let { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  let shapes = size ? layout(size.width, size.height) : []

  // Cursor reaction: only with a fine pointer and motion allowed.
  useEffect(() => {
    const root = rootRef.current
    const card = root?.parentElement
    if (!root || !card || shapes.length === 0) return
    let canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    let reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!canHover.matches || reduce.matches) return

    let pointer: { x: number; y: number } | null = null
    let state = shapes.map(() => ({ turn: 0, dx: 0, dy: 0 }))
    let frame = 0

    let step = () => {
      let moving = false
      shapes.forEach((shape, i) => {
        let target = { turn: 0, dx: 0, dy: 0 }
        if (pointer) {
          let vx = pointer.x - shape.cx
          let vy = pointer.y - shape.cy
          let distance = Math.hypot(vx, vy)
          let pull = Math.max(0, 1 - distance / REACH)
          pull = pull * pull * (3 - 2 * pull) // smoothstep
          target = {
            turn: pull * MAX_TURN * (vx >= 0 ? 1 : -1),
            dx: distance ? (vx / distance) * pull * MAX_LEAN : 0,
            dy: distance ? (vy / distance) * pull * MAX_LEAN : 0,
          }
        }
        let s = state[i]
        s.turn += (target.turn - s.turn) * 0.12
        s.dx += (target.dx - s.dx) * 0.12
        s.dy += (target.dy - s.dy) * 0.12
        if (
          Math.abs(target.turn - s.turn) > 0.05 ||
          Math.abs(target.dx - s.dx) > 0.05 ||
          Math.abs(target.dy - s.dy) > 0.05
        ) {
          moving = true
        }
        groupRefs.current[shape.key]?.setAttribute(
          'transform',
          `translate(${s.dx.toFixed(2)} ${s.dy.toFixed(
            2,
          )}) rotate(${s.turn.toFixed(2)} ${shape.cx} ${shape.cy})`,
        )
      })
      // Keep running while the pointer is here or anything is still easing.
      frame = pointer || moving ? requestAnimationFrame(step) : 0
    }
    let wake = () => {
      if (!frame) frame = requestAnimationFrame(step)
    }

    let move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      let rect = root.getBoundingClientRect()
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      let guide = guideRef.current
      if (guide) {
        let col = Math.floor(pointer.x / CELL)
        let row = Math.floor(pointer.y / CELL)
        guide.setAttribute(
          'transform',
          `translate(${col * CELL} ${row * CELL})`,
        )
        guide.style.opacity = '1'
        let readout = guide.querySelector('text')
        if (readout) readout.textContent = `${col}, ${row}`
      }
      wake()
    }
    let leave = () => {
      pointer = null
      if (guideRef.current) guideRef.current.style.opacity = '0'
      wake()
    }

    card.addEventListener('pointermove', move)
    card.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerleave', leave)
    }
    // shapes is derived from size; re-attach when the layout changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="blueprint-grid absolute inset-0" />
      {size && (
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          className="absolute inset-0 overflow-visible fill-none stroke-coral [stroke-width:1.25]"
        >
          {shapes.map((shape) => (
            <g
              key={shape.key}
              ref={(element) => {
                groupRefs.current[shape.key] = element
              }}
            >
              {shape.draw}
            </g>
          ))}
          {/* Snap guide: the grid cell under the pointer, with its address. */}
          <g
            ref={guideRef}
            className="opacity-0 transition-opacity duration-200"
          >
            <rect
              width={CELL}
              height={CELL}
              className="fill-coral/10"
              strokeWidth={1}
            />
            <path
              d={`M0 -2000V2000M${CELL} -2000V2000M-4000 0H4000M-4000 ${CELL}H4000`}
              strokeWidth={0.75}
              opacity={0.35}
            />
            <text
              x={CELL + 4}
              y={-4}
              className="fill-coral font-mono text-[10px] tracking-[0.06em]"
              stroke="none"
            >
              0, 0
            </text>
          </g>
        </svg>
      )}
    </div>
  )
}
