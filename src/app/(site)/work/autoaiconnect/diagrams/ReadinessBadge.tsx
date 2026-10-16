import { Diagram, Edge, Label, State } from '@/components/case-study/Diagram'

// computeBadge() in functions/src/equity/logic/badge.ts, and the rank rule in
// functions/src/notifications/logic/evaluate.ts ("improvement is an increase
// in rank, nothing else notifies"). The badge is never edited: every
// equityCalculate call appends a snapshot with a freshly computed one.
export function ReadinessBadge() {
  return (
    <Diagram
      id="aac-badge"
      viewBox="0 0 800 330"
      minWidth={620}
      title="State diagram of the readiness badge. Not Yet becomes Almost Ready when equity is positive with 7 to 12 months left on the loan or lease, and becomes Ready directly when equity is positive with 6 months or less left. Almost Ready becomes Ready when 6 months or less are left. Almost Ready and Ready fall back to Not Yet when equity turns negative. Moves up the ladder are the ones the daily sweep turns into an alert. Separately, a car that is paid off and has no catalog match cannot be valued, so it shows no badge at all."
      caption="Three badges from two inputs: the sign of the equity and the months left. Months only count down, so the ladder mostly climbs on its own as a loan ages. The coral moves up the ladder are the only ones the daily sweep turns into a badge alert. A move down shows on the dashboard but never sends one."
    >
      {(m) => (
        <>
          {/* Not Yet straight to Ready */}
          <Edge d="M110,84 C110,20 690,20 690,84" end={m.arrow} accent />
          <Label x={400} y={24} anchor="middle" tone="coral">
            positive equity, 6 months or less left
          </Label>

          {/* Up the ladder */}
          <Edge d="M180,100 H328" end={m.arrow} accent />
          <Label x={255} y={78} anchor="middle" tone="coral">
            positive equity,
          </Label>
          <Label x={255} y={91} anchor="middle" tone="coral">
            7 to 12 months left
          </Label>
          <Edge d="M470,100 H618" end={m.arrow} accent />
          <Label x={545} y={91} anchor="middle" tone="coral">
            6 months or less left
          </Label>

          {/* Back down */}
          <Edge d="M330,122 H182" end={m.arrow} />
          <Label x={255} y={142} anchor="middle">
            equity turns negative
          </Label>
          <Edge d="M690,138 C690,200 110,200 110,138" end={m.arrow} />
          <Label x={400} y={204} anchor="middle">
            equity turns negative
          </Label>

          <State x={40} y={84} w={140} label="Not Yet" sub="not_yet" />
          <State x={330} y={84} w={140} label="Almost Ready" sub="almost_ready" />
          <State x={620} y={84} w={140} label="Ready" sub="ready" />

          {/* Outside the ladder */}
          <State
            x={40}
            y={250}
            w={210}
            label="Can’t value yet"
            sub="determinable: false"
          />
          <Label x={270} y={272}>
            paid off and no catalog match: trade value and equity are null,
          </Label>
          <Label x={270} y={286}>
            not $0, and the app hides the badge
          </Label>
        </>
      )}
    </Diagram>
  )
}
