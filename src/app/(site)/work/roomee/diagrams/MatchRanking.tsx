import { Box, Diagram, Edge, Label } from '@/components/case-study/Diagram'

// backend/app/Services/Matching/MatchQuery.php and config/matching.php.
export function MatchRanking() {
  return (
    <Diagram
      id="rm-rank"
      viewBox="0 0 760 290"
      minWidth={600}
      title="Activity diagram of ranking. A viewer's request first checks the cache. On a hit, the cached ranked ids become the page. On a miss, stage A runs in SQL with indexed filters and a coarse CASE ordering, limited to 300 candidates. Stage B scores each candidate exactly in PHP, with a confidence value and per-factor results. The candidates are sorted by score, then by id, the ranked ids are cached in Redis for 300 seconds under a key that includes the viewer's profile update time, and the page is returned."
      caption="Two stages, because the exact score cannot be written as an indexable SQL expression: it renormalises over whichever factors have data. SQL narrows the corpus cheaply, PHP scores a bounded window exactly, so the cost tracks the window, not the number of listings or tenants. Only the flatmate directory uses the cache; a host’s applicant list is small and changes with every request, so it skips it."
    >
      {(m) => (
        <>
          <Box
            x={10}
            y={40}
            w={140}
            h={70}
            title="Viewer"
            lines={['profile, filters']}
          />
          <path
            d="M215,40 L250,75 L215,110 L180,75 z"
            className="fill-surface stroke-ink"
            strokeWidth="1.25"
          />
          <text
            x="215"
            y="79"
            textAnchor="middle"
            className="fill-ink font-mono text-[10px]"
          >
            cached?
          </text>

          <Box
            x={290}
            y={20}
            w={200}
            h={110}
            title="Stage A: SQL"
            lines={['indexed filters', 'coarse CASE order', 'limit 300']}
          />
          <Box
            x={540}
            y={20}
            w={210}
            h={110}
            variant="accent"
            title="Stage B: PHP"
            lines={['CompatibilityService', 'exact score per row', 'confidence, factors']}
          />
          <Box
            x={540}
            y={190}
            w={210}
            h={80}
            title="Sort"
            lines={['score desc, then id']}
          />
          <Box
            x={290}
            y={190}
            w={200}
            h={80}
            title="Redis, 300 s"
            lines={['key has updated_at']}
          />
          <Box
            x={10}
            y={190}
            w={230}
            h={80}
            title="Page of results"
            lines={['with match badges']}
          />

          <Edge d="M150,75 H178" end={m.arrow} />
          <Edge d="M250,75 H288" end={m.arrow} />
          <Label x={256} y={68}>
            no
          </Label>
          <Edge d="M215,110 V188" end={m.arrow} />
          <Label x={221} y={152}>
            yes
          </Label>
          <Edge d="M490,75 H538" end={m.arrow} />
          <Edge d="M645,130 V188" end={m.arrow} />
          <Edge d="M540,230 H492" end={m.arrow} />
          <Edge d="M290,230 H242" end={m.arrow} />
        </>
      )}
    </Diagram>
  )
}
