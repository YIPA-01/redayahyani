import {
  Box,
  Diagram,
  Edge,
  Fragment,
  Label,
} from '@/components/case-study/Diagram'

export function Architecture() {
  return (
    <Diagram
      id="rm-arch"
      viewBox="0 0 800 400"
      minWidth={620}
      title="Architecture. Visitors load the Next.js app from Vercel, which prerenders locale routes and fetches public data from the API on the server. The browser then calls the Laravel API on Railway directly with a Sanctum session cookie, and holds a websocket to Reverb. The admin console is a separate Next.js app with its own session. On Railway, the Laravel API runs on FrankenPHP next to a queue worker and Reverb, backed by MySQL, with Redis caching match rankings. The worker sends email through Resend and Web Push."
      caption="Two hosts, split by what each is good at. Vercel serves prerendered pages close to the audience; Railway runs the long-lived pieces a serverless platform cannot: the queue worker and the websocket server."
    >
      {(m) => (
        <>
          <Box
            x={10}
            y={20}
            w={190}
            h={120}
            title="Visitors"
            lines={['fr · ar · en', 'RTL in Arabic', 'installable PWA']}
          />
          <Box
            x={250}
            y={20}
            w={210}
            h={120}
            title="Next.js 16 on Vercel"
            lines={[
              'next-intl locale routes',
              'ISR, listings 60 s',
              'image optimisation',
              'region cdg1',
            ]}
          />
          <Box
            x={250}
            y={190}
            w={210}
            h={90}
            title="Admin console"
            lines={['own origin and session', 'TOTP 2FA, audit log']}
          />
          <Box
            x={250}
            y={330}
            w={210}
            h={50}
            variant="dashed"
            title="Resend, Web Push"
          />

          <Fragment x={510} y={10} w={280} h={300} label="Railway" />
          <Box
            x={525}
            y={40}
            w={250}
            h={80}
            variant="accent"
            title="Laravel 12 API"
            lines={['FrankenPHP, OPcache', 'Sanctum session cookies']}
          />
          <Box x={525} y={135} w={120} h={70} title="MySQL 8" />
          <Box
            x={655}
            y={135}
            w={120}
            h={70}
            title="Redis"
            lines={['ranking cache']}
          />
          <Box
            x={525}
            y={225}
            w={120}
            h={70}
            title="Worker"
            lines={['mail, push']}
          />
          <Box
            x={655}
            y={225}
            w={120}
            h={70}
            title="Reverb"
            lines={['websockets']}
          />

          <Edge d="M200,70 H248" end={m.arrow} />
          <Label x={204} y={62}>
            pages
          </Label>
          <Edge d="M460,80 H523" end={m.arrow} />
          <Label x={468} y={72}>
            SSR
          </Label>

          <Edge d="M105,140 V160 H500 V108 H523" end={m.arrow} />
          <Label x={290} y={155}>
            API calls, session cookie
          </Label>
          <Edge d="M460,235 H490 V114 H523" end={m.arrow} />

          <Edge d="M80,140 V392 H715 V297" end={m.arrow} dashed />
          <Label x={560} y={386}>
            websocket
          </Label>

          <Edge d="M525,260 H480 V355 H462" end={m.arrow} />
        </>
      )}
    </Diagram>
  )
}
