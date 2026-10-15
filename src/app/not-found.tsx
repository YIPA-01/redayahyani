import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Layout } from '@/components/Layout'
import { getMenuCounts } from '@/lib/menu'

// Lives outside the (site) group because it has to catch unmatched URLs
// anywhere, including under /portal, so it brings its own chrome.
export default async function NotFound() {
  return (
    <Layout menuCounts={await getMenuCounts()}>
      <Container className="flex h-full items-center pt-16 sm:pt-32">
        <div className="flex flex-col items-center">
          <p className="text-base font-semibold text-muted">404</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Page not found
          </h1>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <Button href="/" variant="secondary" className="mt-4">
            Go back home
          </Button>
        </div>
      </Container>
    </Layout>
  )
}
