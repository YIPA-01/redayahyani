import {
  Diagram,
  Fragment,
  Lifeline,
  Message,
} from '@/components/case-study/Diagram'

// supabase/migrations/20260615000001_appointment_reminder_cron.sql,
// src/app/api/notifications/appointment-reminder, src/lib/server/webPush.ts,
// and worker/index.js in the Path90 repo.
const CRON = 70
const ROUTE = 230
const DB = 400
const PUSH = 560
const SW = 700

export function ReminderPipeline() {
  return (
    <Diagram
      id="p90-reminders"
      viewBox="0 0 780 400"
      minWidth={620}
      title="Sequence diagram of an appointment reminder. Every minute pg_cron uses pg_net to call the reminder route on Vercel with a bearer secret. The route rejects the call unless the secret matches. It asks Postgres, as the service role, for pending appointments in the next hour whose one-hour reminder has not been sent. For each row it sends a Web Push to every subscription, the push service delivers a push event to the phone's service worker, which shows the notification, and the route then writes the sent flags, failing the run if that write fails. The same then runs for appointments one to twenty-four hours away."
      caption="One reminder, end to end. The sent flag is written after each push, and a failed write fails the run with an error in the cron log, instead of quietly sending the same reminder again every minute. Subscriptions the push service reports as gone (404 or 410) are deleted."
    >
      {(m) => (
        <>
          <Lifeline x={CRON} top={14} bottom={388} label="pg_cron" w={110} />
          <Lifeline x={ROUTE} top={14} bottom={388} label="Reminder route" />
          <Lifeline x={DB} top={14} bottom={388} label="Postgres" w={120} />
          <Lifeline x={PUSH} top={14} bottom={388} label="Push service" w={120} />
          <Lifeline x={SW} top={14} bottom={388} label="Service worker" w={124} />

          <Message
            from={CRON}
            to={ROUTE}
            y={82}
            label="GET, every minute"
            markers={m}
          />
          <Message
            from={ROUTE}
            to={ROUTE}
            y={92}
            label="check secret"
            markers={m}
            accent
          />
          <Message
            from={ROUTE}
            to={DB}
            y={146}
            label="due in 1 h, not yet sent"
            markers={m}
          />
          <Message from={DB} to={ROUTE} y={172} label="rows" markers={m} reply />

          <Fragment x={150} y={188} w={612} h={140} label="loop each row" />
          <Message
            from={ROUTE}
            to={PUSH}
            y={232}
            label="web-push, VAPID"
            markers={m}
          />
          <Message
            from={PUSH}
            to={SW}
            y={258}
            label="push event"
            markers={m}
          />
          <Message
            from={SW}
            to={SW}
            y={266}
            label="show"
            markers={m}
          />
          <Message
            from={ROUTE}
            to={DB}
            y={314}
            label="set sent flags, or throw"
            markers={m}
            accent
          />
          <Message
            from={ROUTE}
            to={DB}
            y={360}
            label="then due in 1 to 24 h"
            markers={m}
          />
        </>
      )}
    </Diagram>
  )
}
