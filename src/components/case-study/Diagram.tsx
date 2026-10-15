// Hand-drawn SVG diagrams for case studies (docs/case-study.md, section 6).
// Every stroke and fill comes from a brand token class, so a diagram follows
// the theme with no per-theme code. Markers are defined per diagram with an
// id prefix, because a page carries several diagrams and SVG ids are global.

export interface Markers {
  arrow: string
  open: string
  diamond: string
}

export function Diagram({
  id,
  title,
  viewBox,
  minWidth,
  caption,
  children,
}: {
  id: string
  // Read out by screen readers in place of the drawing, so it must describe
  // what the diagram says, not what it looks like.
  title: string
  viewBox: string
  minWidth: number
  caption?: React.ReactNode
  children: (markers: Markers) => React.ReactNode
}) {
  let markers: Markers = {
    arrow: `url(#${id}-arrow)`,
    open: `url(#${id}-open)`,
    diamond: `url(#${id}-diamond)`,
  }

  return (
    <figure className="not-prose my-10 flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border border-line bg-surface p-4">
        <svg
          viewBox={viewBox}
          role="img"
          aria-labelledby={`${id}-title`}
          className="block h-auto w-full"
          style={{ minWidth }}
        >
          <title id={`${id}-title`}>{title}</title>
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className="fill-muted" />
            </marker>
            <marker
              id={`${id}-open`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path
                d="M1,1 L9,5 L1,9"
                fill="none"
                className="stroke-muted"
                strokeWidth="1.25"
              />
            </marker>
            <marker
              id={`${id}-diamond`}
              viewBox="0 0 14 10"
              refX="1"
              refY="5"
              markerWidth="11"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M1,5 L7,1 L13,5 L7,9 z" className="fill-ink" />
            </marker>
          </defs>
          {children(markers)}
        </svg>
      </div>
      {caption && (
        <figcaption className="text-sm leading-normal text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ── Shared primitives ────────────────────────────────────────────────────────

export function Label({
  x,
  y,
  children,
  anchor = 'start',
  tone = 'muted',
}: {
  x: number
  y: number
  children: React.ReactNode
  anchor?: 'start' | 'middle' | 'end'
  tone?: 'muted' | 'ink' | 'coral'
}) {
  let fill = {
    muted: 'fill-muted',
    ink: 'fill-ink',
    coral: 'fill-coral-text',
  }[tone]
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`${fill} font-mono text-[10px]`}
    >
      {children}
    </text>
  )
}

export function Edge({
  d,
  end,
  start,
  dashed = false,
  accent = false,
}: {
  d: string
  end?: string
  start?: string
  dashed?: boolean
  accent?: boolean
}) {
  return (
    <path
      d={d}
      fill="none"
      className={accent ? 'stroke-coral' : 'stroke-muted'}
      strokeWidth="1.25"
      strokeDasharray={dashed ? '4 3' : undefined}
      markerEnd={end}
      markerStart={start}
    />
  )
}

// A titled box with mono sub-lines: architecture components and the like.
export function Box({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  variant = 'default',
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines?: Array<string>
  variant?: 'default' | 'accent' | 'dashed'
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        className={`fill-surface ${variant === 'accent' ? 'stroke-coral' : 'stroke-ink'}`}
        strokeWidth={variant === 'accent' ? 1.5 : 1.25}
        strokeDasharray={variant === 'dashed' ? '5 4' : undefined}
      />
      <text
        x={x + 14}
        y={y + 26}
        className="fill-ink font-sans text-[13px] font-medium"
      >
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={line}
          x={x + 14}
          y={y + 48 + index * 16}
          className="fill-muted font-mono text-[10.5px]"
        >
          {line}
        </text>
      ))}
    </g>
  )
}

// ── Use case diagrams ────────────────────────────────────────────────────────

export function Actor({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y - 30}
        r="10"
        className="fill-surface stroke-ink"
        strokeWidth="1.5"
      />
      <path
        d={`M${x},${y - 20} V${y + 6} M${x - 16},${y - 10} H${x + 16} M${x},${y + 6} L${x - 12},${y + 28} M${x},${y + 6} L${x + 12},${y + 28}`}
        fill="none"
        className="stroke-ink"
        strokeWidth="1.5"
      />
      <text
        x={x}
        y={y + 46}
        textAnchor="middle"
        className="fill-ink font-sans text-[13px] font-medium"
      >
        {label}
      </text>
    </g>
  )
}

export function UseCase({
  cx,
  cy,
  rx,
  label,
  accent = false,
}: {
  cx: number
  cy: number
  rx: number
  label: string
  accent?: boolean
}) {
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry="20"
        className={`fill-surface ${accent ? 'stroke-coral' : 'stroke-ink'}`}
        strokeWidth={accent ? 1.5 : 1.1}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-ink font-sans text-[12px]"
      >
        {label}
      </text>
    </g>
  )
}

// ── Class diagrams ───────────────────────────────────────────────────────────

export const CLASS_LINE = 16
const CLASS_HEADER = 28

export function classHeight(attrs: number, methods = 0) {
  return (
    CLASS_HEADER +
    10 +
    attrs * CLASS_LINE +
    (methods ? 10 + methods * CLASS_LINE : 0)
  )
}

export interface ClassAttr {
  name: string
  accent?: boolean
}

