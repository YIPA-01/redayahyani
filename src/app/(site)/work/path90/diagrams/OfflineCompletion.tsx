import {
  Diagram,
  Fragment,
  Lifeline,
  Message,
} from '@/components/case-study/Diagram'

// src/lib/offlineMutations.ts and src/app/providers.tsx in the Path90 repo.
const P = 70
const UI = 240
const CACHE = 430
const DB = 600

export function OfflineCompletion() {
  return (
    <Diagram
      id="p90-offline"
      viewBox="0 0 720 420"
      minWidth={600}
      title="Sequence diagram of completing a task offline. The participant taps complete. The task screen updates at once and shows 'Saved, will sync when back online'. The mutation is paused and persisted to IndexedDB with the rest of the query cache. When the phone is back online, or the app is reopened, the paused mutation resumes and updates the user task in Supabase, where row level security checks the row belongs to the participant and was not completed by an admin. On success the task queries are refetched; on error the cache rolls back to its previous state and an error shows."
      caption="Completing a task with no signal. The mutation function is registered as a default on the query client, because a paused mutation restored from IndexedDB after the app was closed comes back without one."
    >
      {(m) => (
        <>
          <Lifeline x={P} top={14} bottom={406} label="Participant" w={110} />
          <Lifeline x={UI} top={14} bottom={406} label="Task screen" />
          <Lifeline x={CACHE} top={14} bottom={406} label="Query cache" />
          <Lifeline x={DB} top={14} bottom={406} label="Supabase" w={120} />

          <Fragment x={20} y={62} w={680} h={130} label="offline" />
          <Message from={P} to={UI} y={98} label="tap Complete" markers={m} />
          <Message
            from={UI}
            to={UI}
            y={112}
            label="optimistic update, toast"
            markers={m}
            accent
          />
          <Message
            from={UI}
            to={CACHE}
            y={158}
            label="mutation paused"
            markers={m}
          />
          <Message
            from={CACHE}
            to={CACHE}
            y={166}
            label="persisted to IndexedDB"
            markers={m}
          />

          <Fragment x={20} y={204} w={680} h={192} label="back online, or app reopened" />
          <Message
            from={CACHE}
            to={DB}
            y={244}
            label="update user_tasks"
            markers={m}
          />
          <Message
            from={DB}
            to={DB}
            y={256}
            label="RLS check"
            markers={m}
            accent
          />
          <Message from={DB} to={CACHE} y={304} label="ok" markers={m} reply />
          <Message
            from={CACHE}
            to={UI}
            y={330}
            label="refetch task lists"
            markers={m}
          />
          <Message
            from={CACHE}
            to={UI}
            y={376}
            label="on error: roll back, show error"
            markers={m}
            reply
          />
        </>
      )}
    </Diagram>
  )
}
