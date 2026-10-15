import clsx from 'clsx'

export type Priority = 'must' | 'should' | 'could'

export interface Requirement {
  id: string
  text: React.ReactNode
  // Where the requirement came from: a pain point, a use case, the brief.
  refs?: string
  priority?: Priority
}

const priorityStyles: Record<Priority, string> = {
  must: 'border-coral text-coral-text',
  should: 'border-ink text-ink',
  could: 'border-line text-muted',
}

// Numbered so later sections (decisions, traceability) can cite them.
export function Requirements({ items }: { items: Array<Requirement> }) {
  return (
    <ul className="not-prose my-8 border-t border-line">
      {items.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-line py-3"
        >
          <span className="font-mono text-xs text-coral-text">{item.id}</span>
          <p className="text-[15px] leading-normal text-ink">
            {item.text}
            {item.refs && (
              <span className="mt-0.5 block font-mono text-xs text-muted">
                {item.refs}
              </span>
            )}
          </p>
          {item.priority ? (
            <span
              className={clsx(
                'whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.06em]',
                priorityStyles[item.priority],
              )}
            >
              {item.priority}
            </span>
          ) : (
            <span />
          )}
        </li>
      ))}
    </ul>
  )
}
