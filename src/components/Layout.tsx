import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // The site paints its own canvas over the root body color, so the portal,
    // which renders outside this layout, keeps the original background.
    // self-start: as a stretched flex item it would stop at the viewport
    // height, and the root body color would show below the fold.
    <div className="flex min-h-full w-full flex-col self-start bg-canvas font-sans text-ink">
      <Header />
      <main className="flex-auto">{children}</main>
      <Footer />
    </div>
  )
}
