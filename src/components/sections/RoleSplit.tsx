import clsx from 'clsx'

import { CountUp } from '@/components/motion/CountUp'
import { InView } from '@/components/motion/InView'
import { Redline } from '@/components/motion/Redline'

// "Part designer, part engineer": a 40/60 pie. On first sight the slices sweep
// in, the percentages count up, and the lists arrive item by item; on hover
// the slices pull apart. Static SVG ids are safe because the section renders
// once per page.

const designer = [
  'User research',
  'Flows and wireframes',
  'UI design',
  'Prototyping',
  // TODO(Reda): placeholder joke, swap for your own.
  '“Arguing about 4px”',
]

const engineer = [
  'Front-end development',
  'Backend and data',
  'Offline and sync',
  'Shipping to production',
  // TODO(Reda): placeholder joke, swap for your own.
  '“Reading logs at 2am”',
]

// The hidden start of an armed InView; entering removes it.
const enter =
  'transition duration-500 ease-out group-data-[armed=true]/inview:translate-y-2 group-data-[armed=true]/inview:opacity-0'

function List({
  title,
  items,
  delay,
}: {
  title: string
  items: Array<string>
  delay: number
}) {
  return (
    <div>
      <Redline>
        <h2 className="mb-4 text-[clamp(1.375rem,3.6vw,2.75rem)] font-light leading-[1.1] tracking-[-0.01em]">
          {title}
        </h2>
      </Redline>
      <ul className="grid gap-2 text-sm text-muted sm:gap-2.5 sm:text-base">
        {items.map((item, index) => (
          <li
            key={item}
            className={clsx(enter, index === items.length - 1 && 'italic')}
            style={{ transitionDelay: `${delay + index * 70}ms` }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Each slice sweeps in around the pie's centre from a quarter turn back.
const sweep =
  'origin-[150px_150px] transition-[transform,opacity] duration-700 ease-out group-data-[armed=true]/inview:-rotate-90 group-data-[armed=true]/inview:scale-75 group-data-[armed=true]/inview:opacity-0'

export function RoleSplit() {
  return (
    <InView className="grid grid-cols-2 items-start gap-x-6 gap-y-8 py-4 sm:gap-10 lg:grid-cols-[1fr_minmax(0,20rem)_1fr] lg:items-center lg:gap-16 lg:py-12">
      <div className="lg:justify-self-end">
        <List title="Part designer" items={designer} delay={250} />
      </div>
      <div className="group order-first col-span-2 mx-auto w-full max-w-[13rem] sm:max-w-[18rem] lg:order-none lg:col-span-1 lg:max-w-none">
        <svg
          viewBox="0 0 300 300"
          role="img"
          aria-label="Pie chart: 40 percent designer, 60 percent engineer"
          className="h-auto w-full overflow-visible font-sans"
        >
          <defs>
            <linearGradient
              id="role-split-designer"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0" stopColor="#f0543f" />
              <stop offset="1" stopColor="#b9628f" />
            </linearGradient>
          </defs>
          <g className={sweep}>
            <g className="transition-transform duration-500 ease-out group-hover:-translate-x-[9px] group-hover:-translate-y-[3px]">
              <path
                transform="translate(-5.7 -1.85)"
                d="M150 150 L73.59 255.17 A130 130 0 0 1 150 20 Z"
                fill="url(#role-split-designer)"
              />
              <text
                x="78"
                y="136"
                textAnchor="middle"
                className="fill-white text-[22px] font-semibold"
              >
                Designer
              </text>
              <text
                x="78"
                y="156"
                textAnchor="middle"
                className="fill-white/80 font-mono text-xs"
              >
                <CountUp to={40} suffix="%" />
              </text>
            </g>
          </g>
          <g className={sweep} style={{ transitionDelay: '120ms' }}>
            <g className="transition-transform duration-500 ease-out group-hover:translate-x-[9px] group-hover:translate-y-[3px]">
              <path
                transform="translate(5.7 1.85)"
                d="M150 150 L150 20 A130 130 0 1 1 73.59 255.17 Z"
                className="fill-ink"
              />
              <text
                x="214"
                y="172"
                textAnchor="middle"
                className="fill-canvas text-[22px] font-semibold"
              >
                Engineer
              </text>
              <text
                x="214"
                y="192"
                textAnchor="middle"
                className="fill-canvas/80 font-mono text-xs"
              >
                <CountUp to={60} suffix="%" />
              </text>
            </g>
          </g>
        </svg>
      </div>
      <List title="Part engineer" items={engineer} delay={600} />
    </InView>
  )
}
