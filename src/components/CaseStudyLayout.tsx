import clsx from 'clsx'
import Link from 'next/link'

import { BackButton } from '@/components/BackButton'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import {
  TableOfContentsFloating,
  TableOfContentsRail,
} from '@/components/case-study/TableOfContents'
import { CoverImage } from '@/components/work/CoverImage'
import { CoverVideo } from '@/components/work/CoverVideo'
import { getWorkProject } from '@/lib/work/projects'

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

const CONTENT_ID = 'case-study-content'

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{value}</dd>
    </div>
  )
}

/**
 * Case study chrome. Takes the slug rather than the whole project so an MDX
 * file cannot drift from src/lib/work/projects.ts, which stays the single
 * source of truth for names, roles, stacks, and links.
 */
export function CaseStudyLayout({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const project = getWorkProject(slug)
  if (!project) {
    throw new Error(
      `No entry for "${slug}" in src/lib/work/projects.ts. Add it there before adding the case study.`,
    )
  }

  return (
    <Container className="mt-16 lg:mt-32">
      {/* From xl there is room for a contents rail beside the 42rem column;
          below that they float as a button in the bottom-right corner. */}
      <div className="xl:relative xl:grid xl:grid-cols-[12rem_minmax(0,42rem)] xl:justify-center xl:gap-16">
        <aside className="hidden xl:block">
          <TableOfContentsRail contentId={CONTENT_ID} />
        </aside>
        <div className="mx-auto max-w-2xl xl:mx-0">
          <BackButton label="Go back to work" />
          <article>
            <header className="flex flex-col">
              <p className="order-first text-sm text-muted">
                {project.role}
                {project.year ? `, ${project.year}` : ''}
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                {project.name}
              </h1>
              <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                {project.description}
              </p>
            </header>

            <div
              className={clsx(
                'mt-10 w-full overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-900/5 dark:bg-zinc-800 dark:ring-white/10',
                // A walkthrough keeps its own screen shape instead of being
                // cropped to the 16:10 still cover.
                project.coverVideo ? 'aspect-video' : 'aspect-[16/10]',
              )}
            >
              {project.coverVideo ? (
                <CoverVideo
                  src={project.coverVideo.src}
                  poster={project.coverVideo.poster}
                  label={`A walkthrough of ${project.name}`}
                />
              ) : (
                <CoverImage
                  project={project}
                  priority
                  sizes="(min-width: 640px) 42rem, 100vw"
                />
              )}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-zinc-100 py-6 sm:grid-cols-3 dark:border-zinc-700/40">
              <MetaRow label="Role" value={project.role} />
              {project.year && <MetaRow label="When" value={project.year} />}
              <MetaRow label="Stack" value={project.stack.join(', ')} />
              {project.builtWith && (
                <MetaRow label="With" value={project.builtWith.name} />
              )}
              {project.link && (
                <MetaRow
                  label="Live"
                  value={
                    <Link
                      href={project.link.href}
                      className="flex items-center text-coral-text transition hover:text-accent-600 dark:hover:text-accent-400"
                    >
                      <LinkIcon className="h-4 w-4 flex-none" />
                      <span className="ml-1.5">{project.link.label}</span>
                    </Link>
                  }
                />
              )}
            </dl>

            <div className="xl:hidden">
              <TableOfContentsFloating contentId={CONTENT_ID} />
            </div>

            <Prose
              id={CONTENT_ID}
              className="mt-10 [&_:is(h2,h3)]:scroll-mt-24"
              data-mdx-content
            >
              {children}
            </Prose>
          </article>
        </div>
      </div>
    </Container>
  )
}