export function ClassBox({
  x,
  y,
  w,
  name,
  attrs,
  methods = [],
  tag,
}: {
  x: number
  y: number
  w: number
  name: string
  attrs: Array<ClassAttr | string>
  methods?: Array<string>
  // A short corner note, for example "added" for a class the first model
  // did not have.
  tag?: string
}) {
  let h = classHeight(attrs.length, methods.length)
  let methodsTop = y + CLASS_HEADER + 10 + attrs.length * CLASS_LINE
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="6"
        className="fill-surface stroke-ink"
        strokeWidth="1.25"
      />
      <path
        d={`M${x},${y + CLASS_HEADER} H${x + w}`}
        className="stroke-ink"
        strokeWidth="1"
      />
      <text
        x={x + 12}
        y={y + 19}
        className="fill-ink font-sans text-[13px] font-semibold"
      >
        {name}
      </text>
      {tag && (
        <text
          x={x + w - 10}
          y={y + 18}
          textAnchor="end"
          className="fill-coral-text font-mono text-[9.5px] uppercase tracking-[0.06em]"
        >
          {tag}
        </text>
      )}
      {attrs.map((attr, index) => {
        let a = typeof attr === 'string' ? { name: attr } : attr
        return (
          <text
            key={a.name}
            x={x + 12}
            y={y + CLASS_HEADER + 20 + index * CLASS_LINE}
            className={`${a.accent ? 'fill-coral-text' : 'fill-muted'} font-mono text-[10.5px]`}
          >
            {a.name}
          </text>
        )
      })}
      {methods.length > 0 && (
        <>
          <path
            d={`M${x},${methodsTop} H${x + w}`}
            className="stroke-line"
            strokeWidth="1"
          />
          {methods.map((method, index) => (
            <text
              key={method}
              x={x + 12}
              y={methodsTop + 20 + index * CLASS_LINE}
              className="fill-ink font-mono text-[10.5px]"
            >
              {method}
            </text>
          ))}
        </>
      )}
    </g>
  )
}

// ── State diagrams ───────────────────────────────────────────────────────────

export function State({
  x,
  y,
  w,
  h = 52,
  label,
  sub,
  final = false,
}: {
  x: number
  y: number
  w: number
  h?: number
  label: string
  sub?: string
  final?: boolean
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="18"
        className="fill-surface stroke-ink"
        strokeWidth="1.25"
      />
      {final && (
        <rect
          x={x + 4}
          y={y + 4}
          width={w - 8}
          height={h - 8}
          rx="14"
          fill="none"
          className="stroke-ink"
          strokeWidth="1"
        />
      )}
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 3 : h / 2 + 4)}
        textAnchor="middle"
        className="fill-ink font-sans text-[13px] font-medium"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 13}
          textAnchor="middle"
          className="fill-muted font-mono text-[10px]"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

export function InitialState({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="7" className="fill-ink" />
}

// ── Sequence diagrams ────────────────────────────────────────────────────────

export function Lifeline({
  x,
  top,
  bottom,
  label,
  w = 140,
}: {
  x: number
  top: number
  bottom: number
  label: string
  w?: number
}) {
  return (
    <g>
      <rect
        x={x - w / 2}
        y={top}
        width={w}
        height={34}
        rx="8"
        className="fill-surface stroke-ink"
        strokeWidth="1.25"
      />
      <text
        x={x}
        y={top + 21}
        textAnchor="middle"
        className="fill-ink font-sans text-[12.5px] font-medium"
      >
        {label}
      </text>
      <path
        d={`M${x},${top + 34} V${bottom}`}
        className="stroke-line"
        strokeWidth="1.25"
        strokeDasharray="4 4"
      />
    </g>
  )
}

// A call from one lifeline to another, or to itself when from equals to.
// Replies are dashed with an open head, as in UML.
export function Message({
  from,
  to,
  y,
  label,
  markers,
  reply = false,
  accent = false,
}: {
  from: number
  to: number
  y: number
  label: string
  markers: Markers
  reply?: boolean
  accent?: boolean
}) {
  if (from === to) {
    return (
      <g>
        <Edge
          d={`M${from},${y} H${from + 34} V${y + 16} H${from + 3}`}
          end={markers.arrow}
          accent={accent}
        />
        <Label x={from + 42} y={y + 12} tone={accent ? 'coral' : 'muted'}>
          {label}
        </Label>
      </g>
    )
  }
  let mid = (from + to) / 2
  return (
    <g>
      <Edge
        d={`M${from},${y} H${to + (to > from ? -2 : 2)}`}
        end={reply ? markers.open : markers.arrow}
        dashed={reply}
        accent={accent}
      />
      <Label
        x={mid}
        y={y - 6}
        anchor="middle"
        tone={accent ? 'coral' : 'muted'}
      >
        {label}
      </Label>
    </g>
  )
}

// A combined fragment: loop, alt, opt, or a plain phase label.
export function Fragment({
  x,
  y,
  w,
  h,
  label,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
}) {
  let tab = label.length * 6.4 + 16
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="4"
        fill="none"
        className="stroke-line"
        strokeWidth="1.25"
      />
      <path
        d={`M${x},${y + 18} H${x + tab - 6} L${x + tab},${y + 12} V${y}`}
        fill="none"
        className="stroke-line"
        strokeWidth="1.25"
      />
      <text
        x={x + 7}
        y={y + 13}
        className="fill-ink font-mono text-[10px] font-medium"
      >
        {label}
      </text>
    </g>
  )
}
