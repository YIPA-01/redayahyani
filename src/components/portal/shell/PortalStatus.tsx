// Status states for the portal. PortalLoading and PortalEmpty render inside
// the shell as ordinary page content. FullPageStatus is for the gates, which
// run before the shell exists and so have to fill the viewport themselves.

export function PortalLoading({ label = 'Loading...' }: { label?: string }) {
  return <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
}

export function PortalEmpty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-500 dark:text-zinc-400">{children}</p>
}

export function FullPageStatus({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <div className="w-full max-w-md text-center">{children}</div>
    </div>
  )
}
