import { InView } from '@/components/motion/InView'
import { Redline } from '@/components/motion/Redline'

// How I work, drawn as overlapping circles sized by how much of the work each
// phase takes. Arrows run forward along one side and back along the other,
// because every stage loops back. On first sight the outlines draw on, left
// to right; after that a small coral dot travels the loop forever, so the
// iteration is visible rather than described. The geometry is computed here
// so changing a phase or a size is a one-line edit. Static ids are safe
// because the diagram renders once per page; the two orientations use
// different prefixes.

const phases = [
  { lines: ['Research'], r: 62 },
  { lines: ['Product', 'design'], r: 82 },
  { lines: ['UX and', 'prototyping'], r: 112 },
  { lines: ['UI design'], r: 82 },
  { lines: ['Development'], r: 128 },
  { lines: ['Delivery'], r: 62 },
]

const OVERLAP = 26
const MAX_R = Math.max(...phases.map((phase) => phase.r))
const CROSS = MAX_R + 40
const STAGGER = 140

// Centres along the main axis, each circle overlapping the previous one.
const centres = phases.reduce<Array<number>>((acc, phase, index) => {
  if (index === 0) return [20 + phase.r]
  let previous = phases[index - 1]
  return [...acc, acc[index - 1] + previous.r + phase.r - OVERLAP]
}, [])

const END = centres[centres.length - 1] + phases[phases.length - 1].r + 20

const label = `Process: ${phases
  .map((phase) => phase.lines.join(' '))
  .join(
    ', then ',
  )}. Development and UX take the most time, and each stage loops back to the one before.`

type Point = [number, number]

