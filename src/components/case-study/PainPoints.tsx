export interface PainPoint {
  title: string
  // A real quote from research. Leave it out rather than paraphrase one.
  quote?: string
  // How the pain point guides the design.
  guide: React.ReactNode
  refs?: string
}

// Section 3 of docs/case-study.md. Numbered because later sections cite them.
export function PainPoints({ items }: { items: Array<PainPoint> }) {
  return (
    <ol className="not-prose my-8 grid gap-6 sm:grid-cols-2">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="flex flex-col gap-2 border-t-2 border-ink pt-3.5"
        >
          <span className="font-mono text-xs tracking-[0.08em] text-coral-text">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h4 className="text-lg font-medium leading-snug text-ink">
            {item.title}
          </h4>
          {item.quote && (
            <q className="text-[15px] italic text-muted">{item.quote}</q>
          )}
          <p className="text-[15px] leading-normal text-ink">{item.guide}</p>
          {item.refs && (
            <span className="font-mono text-xs text-muted">{item.refs}</span>
          )}
        </li>
      ))}
    </ol>
  )
}
