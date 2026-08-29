import type { ProjectCategory } from "@/lib/content";

/* ---------------------------------------------------------------------------
 * ProjectVisual.tsx
 * ---------------------------------------------------------------------------
 * Generated SVG artwork standing in for a project screenshot.
 *
 * WHY NOT SCREENSHOTS? Three of these projects are terminal programs — a photo
 * of scrolling text is not a useful thumbnail, and a mocked-up browser chrome
 * around a CLI would be a lie. These visuals are deliberately abstract: each
 * one diagrams what the project actually *does*, so the card reads at a glance
 * without pretending to be a UI that doesn't exist.
 *
 *   blue-team  traffic waveform with two flagged anomaly spikes
 *   red-team   key-space grid being exhaustively searched
 *   systems    concentric socket rings with client connections
 *   web        stacked review scores
 *
 * All values are hard-coded (never Math.random) so server and client markup
 * match and hydration stays clean.
 *
 * TO SWAP IN A REAL SCREENSHOT: drop the image in /public and replace
 * <ProjectVisual/> in Projects.tsx with next/image.
 * ------------------------------------------------------------------------- */

const accentFor: Record<ProjectCategory, string> = {
  "blue-team": "text-azure",
  "red-team": "text-signal",
  web: "text-accent-text",
  systems: "text-fg",
};

/* Pre-computed traffic waveform. Indices 17 and 31 are the "anomalies". */
const TRAFFIC = [
  8, 14, 10, 18, 12, 9, 16, 11, 20, 13, 8, 17, 12, 15, 9, 19, 11, 46, 14, 10,
  16, 8, 13, 18, 11, 15, 9, 12, 17, 10, 14, 52, 12, 9, 16, 11, 18, 13, 8, 15,
];

/* How many cells of the 12x6 key-space grid read as "already searched". */
const KEYSPACE_TOTAL = 72;
const KEYSPACE_SEARCHED = 41;

export function ProjectVisual({
  category,
  className = "",
}: {
  category: ProjectCategory;
  className?: string;
}) {
  const tint = accentFor[category];

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-lg bg-sunken ${className}`}
    >
      {/* Shared hairline grid backdrop */}
      <svg className="absolute inset-0 size-full opacity-40" aria-hidden>
        <defs>
          <pattern id={`grid-${category}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-line" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
      </svg>

      <svg viewBox="0 0 400 200" className="relative size-full" fill="none" preserveAspectRatio="xMidYMid meet">
        {category === "blue-team" && (
          <g className={tint}>
            {/* Baseline traffic — anomalies rendered in the signal colour. */}
            {TRAFFIC.map((h, i) => {
              const isAnomaly = h > 40;
              return (
                <rect
                  key={i}
                  x={12 + i * 9.4}
                  y={150 - h}
                  width="3.5"
                  height={h}
                  rx="1.75"
                  className={isAnomaly ? "fill-signal" : "fill-current opacity-[0.45]"}
                />
              );
            })}
            {/* Detection threshold */}
            <line x1="12" y1="112" x2="388" y2="112" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" className="opacity-60" />
            <text x="12" y="176" className="fill-current font-mono opacity-70" fontSize="9" letterSpacing="1.5">
              THRESHOLD EXCEEDED · 2 ALERTS
            </text>
          </g>
        )}

        {category === "red-team" && (
          <g className={tint}>
            {/* 12x6 key-space grid, filling left to right. */}
            {Array.from({ length: KEYSPACE_TOTAL }, (_, i) => {
              const col = i % 12;
              const row = Math.floor(i / 12);
              const done = i < KEYSPACE_SEARCHED;
              return (
                <rect
                  key={i}
                  x={16 + col * 30}
                  y={30 + row * 20}
                  width="22"
                  height="13"
                  rx="2"
                  className={done ? "fill-current opacity-70" : "fill-current opacity-[0.12]"}
                />
              );
            })}
            <text x="16" y="176" className="fill-current font-mono opacity-70" fontSize="9" letterSpacing="1.5">
              KEYSPACE {KEYSPACE_SEARCHED} / {KEYSPACE_TOTAL} SEARCHED
            </text>
          </g>
        )}

        {category === "systems" && (
          <g className={tint}>
            {/* Server at centre, clients on concentric rings. */}
            <circle cx="200" cy="92" r="70" stroke="currentColor" strokeWidth="0.75" className="opacity-25" />
            <circle cx="200" cy="92" r="46" stroke="currentColor" strokeWidth="0.75" className="opacity-40" />
            <circle cx="200" cy="92" r="9" className="fill-accent" />
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = 200 + Math.cos(rad) * 70;
              const y = 92 + Math.sin(rad) * 70;
              return (
                <g key={i}>
                  <line x1="200" y1="92" x2={x} y2={y} stroke="currentColor" strokeWidth="0.75" className="opacity-40" />
                  <circle cx={x} cy={y} r="5" className="fill-current opacity-80" />
                </g>
              );
            })}
            <text x="16" y="182" className="fill-current font-mono opacity-70" fontSize="9" letterSpacing="1.5">
              6 CLIENTS · 1 SOCKET · THREADED
            </text>
          </g>
        )}

        {category === "web" && (
          <g className={tint}>
            {/* Four review axes with score bars. */}
            {[
              { label: "PERFORMANCE", score: 0.82 },
              { label: "SECURITY", score: 0.64 },
              { label: "READABILITY", score: 0.91 },
              { label: "MAINTAINABILITY", score: 0.73 },
            ].map((axis, i) => (
              <g key={axis.label} transform={`translate(16 ${34 + i * 34})`}>
                <text className="fill-current font-mono opacity-60" fontSize="8" letterSpacing="1.4" y="0">
                  {axis.label}
                </text>
                <rect x="0" y="8" width="368" height="6" rx="3" className="fill-current opacity-[0.12]" />
                <rect x="0" y="8" width={368 * axis.score} height="6" rx="3" className="fill-accent" />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
