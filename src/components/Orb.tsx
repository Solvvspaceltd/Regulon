import { forwardRef, useId } from "react";
import { round, seeded } from "@/lib/seeded";

/** Circumference of the score arc (r = 46 in a 100 × 100 viewBox). */
export const ORB_ARC = round(2 * Math.PI * 46, 3);

const rand = seeded(42);
// Sensor array inside the dial: nodes on a square lattice, joined by right-angle links.
const STEP = 7;
const POINTS: { x: number; y: number; s: number }[] = [];
for (let gx = -4; gx <= 4; gx++) {
  for (let gy = -4; gy <= 4; gy++) {
    const x = 50 + gx * STEP;
    const y = 50 + gy * STEP;
    if (Math.hypot(x - 50, y - 50) > 30 || rand() < 0.35) continue;
    POINTS.push({ x, y, s: round(0.45 + rand() * 0.7) });
  }
}
const LINKS: [number, number][] = [];
POINTS.forEach((p, i) => {
  POINTS.forEach((q, j) => {
    if (j <= i) return;
    const adjacent = (p.x === q.x && Math.abs(p.y - q.y) === STEP) || (p.y === q.y && Math.abs(p.x - q.x) === STEP);
    if (adjacent && rand() < 0.6) LINKS.push([i, j]);
  });
});
// Graduations around the dial, every 6 degrees, longer every 30.
const GRADS = Array.from({ length: 60 }, (_, i) => {
  const a = (i / 60) * Math.PI * 2;
  const long = i % 5 === 0;
  const r1 = 37.5;
  const r2 = long ? 40.5 : 39;
  return { x1: round(50 + Math.cos(a) * r1), y1: round(50 + Math.sin(a) * r1), x2: round(50 + Math.cos(a) * r2), y2: round(50 + Math.sin(a) * r2), long };
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
 * The Regulon dial: an instrument face with a sensor array, graduations and
 * a crosshair, wrapped in the score arc. Purely presentational; motion is applied from outside through
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
          <radialGradient id={`orb-glow-${u}`} cx="50%" cy="50%" r="50%">
            <stop offset="0.6" stopColor="#f0a04b" stopOpacity="0" />
            <stop offset="0.86" stopColor="#f0a04b" stopOpacity="0.12" />
            <stop offset="1" stopColor="#f0a04b" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`orb-clip-${u}`}>
            <circle cx="50" cy="50" r="37" />
          </clipPath>
        </defs>

        {/* Outer glow */}
        <circle data-orb-glow cx="50" cy="50" r="58" fill={`url(#orb-glow-${u})`} />

        {/* Instrument face */}
        <g data-orb-glass>
          <circle cx="50" cy="50" r="37" fill="#0a141b" />
          <circle cx="50" cy="50" r="37" fill="none" stroke="#c9d2d8" strokeOpacity="0.28" strokeWidth="0.4" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="#c9d2d8" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="1 1.4" />
          {GRADS.map((g, i) => (
            <line key={i} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} stroke="#c9d2d8" strokeOpacity={g.long ? 0.45 : 0.2} strokeWidth={g.long ? 0.45 : 0.3} />
          ))}
          <g clipPath={`url(#orb-clip-${u})`}>
            {/* Crosshair */}
            <path d="M13 50H44M56 50H87M50 13V44M50 56V87" stroke="#c9d2d8" strokeOpacity="0.16" strokeWidth="0.3" />
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
                  strokeOpacity="0.4"
                  strokeWidth="0.25"
                />
              ))}
              {POINTS.map((p, i) => (
                <rect key={i} data-orb-point x={p.x - p.s * 0.6} y={p.y - p.s * 0.6} width={p.s * 1.2} height={p.s * 1.2} fill="#ffc77d" />
              ))}
            </g>
          </g>
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
