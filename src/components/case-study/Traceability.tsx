export interface TraceRow {
  req: string
  design: React.ReactNode
  implementation: React.ReactNode
  verified: React.ReactNode
}

// Requirement to design to code to evidence. Scrolls inside its own box so
// the page never scrolls sideways on a phone.
export function Traceability({ rows }: { rows: Array<TraceRow> }) {
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm leading-normal">
        <thead>
          <tr className="bg-panel">
            {['Req', 'Design', 'Implementation', 'Verified by'].map((h) => (
              <th
                key={h}
                scope="col"
                className="border-b border-line px-3.5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-ink [&_code]:font-mono [&_code]:text-[0.85em]">
          {rows.map((row) => (
            <tr key={row.req} className="border-b border-line last:border-b-0">
              <th
                scope="row"
                className="whitespace-nowrap px-3.5 py-3 align-top font-mono text-xs font-normal text-coral-text"
              >
                {row.req}
              </th>
              <td className="px-3.5 py-3 align-top">{row.design}</td>
              <td className="px-3.5 py-3 align-top">{row.implementation}</td>
              <td className="px-3.5 py-3 align-top">{row.verified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
