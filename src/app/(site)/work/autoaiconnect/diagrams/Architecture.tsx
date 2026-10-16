import { Box, Diagram, Edge, Label } from '@/components/case-study/Diagram'

// firebase.json, functions/src/index.ts and admin/ in the backend repo.
export function Architecture() {
  return (
    <Diagram
      id="aac-arch"
      viewBox="0 0 780 430"
      minWidth={620}
      title="Architecture. The Flutter app, built by another team, signs in with Firebase Auth, reads its own documents from Firestore as live streams, and calls Cloud Functions for everything that computes: 11 callables, a Stripe webhook, a scheduled sweep, and two auth triggers. The Next.js admin portal on Firebase App Hosting reads Firestore through the Admin SDK on the server and calls the same functions. The functions write Firestore and reach out to Gemini or OpenAI for the assistant, MarketCheck for comparable prices, Stripe for checkout and billing, and Firebase Cloud Messaging for push. Stripe calls back into a webhook function, and Cloud Scheduler runs the monitoring sweep once a day."
      caption="There is no REST layer. The app reads Firestore directly under the security rules and calls functions for anything that computes. The dashed box is the part I did not build."
    >
      {(m) => (
        <>
          {/* Clients to Firebase */}
          <Edge d="M192,74 H288" end={m.arrow} />
          <Label x={198} y={66}>
            streams
          </Label>
          <Edge d="M192,140 H288" end={m.arrow} />
          <Label x={198} y={132}>
            callables
          </Label>
          <Edge d="M192,300 H288" end={m.arrow} />
          <Label x={198} y={292}>
            Admin SDK
          </Label>

          {/* Functions to providers */}
          <Edge d="M492,64 H578" end={m.arrow} />
          <Edge d="M492,148 H578" end={m.arrow} />
          <Edge d="M578,232 H492" end={m.arrow} />
          <Label x={498} y={224}>
            webhook
          </Label>
          <Edge d="M492,262 H578" end={m.arrow} />
          <Edge d="M492,346 H578" end={m.arrow} />
          <Edge d="M578,394 H492" end={m.arrow} dashed />
          <Label x={498} y={386}>
            daily
          </Label>

          <Box
            x={10}
            y={20}
            w={180}
            h={150}
            variant="dashed"
            title="Flutter app"
            lines={['iOS and Android', 'FlutterFire SDK', 'another team']}
          />
          <Box
            x={10}
            y={240}
            w={180}
            h={110}
            title="Admin portal"
            lines={['Next.js, shadcn/ui', 'Firebase App Hosting']}
          />
          <Box
            x={290}
            y={20}
            w={200}
            h={400}
            variant="accent"
            title="Firebase"
            lines={[
              'Auth: email, Google, Apple',
              'Firestore + rules',
              'Cloud Functions:',
              '11 callables',
              '1 Stripe webhook',
              '1 scheduled sweep',
              '2 auth triggers',
              'Storage: avatars',
              'Secret Manager',
            ]}
          />
          <Box x={580} y={34} w={190} h={60} title="Gemini or GPT-4.1" lines={['assistant']} />
          <Box x={580} y={118} w={190} h={60} title="MarketCheck" lines={['comparable prices']} />
          <Box x={580} y={202} w={190} h={88} title="Stripe" lines={['Checkout', 'Billing Portal']} />
          <Box x={580} y={316} w={190} h={50} title="Cloud Messaging" />
          <Box x={580} y={374} w={190} h={46} title="Cloud Scheduler" />
        </>
      )}
    </Diagram>
  )
}
