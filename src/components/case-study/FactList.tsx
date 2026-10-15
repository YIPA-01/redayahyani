// Short grouped lists side by side: goals and stakeholders, constraints and
// scope, quality attributes.
export function FactList({
  groups,
}: {
  groups: Array<{ title: string; items: Array<React.ReactNode> }>
}) {
  return (
    <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <div
          key={group.title}
          className="flex flex-col gap-3 rounded-xl border border-line bg-surface px-5 py-4"
        >
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
            {group.title}
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-4 text-[15px] leading-normal text-ink marker:text-muted">
            {group.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