// A closed, smooth curve through the points (centripetal Catmull-Rom), for
// the travelling dot.
function closedCurve(points: Array<Point>) {
  let n = points.length
  let at = (i: number) => points[((i % n) + n) % n]
  let d = `M${at(0)[0]} ${at(0)[1]}`
  for (let i = 0; i < n; i++) {
    let [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    let c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    let c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1.map(Math.round).join(' ')} ${c2.map(Math.round).join(' ')} ${
      p2[0]
    } ${p2[1]}`
  }
  return `${d}Z`
}

function Diagram({ vertical }: { vertical: boolean }) {
  let prefix = vertical ? 'process-v' : 'process-h'
  let width = vertical ? CROSS + MAX_R + 190 : END
  let height = vertical ? END : CROSS + MAX_R + 80
  let at = (index: number) =>
    vertical ? { x: CROSS, y: centres[index] } : { x: centres[index], y: CROSS }
  // A point on the forward (+1) or back (-1) side of a circle.
  let side = (index: number, sign: 1 | -1, inset = 0): Point => {
    let reach = phases[index].r - inset
    return vertical
      ? [CROSS + sign * reach, centres[index]]
      : [centres[index], CROSS - sign * reach]
  }
  let first = at(0)
  let last = at(phases.length - 1)
  let lastIndex = phases.length - 1

  // Forward along every circle, round the far end, back along every circle.
  let loop = closedCurve([
    ...phases.map((_, i) => side(i, 1, 14)),
    vertical
      ? [CROSS, last.y + phases[lastIndex].r - 14]
      : [last.x + phases[lastIndex].r - 14, CROSS],
    ...phases.map((_, i) => side(lastIndex - i, -1, 14)),
    vertical
      ? [CROSS, first.y - phases[0].r + 14]
      : [first.x - phases[0].r + 14, CROSS],
  ])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full overflow-visible"
    >
      <defs>
        <pattern
          id={`${prefix}-hatch`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="7"
            className="stroke-coral"
            strokeWidth="1.4"
          />
        </pattern>
        <marker
          id={`${prefix}-arrow`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="9"
          markerHeight="9"
          orient="auto-start-reverse"
        >
          <path
            d="M1 1 9 5 1 9"
            fill="none"
            className="stroke-ink"
            strokeWidth="1.4"
          />
        </marker>
        {/* Per circle: outside its neighbours the outline is solid, inside
            them it is dotted. */}
        {phases.map((_, index) => {
          let neighbours = [index - 1, index + 1].filter(
            (n) => n >= 0 && n < phases.length,
          )
          return [
            <mask
              key={`out${index}`}
              id={`${prefix}-out${index}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={width}
              height={height}
            >
              <rect width={width} height={height} fill="#fff" />
              {neighbours.map((n) => (
                <circle
                  key={n}
                  cx={at(n).x}
                  cy={at(n).y}
                  r={phases[n].r}
                  fill="#000"
                />
              ))}
            </mask>,
            <mask
              key={`in${index}`}
              id={`${prefix}-in${index}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={width}
              height={height}
            >
              <rect width={width} height={height} fill="#000" />
              {neighbours.map((n) => (
                <circle
                  key={n}
                  cx={at(n).x}
                  cy={at(n).y}
                  r={phases[n].r}
                  fill="#fff"
                />
              ))}
            </mask>,
          ]
        })}
      </defs>

      {/* One hatched band through every circle, so the work reads as a
          single continuous thread. It fills in once the outlines are down. */}
      <rect
        {...(vertical
          ? { x: CROSS - 26, y: first.y, width: 52, height: last.y - first.y }
          : { x: first.x, y: CROSS - 26, width: last.x - first.x, height: 52 })}
        fill={`url(#${prefix}-hatch)`}
        className="transition-opacity duration-700 group-data-[armed=true]/inview:opacity-0"
        style={{ transitionDelay: `${phases.length * STAGGER + 300}ms` }}
      />

      {phases.map((phase, index) => {
        let { x, y } = at(index)
        let r = phase.r
        let length = r * 0.62
        let forward = vertical
          ? `M${x + r} ${y}V${y + length}`
          : `M${x} ${y - r}H${x + length}`
        let back = vertical
          ? `M${x - r} ${y}V${y - length}`
          : `M${x} ${y + r}H${x - length}`
        let delay = { transitionDelay: `${index * STAGGER}ms` }
        let after = {
          transitionDelay: `${index * STAGGER + 500}ms`,
        }

        return (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r={r * 0.8}
              fill={`url(#${prefix}-hatch)`}
              className="transition-opacity duration-700 group-data-[armed=true]/inview:opacity-0"
              style={after}
            />
            <circle
              cx={x}
              cy={y}
              r={r}
              pathLength={1}
              fill="none"
              className="draw-line stroke-ink"
              strokeWidth="1.5"
              mask={`url(#${prefix}-out${index})`}
              style={delay}
            />
            <circle
              cx={x}
              cy={y}
              r={r}
              fill="none"
              className="stroke-ink transition-opacity duration-500 group-data-[armed=true]/inview:opacity-0"
              strokeWidth="1.5"
              strokeDasharray="2 4"
              mask={`url(#${prefix}-in${index})`}
              style={after}
            />
            <g
              className="transition-opacity duration-500 group-data-[armed=true]/inview:opacity-0"
              style={after}
            >
              <path
                d={forward}
                fill="none"
                className="stroke-ink"
                strokeWidth="1.4"
                markerEnd={`url(#${prefix}-arrow)`}
              />
              {index > 0 && (
                <path
                  d={back}
                  fill="none"
                  className="stroke-ink"
                  strokeWidth="1.4"
                  markerEnd={`url(#${prefix}-arrow)`}
                />
              )}
            </g>
          </g>
        )
      })}

      {/* The iteration, made visible. SMIL ignores reduced motion, so the
          dot is simply not shown then. */}
      <circle
        r="5"
        className="fill-coral transition-opacity duration-500 group-data-[armed=true]/inview:opacity-0 motion-reduce:hidden"
        style={{ transitionDelay: `${phases.length * STAGGER + 600}ms` }}
      >
        <animateMotion dur="12s" repeatCount="indefinite" path={loop} />
      </circle>

      {phases.map((phase, index) => {
        let { x, y } = at(index)
        let textX = vertical ? CROSS + MAX_R + 30 : x
        let textY = vertical
          ? y - (phase.lines.length - 1) * 10 + 5
          : CROSS + MAX_R + 40
        return (
          <text
            key={index}
            x={textX}
            y={textY}
            textAnchor={vertical ? 'start' : 'middle'}
            className="fill-ink font-sans text-[15px] font-semibold tracking-[0.08em] transition-opacity duration-500 group-data-[armed=true]/inview:opacity-0"
            style={{ transitionDelay: `${index * STAGGER + 200}ms` }}
          >
            {phase.lines.map((line, lineIndex) => (
              <tspan key={line} x={textX} dy={lineIndex ? 20 : 0}>
                {line}
              </tspan>
            ))}
          </text>
        )
      })}
    </svg>
  )
}

export function ProcessDiagram() {
  return (
    <div>
      <Redline className="mb-10 sm:mb-14">
        <h2 className="mx-auto max-w-[30ch] text-balance text-center text-[clamp(1.5rem,3.4vw,2.375rem)] font-medium leading-[1.3]">
          I work across <span className="text-coral">every stage</span> of
          building a product, and{' '}
          <span className="relative whitespace-nowrap pr-[0.2em] before:absolute before:inset-x-0 before:bottom-[0.02em] before:h-0.5 before:bg-current after:absolute after:bottom-[-0.12em] after:right-0 after:h-[0.32em] after:w-[0.32em] after:rotate-45 after:border-r-2 after:border-t-2 after:border-current">
            loop back
          </span>{' '}
          whenever users show me something new.
        </h2>
      </Redline>
      <InView threshold={0.35}>
        <div className="hidden sm:block">
          <Diagram vertical={false} />
        </div>
        <div className="mx-auto max-w-md sm:hidden">
          <Diagram vertical />
        </div>
      </InView>
    </div>
  )
}
