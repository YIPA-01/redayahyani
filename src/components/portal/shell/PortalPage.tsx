import clsx from 'clsx'

// Page width. Textual pages (messages, progress) read better narrow; lists
// and forms get room.
export function PortalPage({
  width = 'wide',
  children,
}: {
  width?: 'prose' | 'wide'
  children: React.ReactNode
}) {
  return (
    <div
      className={clsx(
        'mx-auto w-full',
        width === 'prose' ? 'max-w-3xl' : 'max-w-5xl',
      )}
    >
      {children}
    </div>
  )
}
