export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          {title}
        </h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}
    </header>
  )
}
