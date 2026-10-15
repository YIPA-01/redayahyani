import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // The site paints its own canvas over the root body color, so the portal,
    // which renders outside this layout, keeps the original background.
    // self-start: as a stretched flex item it would stop at the viewport
    // height, and the root body color would show below the fold.
    <div className="flex min-h-full w-full flex-col self-start bg-canvas font-sans text-ink">
      {/* First stop for keyboard and screen reader users: straight past the
          header to the page itself. */}
      <a
        href="#main"
        className="sr-only rounded-full bg-ink text-sm font-medium text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-auto focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  )
}
