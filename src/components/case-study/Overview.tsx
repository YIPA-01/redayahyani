import clsx from 'clsx'

// Section 1 of docs/case-study.md. A label/value list for the facts a reader
// needs first. Role, year, stack, and link already come from CaseStudyLayout,
// so this holds only what projects.ts does not.
export function Overview({ children }: { children: React.ReactNode }) {
  return (
    <dl className="not-prose my-10 border-t border-line">{children}</dl>
  )
}

export function OverviewRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1 border-b border-line py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6">
      <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted sm:pt-0.5">
        {label}
      </dt>
      <dd className="min-w-0 text-[15px] leading-relaxed text-ink [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </dd>
    </div>
  )
}

// The page's one serif statement (docs/brand.md: one per page at most).
export function Goal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    // A div, not a p: MDX wraps multi-line children in their own paragraph.
    <div
      className={clsx(
        'font-serif text-2xl italic leading-snug text-ink',
        className,
      )}
    >
      {children}
    </div>
  )
}
