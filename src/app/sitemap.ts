import type { MetadataRoute } from 'next'

import { getAllArticles } from '@/lib/articles'
import { absoluteUrl } from '@/lib/siteUrl'
import { workProjects } from '@/lib/work/projects'
import { listPublicProjects } from '@/lib/work/publicProjects'

// Live client projects are listed and indexed by design, so they belong here
// alongside the static pages. See docs/portal-concept.md.
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['/', '/about', '/work', '/articles', '/writing'].map(
    (route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
    }),
  )

  const articles = (await getAllArticles()).map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: new Date(article.date),
  }))

  const caseStudies = workProjects
    .filter((project) => project.caseStudy)
    .map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: new Date(),
    }))

  const staticSlugs = new Set(workProjects.map((project) => project.slug))
  const live = (await listPublicProjects())
    .filter((project) => !staticSlugs.has(project.slug))
    .map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: new Date(),
    }))

  return [...staticRoutes, ...caseStudies, ...live, ...articles]
}
