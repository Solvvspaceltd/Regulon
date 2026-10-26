import { forwardRef, useId } from "react";
import { round, seeded } from "@/lib/seeded";

/** Circumference of the score arc (r = 46 in a 100 × 100 viewBox). */
export const ORB_ARC = round(2 * Math.PI * 46, 3);

const rand = seeded(42);
// Amber network inside the glass: points on a sphere-ish disc, linked to near neighbours.
const POINTS = Array.from({ length: 34 }, () => {
  const a = rand() * Math.PI * 2;
  const r = Math.sqrt(rand()) * 33;
  return { x: round(50 + Math.cos(a) * r), y: round(50 + Math.sin(a) * r * 0.92), s: round(0.35 + rand() * 0.9) };
});
const LINKS: [number, number][] = [];
POINTS.forEach((p, i) => {
  POINTS.forEach((q, j) => {
    if (j <= i) return;
    const d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < 13 && LINKS.length < 60) LINKS.push([i, j]);
  });
});
const DOTS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return { x: round(50 + Math.cos(a) * 49.6), y: round(50 + Math.sin(a) * 49.6) };
});

type Props = {
  /** 0–100 arc fill. */
  value?: number;
  className?: string;
  /** Text shown in the centre (e.g. a score). */
  children?: React.ReactNode;
  label?: string;
};

/**
 * The Regulon orb: a glass sphere holding an amber network, wrapped in the
 * score arc. Purely presentational; motion is applied from outside through
 * the data-orb-* hooks, so the same element can move from the loader into
 * the hero and through every chapter without being recreated.
 */
export const Orb = forwardRef<HTMLDivElement, Props>(function Orb(
  { value = 100, className = "", children, label },
  ref,
) {
  const offset = round(ORB_ARC * (1 - value / 100), 3);
  // Unique gradient ids per instance, so several orbs can share a page.
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div ref={ref} className={`relative aspect-square ${className}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`orb-body-${u}`} cx="42%" cy="36%" r="70%">
            <stop offset="0" stopColor="#1b2d38" />
            <stop offset="0.55" stopColor="#0b161d" />
            <stop offset="1" stopColor="#05090c" />
          </radialGradient>
          <radialGradient id={`orb-glow-${u}`} cx="50%" cy="50%" r="50%">
            <stop offset="0.6" stopColor="#f0a04b" stopOpacity="0" />
            <stop offset="0.86" stopColor="#f0a04b" stopOpacity="0.12" />
            <stop offset="1" stopColor="#f0a04b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`orb-rim-${u}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f5f1e8" stopOpacity="0.55" />
            <stop offset="0.45" stopColor="#c9d2d8" stopOpacity="0.08" />
            <stop offset="1" stopColor="#f0a04b" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id={`orb-highlight-${u}`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`orb-clip-${u}`}>
            <circle cx="50" cy="50" r="37" />
          </clipPath>
        </defs>

        {/* Outer glow */}
        <circle data-orb-glow cx="50" cy="50" r="58" fill={`url(#orb-glow-${u})`} />

        {/* Glass body */}
        <g data-orb-glass>
          <circle cx="50" cy="50" r="37" fill={`url(#orb-body-${u})`} />
          <g clipPath={`url(#orb-clip-${u})`}>
            <g data-orb-net className="origin-center">
              {LINKS.map(([a, b], i) => (
                <line
                  key={i}
                  data-orb-link
                  x1={POINTS[a].x}
                  y1={POINTS[a].y}
                  x2={POINTS[b].x}
                  y2={POINTS[b].y}
                  stroke="#f0a04b"
                  strokeOpacity="0.35"
                  strokeWidth="0.18"
                />
              ))}
              {POINTS.map((p, i) => (
                <circle key={i} data-orb-point cx={p.x} cy={p.y} r={p.s * 0.55} fill="#ffc77d" />
              ))}
            </g>
            {/* Silver swirl inside the glass */}
            <path
              d="M18 60 C 34 44, 52 70, 70 50 S 86 40, 92 46"
              fill="none"
              stroke="#c9d2d8"
              strokeOpacity="0.22"
              strokeWidth="0.5"
            />
          </g>
          <circle cx="50" cy="50" r="37" fill="none" stroke={`url(#orb-rim-${u})`} strokeWidth="0.6" />
          <ellipse cx="38" cy="30" rx="15" ry="8" fill={`url(#orb-highlight-${u})`} transform="rotate(-28 38 30)" />
        </g>

        {/* Score arc */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="#f5f1e8" strokeOpacity="0.08" strokeWidth="1.6" />
        <circle
          data-orb-arc
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#f0a04b"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray={ORB_ARC}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />

        {/* Scanning arc */}
        <g data-orb-scan className="origin-center">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#ffd29a"
            strokeOpacity="0.7"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray={`${round(2 * Math.PI * 42 * 0.12, 2)} ${round(2 * Math.PI * 42, 2)}`}
          />
        </g>

        {/* Indicator points */}
        <g data-orb-dots>
          {DOTS.map((d, i) => (
            <circle key={i} data-orb-dot cx={d.x} cy={d.y} r="0.7" fill="#f0a04b" />
          ))}
        </g>
      </svg>
      {children ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
      ) : null}
    </div>
  );
});
