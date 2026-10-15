import {
  Diagram,
  Edge,
  InitialState,
  Label,
  State,
} from '@/components/case-study/Diagram'

// The badge a case manager sees, as computed by public.user_status() and
// public.user_has_graduated() in the Path90 repo. Nothing here is stored: the
// state is recomputed on every read, and "inactive" is checked first.
export function ParticipantStatus() {
  return (
    <Diagram
      id="p90-status"
      viewBox="0 0 700 330"
      minWidth={560}
      title="State diagram of a participant's status. A participant starts on track after their first visit. On track becomes at risk when a mandatory task is overdue, a mandatory appointment is missed, or fewer than half the tasks of the last 14 days are done, and returns to on track when they catch up. Either state becomes inactive after 7 days without activity, and opening the app recomputes the status. On track becomes graduated at day 90 with no mandatory task open."
      caption="What the case manager’s badge means. The state is never stored: user_status() recomputes it on every read, and inactivity is checked before anything else, so a participant who disappears shows as inactive even if they were behind."
    >
      {(m) => (
        <>
          <InitialState x={36} y={150} />
          <Edge d="M44,150 H118" end={m.arrow} />
          <Label x={50} y={142}>
            first visit
          </Label>

          {/* On track and at risk */}
          <Edge d="M262,136 C320,80 370,62 428,62" end={m.arrow} />
          <Label x={258} y={34}>
            mandatory item missed, or
          </Label>
          <Label x={258} y={47}>
            under 50% done in 14 days
          </Label>
          <Edge d="M428,82 C372,90 322,118 264,146" end={m.arrow} />
          <Label x={330} y={134}>
            catches up
          </Label>

          {/* On track and inactive */}
          <Edge d="M262,164 C320,222 370,240 428,240" end={m.arrow} />
          <Label x={276} y={266}>
            7 days without activity
          </Label>
          <Edge d="M428,220 C372,212 322,186 264,158" end={m.arrow} />
          <Label x={318} y={174}>
            opens the app
          </Label>

          {/* At risk and inactive */}
          <Edge d="M478,90 V212" end={m.arrow} />
          <Label x={472} y={150} anchor="end">
            7 days
          </Label>
          <Edge d="M532,212 V90" end={m.arrow} />
          <Label x={538} y={146}>
            opens the app,
          </Label>
          <Label x={538} y={159}>
            still behind
          </Label>

          {/* Graduation */}
          <Edge d="M190,176 V262" end={m.arrow} />
          <Label x={198} y={214}>
            day 90 and no
          </Label>
          <Label x={198} y={227}>
            mandatory task open
          </Label>

          <State x={120} y={124} w={142} label="On track" sub="on_track" />
          <State x={430} y={38} w={150} label="At risk" sub="at_risk" />
          <State x={430} y={214} w={150} label="Inactive" sub="inactive" />
          <State
            x={120}
            y={264}
            w={142}
            label="Graduated"
            sub="user_has_graduated()"
            final
          />
        </>
      )}
    </Diagram>
  )
}
