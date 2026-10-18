import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { CoverImage } from '@/components/work/CoverImage'
import { type WorkProject } from '@/lib/work/projects'

// The engineering view of a project, peeled over its cover on hover: a
// wireframe of the screen in coral hairlines, with the stack it runs on. It
// wipes in from the left, and never takes clicks from the card link.
function Wireframe({ stack }: { stack: Array<string> }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex flex-col bg-[#141316]/85 transition-[clip-path] duration-500 ease-out [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
    >
      <svg
        viewBox="0 0 320 200"
        className="h-full w-full fill-none stroke-[#ff6f5a] [stroke-width:0.8]"
      >
        {/* Nav bar, logo, links */}
        <rect
          x="14"
          y="12"
          width="292"
          height="16"
          rx="3"
          strokeDasharray="3 2"
        />
        <rect x="20" y="16" width="8" height="8" rx="1.5" />
        <path d="M232 20h14M252 20h14M272 20h24" />
        {/* Hero: headline, copy, button, media */}
        <path d="M24 46h96M24 56h72" strokeWidth="2.4" />
        <path d="M24 70h104M24 77h88" />
        <rect x="24" y="88" width="40" height="12" rx="6" />
        <rect
          x="162"
          y="40"
          width="144"
          height="70"
          rx="4"
          strokeDasharray="3 2"
        />
        <path d="M162 40l144 70M306 40 162 110" opacity=".45" />
        {/* Card grid */}
        <rect x="14" y="122" width="92" height="44" rx="4" />
        <rect x="114" y="122" width="92" height="44" rx="4" />
        <rect x="214" y="122" width="92" height="44" rx="4" />
        {/* Redline dimensions */}
        <path d="M14 34v4M306 34v4M14 36h292" opacity=".7" />
        <path d="M8 122h4M8 166h4M10 122v44" opacity=".7" />
      </svg>
      <p className="absolute inset-x-0 bottom-0 truncate px-3 pb-2.5 text-center font-pixel text-[11px] uppercase tracking-[0.08em] text-[#ff6f5a]">
        {stack.join(' · ')}
      </p>
    </div>
  )
}

function href(project: WorkProject) {
  return project.caseStudy ? `/work/${project.slug}` : project.link?.href
}

// Home's project row: the cover in a soft tinted frame with a pill label
// underneath. The first card leans slightly, the way the reference did, and
// straightens on hover. Below lg the row swipes sideways with the next card
// peeking in, so three stacked covers don't take three screens on a phone.
// The vertical padding leaves room for the tilt and the hover lift, which the
// scroll container would otherwise clip.
export function ProjectCards({ projects }: { projects: Array<WorkProject> }) {
  return (
    <ul
      role="list"
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-3 [scrollbar-width:none] max-sm:-mx-4 max-sm:scroll-px-4 max-sm:px-4 lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden"
    >
      {projects.map((project, index) => {
        let target = href(project)
        let external = !project.caseStudy
        let tilt = index === 0

        let body = (
          <>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] bg-surface shadow-[0_1px_0_rgba(0,0,0,.04),0_8px_24px_-12px_rgba(0,0,0,.25)]">
              <CoverImage
                project={project}
                sizes="(min-width: 1024px) 20rem, 100vw"
                className="transition duration-700 ease-out group-hover:scale-[1.03]"
              />
              <Wireframe stack={project.stack} />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface py-1.5 pl-1.5 pr-3.5 text-[0.9375rem] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_14px_-6px_rgba(0,0,0,.18)]">
              {project.logo && (
                <Image
                  src={project.logo}
                  alt=""
                  unoptimized
                  className="h-6 w-6 rounded-full bg-white object-cover"
                />
              )}
              {project.name}
              <span
                aria-hidden="true"
                className="transition group-hover:translate-x-0.5"
              >
                →
              </span>
            </span>
            {project.tagline && (
              <span className="-mt-2 max-w-[30ch] text-center text-sm text-muted">
                {project.tagline}
              </span>
            )}
          </>
        )

        let className = clsx(
          'group grid h-full justify-items-center gap-4 rounded-[28px] px-3.5 pb-5 pt-3.5 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,.25)]',
          tilt
            ? '-rotate-[1.25deg] bg-gradient-to-b from-coral/25 to-panel to-70% hover:rotate-0'
            : 'bg-panel',
        )

        return (
          <li
            key={project.slug}
            className="w-[82%] shrink-0 snap-center sm:w-[60%] lg:w-auto"
          >
            {target ? (
              <Link
                href={target}
                className={className}
                {...(external && { target: '_blank', rel: 'noreferrer' })}
              >
                {body}
              </Link>
            ) : (
              <div className={className}>{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
