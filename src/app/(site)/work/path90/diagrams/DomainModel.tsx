import {
  ClassBox,
  Diagram,
  Edge,
  Label,
  classHeight,
} from '@/components/case-study/Diagram'

// The core of the real schema (supabase/schemas in the Path90 repo), not the
// first class diagram. Classes tagged "added" did not exist in
// UML/classDiagram.yaml; coral attributes are copied from the template when a
// task is assigned.
const W = 165
const col = (i: number) => 10 + i * 205
const ROW1 = 20
const ROW2 = 214

const user = {
  attrs: [
    'release_date',
    'timezone',
    'focus_area',
    'role',
    'is_active',
    'last_active_at',
  ],
  methods: ['status()', 'programDay()', 'hasGraduated()'],
}
const userTask = [
  'due_date',
  { name: 'is_mandatory', accent: true },
  { name: 'priority', accent: true },
  { name: 'frequency', accent: true },
  'is_completed',
  'completed_by_admin',
  'due_reminder_sent',
]

export function DomainModel() {
  let userBottom = ROW2 + classHeight(user.attrs.length, user.methods.length)
  let userTaskBottom = ROW2 + classHeight(userTask.length)
  let mid = (i: number) => col(i) + W / 2

  return (
    <Diagram
      id="p90-domain"
      viewBox="0 0 800 470"
      minWidth={620}
      title="Domain model. A roadmap template has ordered modules, and each module includes task templates (many to many). A task template has steps. Assigning a template to a participant creates a user task, which copies the mandatory flag, priority, and frequency from the template, and which has one step completion per step. A participant has many user tasks and appointments, and a user task can link to an appointment. A participant follows one roadmap template, or the default one."
      caption="The schema the app runs on. Four of these eight classes (tagged “added”) were not in the first class diagram: the roadmap and per-step progress arrived once real tasks needed structure. Coral fields are copied from the template at assignment, so editing a template never rewrites a participant’s history."
    >
      {(m) => (
        <>
          {/* Row 1: the program as designed by the case manager */}
          <Edge d={`M${col(0) + W},60 H${col(1)}`} start={m.diamond} />
          <Label x={col(1) - 6} y={54} anchor="end">
            1..*
          </Label>

          <Edge d={`M${col(1) + W},60 H${col(2)}`} />
          <Label x={col(1) + W + 6} y={54}>
            *
          </Label>
          <Label x={col(2) - 6} y={54} anchor="end">
            *
          </Label>

          <Edge d={`M${col(2) + W},60 H${col(3)}`} start={m.diamond} />
          <Label x={col(3) - 6} y={54} anchor="end">
            1..*
          </Label>

          {/* Template to assignment, step to completion */}
          <Edge d={`M${mid(2)},${ROW1 + classHeight(5)} V${ROW2}`} />
          <Label x={mid(2) + 6} y={ROW1 + classHeight(5) + 14}>
            1
          </Label>
          <Label x={mid(2) + 6} y={ROW2 - 6}>
            *
          </Label>
          <Label x={mid(2) - 8} y={(ROW1 + classHeight(5) + ROW2) / 2 + 4} anchor="end">
            assigned as
          </Label>

          <Edge d={`M${mid(3)},${ROW1 + classHeight(2)} V${ROW2}`} />
          <Label x={mid(3) + 6} y={ROW1 + classHeight(2) + 14}>
            1
          </Label>
          <Label x={mid(3) + 6} y={ROW2 - 6}>
            *
          </Label>

          {/* Participant follows a roadmap */}
          <Edge d={`M${mid(0)},${ROW2} V${ROW1 + classHeight(2)}`} />
          <Label x={mid(0) + 6} y={ROW2 - 6}>
            *
          </Label>
          <Label x={mid(0) + 6} y={ROW1 + classHeight(2) + 14}>
            0..1
          </Label>
          <Label x={mid(0) - 8} y={(ROW1 + classHeight(2) + ROW2) / 2 + 4} anchor="end">
            follows
          </Label>

          {/* Row 2 */}
          <Edge d={`M${col(0) + W},250 H${col(1)}`} />
          <Label x={col(0) + W + 6} y={244}>
            1
          </Label>
          <Label x={col(1) - 6} y={244} anchor="end">
            *
          </Label>

          <Edge d={`M${col(2)},250 H${col(1) + W}`} dashed />
          <Label x={col(2) - 6} y={264} anchor="end">
            *
          </Label>
          <Label x={col(1) + W + 6} y={244}>
            0..1
          </Label>

          <Edge d={`M${col(2) + W},250 H${col(3)}`} start={m.diamond} />
          <Label x={col(3) - 6} y={244} anchor="end">
            *
          </Label>

          <Edge
            d={`M${mid(0)},${userBottom} V448 H${mid(2)} V${userTaskBottom}`}
          />
          <Label x={mid(0) + 6} y={userBottom + 14}>
            1
          </Label>
          <Label x={mid(2) + 6} y={userTaskBottom + 14}>
            *
          </Label>
          <Label x={(mid(0) + mid(2)) / 2} y={442} anchor="middle">
            has
          </Label>

          <ClassBox
            x={col(0)}
            y={ROW1}
            w={W}
            name="RoadmapTemplate"
            attrs={['name', 'is_default']}
            tag="added"
          />
          <ClassBox
            x={col(1)}
            y={ROW1}
            w={W}
            name="RoadmapModule"
            attrs={['phase', 'week_start', 'week_end', 'position']}
            tag="added"
          />
          <ClassBox
            x={col(2)}
            y={ROW1}
            w={W}
            name="Task"
            attrs={[
              'is_template',
              'is_mandatory',
              'priority',
              'frequency',
              'categories',
            ]}
          />
          <ClassBox
            x={col(3)}
            y={ROW1}
            w={W}
            name="TaskStep"
            attrs={['label', 'position']}
            tag="added"
          />
          <ClassBox
            x={col(0)}
            y={ROW2}
            w={W}
            name="User"
            attrs={user.attrs}
            methods={user.methods}
          />
          <ClassBox
            x={col(1)}
            y={ROW2}
            w={W}
            name="Appointment"
            attrs={[
              'scheduled_at',
              'is_mandatory',
              'status',
              'lat, lng',
              'reminder_24h_sent',
              'reminder_1h_sent',
            ]}
          />
          <ClassBox x={col(2)} y={ROW2} w={W} name="UserTask" attrs={userTask} />
          <ClassBox
            x={col(3)}
            y={ROW2}
            w={W}
            name="StepCompletion"
            attrs={['is_completed']}
            tag="added"
          />
        </>
      )}
    </Diagram>
  )
}
