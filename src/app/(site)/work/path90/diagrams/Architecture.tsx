import { Box, Diagram, Edge, Label } from '@/components/case-study/Diagram'

const CLIENT_LINES = [
  'installed, phone-first',
  'service worker (next-pwa)',
  'query cache in IndexedDB',
  'offline task queue',
]
const ADMIN_LINES = ['caseload, alerts', 'roadmap editor', 'XLSX outcome export']

export function Architecture() {
  return (
    <Diagram
      id="p90-arch"
      viewBox="0 0 780 400"
      minWidth={600}
      title="Architecture. Participants on phones and case managers in browsers load pages from Next.js on Vercel and read and write Supabase directly through supabase-js under row level security. Supabase runs Postgres, Auth, Realtime, pg_cron with pg_net, and Storage. pg_cron calls API routes on Vercel every minute and daily; those routes query Postgres with the service role and send Web Push through Apple and Google push services, which deliver to the phone's service worker."
      caption="Most reads and writes skip the server: the browser talks to Supabase directly, and row level security is the only thing between a participant and someone else’s data. Vercel serves pages and runs the scheduled routes."
    >
      {(m) => (
        <>
          <Edge d="M202,70 H248" start={m.arrow} end={m.arrow} />
          <Label x={206} y={62}>
            pages
          </Label>

          <Edge d="M452,80 H558" end={m.arrow} />
          <Label x={458} y={72}>
            service role
          </Label>
          <Edge d="M558,124 H454" end={m.arrow} />
          <Label x={458} y={116}>
            pg_net, cron
          </Label>

          <Edge d="M202,230 H558" start={m.arrow} end={m.arrow} />
          <Label x={455} y={222} anchor="middle">
            supabase-js, under RLS
          </Label>
          <Edge d="M558,270 H202" end={m.arrow} dashed />
          <Label x={455} y={286} anchor="middle">
            Realtime: notifications
          </Label>

          <Edge d="M350,162 V338" end={m.arrow} />
          <Label x={356} y={196}>
            web-push
          </Label>
          <Edge d="M250,365 H105 V314" end={m.arrow} />
          <Label x={113} y={357}>
            push event
          </Label>

          <g>
            <rect
              x="10"
              y="20"
              width="190"
              height="292"
              rx="10"
              className="fill-surface stroke-ink"
              strokeWidth="1.25"
            />
            <text
              x="24"
              y="46"
              className="fill-ink font-sans text-[13px] font-medium"
            >
              Participant PWA
            </text>
            {CLIENT_LINES.map((line, i) => (
              <text
                key={line}
                x="24"
                y={68 + i * 16}
                className="fill-muted font-mono text-[10.5px]"
              >
                {line}
              </text>
            ))}
            <path d="M24,148 H186" className="stroke-line" strokeWidth="1" />
            <text
              x="24"
              y="176"
              className="fill-ink font-sans text-[13px] font-medium"
            >
              Case manager dashboard
            </text>
            {ADMIN_LINES.map((line, i) => (
              <text
                key={line}
                x="24"
                y={198 + i * 16}
                className="fill-muted font-mono text-[10.5px]"
              >
                {line}
              </text>
            ))}
          </g>

          <Box
            x={250}
            y={20}
            w={200}
            h={140}
            title="Next.js 14 on Vercel"
            lines={[
              'middleware: role from DB',
              'server components',
              'cron API routes',
              'web-push with VAPID',
            ]}
          />
          <Box
            x={560}
            y={20}
            w={210}
            h={292}
            variant="accent"
            title="Supabase"
            lines={[
              'Postgres with RLS',
              'Auth: email and OTP',
              'Realtime',
              'pg_cron, pg_net, Vault',
              'Storage: resource files',
            ]}
          />
          <Box
            x={250}
            y={340}
            w={200}
            h={50}
            variant="dashed"
            title="Apple and Google push"
          />
        </>
      )}
    </Diagram>
  )
}
