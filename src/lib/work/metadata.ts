import type { Metadata } from 'next'

import { ogImageUrl } from '@/lib/siteUrl'
import { getWorkProject } from '@/lib/work/projects'

// Keeps every case study's metadata derived from one source. An MDX file that
// names a slug with no matching entry fails the build here rather than
// shipping a page with no title.
export function caseStudyMetadata(slug: string): Metadata {
  const project = getWorkProject(slug)
  if (!project) {
    throw new Error(`No entry for "${slug}" in src/lib/work/projects.ts.`)
  }

  const url = `/work/${project.slug}`

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: project.name,
      description: project.description,
      type: 'article',
      url,
      images: [ogImageUrl({ title: project.name, eyebrow: project.role })],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.name,
      description: project.description,
    },
  }
}
