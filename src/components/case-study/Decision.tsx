export interface DecisionOption {
  name: string
  note: React.ReactNode
  chosen?: boolean
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-4">
      <span className="font-mono text-[11px] uppercase leading-7 tracking-[0.08em] text-muted">
        {label}
      </span>
      <div className="min-w-0 text-[15px] leading-relaxed text-ink">
        {children}
      </div>
    </div>
  )
}

// An architecture decision record. Rejected options stay visible, because the
// option turned down is what shows the judgment.
export function Decision({
  id,
  refs,
  title,
  context,
  options,
  consequences,
}: {
  id: string
  refs?: string
  title: string
  context: React.ReactNode
  options: Array<DecisionOption>
  consequences: React.ReactNode
}) {
  return (
    <article className="not-prose my-6 rounded-2xl border border-line bg-surface">
      <header className="flex flex-col gap-1.5 border-b border-line px-5 py-4">
        <span className="font-mono text-xs text-coral-text">
          {id}
          {refs ? ` · ${refs}` : ''}
        </span>
        <h4 className="text-lg font-medium leading-snug text-ink">{title}</h4>
      </header>
      <Row label="Context">{context}</Row>
      <Row label="Options">
        <ul className="flex flex-col gap-2">
          {options.map((option) => (
            <li
              key={option.name}
              className="grid grid-cols-[1.125rem_minmax(0,1fr)] gap-2"
            >
              <span
                aria-hidden="true"
                className={
                  option.chosen
                    ? 'font-bold text-coral-text'
                    : 'text-xs leading-7 text-muted'
                }
              >
                {option.chosen ? '✓' : '✕'}
              </span>
              <span>
                <span className="sr-only">
                  {option.chosen ? 'Chosen: ' : 'Rejected: '}
                </span>
                <b
                  className={
                    option.chosen ? 'font-semibold' : 'font-medium text-muted'
                  }
                >
                  {option.name}.
                </b>{' '}
                {option.note}
              </span>
            </li>
          ))}
        </ul>
      </Row>
      <Row label="Consequences">{consequences}</Row>
    </article>
  )
}
