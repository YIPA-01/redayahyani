import { Layout } from '@/components/Layout'

// Every marketing route lives in this group so the portal can render its own
// dashboard shell without the site header and footer. Route groups do not
// change URLs, so every path here is unchanged.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}
