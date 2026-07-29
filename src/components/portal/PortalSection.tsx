export function PortalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
        {title}
      </h2>
      <div className="mt-4 rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        {children}
      </div>
    </section>
  )
}
