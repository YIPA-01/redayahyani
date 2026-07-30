import Link from 'next/link'

export function StatTile({
  label,
  value,
  hint,
  href,
}: {
  label: string
  value: string
  hint?: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-zinc-200 p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      )}
    </Link>
  )
}
