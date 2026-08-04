import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

// Renders the card that LinkedIn, X, and Slack show for a shared link. No
// external font fetching on purpose: the route has to work offline and during
// a build with no network.

export const runtime = 'nodejs'

const size = { width: 1200, height: 630 }

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const title = params.get('title')?.slice(0, 120) ?? 'Reda Yahyani'
  const eyebrow = params.get('eyebrow')?.slice(0, 60)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#18181b',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(20,184,166,0.28), transparent 55%)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {eyebrow && (
            <div
              style={{
                fontSize: 28,
                color: '#2dd4bf',
                letterSpacing: '0.04em',
                marginBottom: 28,
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 70 ? 64 : 76,
              fontWeight: 700,
              color: '#fafafa',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(250,250,250,0.14)',
            paddingTop: 32,
          }}
        >
          <div style={{ fontSize: 30, color: '#e4e4e7' }}>Reda Yahyani</div>
          <div style={{ fontSize: 26, color: '#a1a1aa' }}>
            Software engineer
          </div>
        </div>
      </div>
    ),
    size,
  )
}
