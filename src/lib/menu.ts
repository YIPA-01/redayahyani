import { type MenuCounts } from '@/components/MobileMenu'
import { countArticles } from '@/lib/articles'
import { engagements } from '@/lib/services'
import { workProjects } from '@/lib/work/projects'

// Real counts for the cards in the mobile menu, read on the server by every
// layout that renders the site header.
export async function getMenuCounts(): Promise<MenuCounts> {
  return {
    work: workProjects.length,
    services: engagements.length,
    articles: await countArticles(),
  }
}
