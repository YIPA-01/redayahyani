import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { CoverImage } from '@/components/work/CoverImage'
import { ogImageUrl } from '@/lib/siteUrl'
import { workProjects, type WorkProject } from '@/lib/work/projects'
import { listPublicProjects } from '@/lib/work/publicProjects'

// Live client entries come from Firestore, so this page refreshes on a timer
// rather than being frozen at build time.
export const revalidate = 300

const title = 'Work'
const intro =
  'Products I have built and the work happening right now. Each case study covers the problem, what I built, and what it took.'

export const metadata: Metadata = {
  title,
  description: intro,
  openGraph: {
    title,
    description: intro,
    type: 'website',
    images: [ogImageUrl({ title: 'Work', eyebrow: 'Reda Yahyani' })],
  },
}

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Every interactive or visible child of a Card.Link sits at z-10, because the
// link overlay spans the whole card at z-20.
function StackChips({ stack }: { stack: Array<string> }) {
  return (
    <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5">
      {stack.map((item) => (
        <li
          key={item}
          className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function Cover({
  children,
  href,
}: {
  children: React.ReactNode
  href?: string
}) {
  const frame = (
    <div className="relative z-10 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-900/5 dark:bg-zinc-800 dark:ring-white/10">
      {children}
    </div>
  )
  // w-full is required on the link too: Card is a flex column with
  // items-start, so a bare block child shrinks to its content and the frame's
  // aspect ratio then resolves against a collapsed width.
  return href ? (
    <Link href={href} tabIndex={-1} aria-hidden="true" className="block w-full">
      {frame}
    </Link>
  ) : (
    frame
  )
}

function ProjectCard({ project }: { project: WorkProject }) {
  const href = project.caseStudy ? `/work/${project.slug}` : project.link?.href

  return (
    <Card as="li">
      <Cover href={href}>
        <CoverImage
          project={project}
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
        />
        {project.builtWith && (
          <Image
            src={project.builtWith.logo}
            alt={`Built in collaboration with ${project.builtWith.name}`}
            title={`Built in collaboration with ${project.builtWith.name}`}
            width={24}
            height={24}
            unoptimized
            className="absolute bottom-3 right-3 h-6 w-6 rounded-full bg-white object-cover ring-2 ring-white dark:ring-zinc-800"
          />
        )}
      </Cover>
      <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        {href ? <Card.Link href={href}>{project.name}</Card.Link> : project.name}
      </h2>
      <p className="relative z-10 mt-1 text-sm text-zinc-400 dark:text-zinc-500">
        {project.role}
        {project.year ? `, ${project.year}` : ''}
      </p>
      <Card.Description>{project.description}</Card.Description>
      <StackChips stack={project.stack} />
      {project.caseStudy ? (
        <Card.Cta>Read the case study</Card.Cta>
      ) : (
        project.link && (
          <p className="relative z-10 mt-4 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
            <LinkIcon className="h-6 w-6 flex-none" />
            <span className="ml-2">{project.link.label}</span>
          </p>
        )
      )}
    </Card>
  )
}

function LiveCard({
  project,
}: {
  project: Awaited<ReturnType<typeof listPublicProjects>>[number]
}) {
  const href = `/work/${project.slug}`

  return (
    <Card as="li">
      <Cover href={href}>
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-zinc-100 dark:from-teal-500/10 dark:to-zinc-800"
        >
          <span className="text-4xl font-semibold text-teal-500/40">
            {project.title.charAt(0)}
          </span>
        </div>
      </Cover>
      <div className="relative z-10 mt-6 flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          In progress
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {project.phase}
        </span>
      </div>
      <h2 className="mt-3 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={href}>{project.title}</Card.Link>
      </h2>
      <Card.Description>{project.summary}</Card.Description>
      <Card.Cta>Follow the build</Card.Cta>
    </Card>
  )
}

export default async function Work() {
  const staticSlugs = new Set(workProjects.map((project) => project.slug))
  const live = (await listPublicProjects()).filter(
    (project) => !staticSlugs.has(project.slug),
  )

  return (
    <SimpleLayout title="Products I have built." intro={intro}>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {live.map((project) => (
          <LiveCard key={project.slug} project={project} />
        ))}
        {workProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </SimpleLayout>
  )
}
