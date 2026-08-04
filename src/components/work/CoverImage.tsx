import Image from 'next/image'
import clsx from 'clsx'

import type { WorkProject } from '@/lib/work/projects'

// Deterministic so a project's placeholder never changes between renders or
// between the index card and the case study hero.
function hueFromSlug(slug: string) {
  let hash = 0
  for (const character of slug) {
    hash = (hash * 31 + character.charCodeAt(0)) % 360
  }
  return hash
}

/**
 * Cover art for a project. Renders the real image once one exists at
 * src/images/work/<slug>/cover.jpg and is imported in src/lib/work/projects.ts.
 * Until then it draws a slug-seeded gradient with the project logo on top, so
 * the layout is final and swapping in photography touches no code.
 */
export function CoverImage({
  project,
  className,
  sizes,
  priority = false,
}: {
  project: WorkProject
  className?: string
  sizes?: string
  priority?: boolean
}) {
  if (project.cover) {
    return (
      <Image
        src={project.cover}
        alt=""
        sizes={sizes}
        priority={priority}
        className={clsx(className, 'h-full w-full object-cover')}
      />
    )
  }

  const hue = hueFromSlug(project.slug)

  return (
    <div
      aria-hidden="true"
      className={clsx(
        className,
        'flex h-full w-full items-center justify-center',
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 45% 92%), hsl(${(hue + 40) % 360} 40% 84%))`,
      }}
    >
      {project.logo ? (
        <Image
          src={project.logo}
          alt=""
          unoptimized
          className="h-14 w-14 rounded-xl bg-white/80 object-contain p-2 shadow-sm"
        />
      ) : (
        <span className="text-4xl font-semibold text-white/70">
          {project.name.charAt(0)}
        </span>
      )}
    </div>
  )
}
