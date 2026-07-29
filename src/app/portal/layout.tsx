import { type Metadata } from 'next'

import { PortalAuthProvider } from '@/components/portal/PortalAuthProvider'

// Private area: never indexed, never linked from the site nav.
export const metadata: Metadata = {
  title: 'Portal',
  robots: { index: false, follow: false },
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>
}
