"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { round, seeded } from "@/lib/seeded";

/*
 * Persistent page background: a precise, engineered field rather than a
 * photograph. An instrument grid, circuit traces routed at right angles and
 * 45-degree chamfers, signals travelling along them, and a slow scan line.
 * Everything is drawn in SVG, so it stays sharp at any size and weighs a few
 * kilobytes. It never unmounts, so the loader, hero and every section share
 * one continuous environment. Moves slightly with the pointer on desktop;
 * fully static for reduced motion.
 */

const W = 1440;
const H = 900;
const rand = seeded(11);

type Trace = { d: string; end: [number, number]; start: [number, number]; signal: boolean; len: number };

/** One trace: horizontal run, 45-degree chamfer, then a horizontal or vertical run, ending on a pad. */
function makeTrace(): Trace {
  // Weighted to the right: copy sits on the left of most sections.
  const x0 = round(560 + rand() * 900);
  const y0 = round(40 + rand() * (H - 80));
  const dir = rand() > 0.5 ? 1 : -1;
  const run1 = round(60 + rand() * 220);
  const chamfer = round(20 + rand() * 70);
  const run2 = round(40 + rand() * 200);
  const vertical = rand() > 0.55;
  const x1 = x0 + run1;
  const x2 = x1 + chamfer;
  const y2 = y0 + chamfer * dir;
  const [x3, y3] = vertical ? [x2, y2 + run2 * dir] : [x2 + run2, y2];
  const len = run1 + chamfer * Math.SQRT2 + run2;
  return {
    d: `M${x0} ${y0}H${x1}L${x2} ${round(y2)}${vertical ? `V${round(y3)}` : `H${round(x3)}`}`,
    start: [x0, y0],
    end: [round(x3), round(y3)],
    signal: rand() > 0.55,
    len: round(len),
  };
}

const TRACES = Array.from({ length: 22 }, makeTrace);

/** A few longer buses, parallel lines with a shared bend, for structure. */
const BUSES = Array.from({ length: 3 }, (_, b) => {
  const y = 180 + b * 260 + round(rand() * 60);
  const bend = 820 + round(rand() * 260);
  return [0, 1, 2, 3].map((k) => {
    const off = k * 9;
    return `M${bend - 260} ${y + off}H${bend}L${bend + 60} ${y + off + 60}H${W + 40}`;
  });
});

/** Registration ticks along the edges, like an instrument frame. */
const TICKS = Array.from({ length: 41 }, (_, i) => i * 36);

export function Backdrop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${mq.motion} and ${mq.finePointer}`, () => {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]");
        const setters = layers.map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, "x", { duration: 1.6, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.6, ease: "power3.out" }),
        }));
        const move = (e: PointerEvent) => {
          const px = e.clientX / window.innerWidth - 0.5;
          const py = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            s.x(px * s.depth);
            s.y(py * s.depth);
          });
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {/* Instrument grid: fine cells with a stronger line every fourth */}
      <svg data-depth="-6" className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]">
        <defs>
          <pattern id="grid-fine" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="#f5f1e8" strokeOpacity="0.035" strokeWidth="0.6" />
          </pattern>
          <pattern id="grid-major" width="112" height="112" patternUnits="userSpaceOnUse">
            <rect width="112" height="112" fill="url(#grid-fine)" />
            <path d="M112 0H0V112" fill="none" stroke="#f5f1e8" strokeOpacity="0.07" strokeWidth="0.7" />
            <path d="M-3 0H3M0 -3V3" stroke="#f0a04b" strokeOpacity="0.35" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-major)" />
      </svg>

      {/* Circuit layer */}
      <svg
        data-depth="10"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]"
      >
        <defs>
          <linearGradient id="fade-left" x1="0" x2="1">
            <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id="circuit-mask">
            <rect width={W} height={H} fill="url(#fade-left)" />
          </mask>
        </defs>
        <g mask="url(#circuit-mask)">
          {BUSES.map((bus, b) =>
            bus.map((d, k) => <path key={`${b}-${k}`} d={d} fill="none" stroke="#c9d2d8" strokeOpacity={0.09} strokeWidth="0.9" />),
          )}
          {TRACES.map((t, i) => (
            <g key={i}>
              <path d={t.d} fill="none" stroke="#c9d2d8" strokeOpacity="0.16" strokeWidth="0.9" />
              <circle cx={t.start[0]} cy={t.start[1]} r="2" fill="none" stroke="#c9d2d8" strokeOpacity="0.3" strokeWidth="0.8" />
              <rect x={t.end[0] - 3} y={t.end[1] - 3} width="6" height="6" fill="#0e1a22" stroke="#f0a04b" strokeOpacity="0.55" strokeWidth="0.9" />
              {t.signal && (
                <path
                  d={t.d}
                  fill="none"
                  stroke="#f0a04b"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="signal"
                  style={
                    {
                      strokeDasharray: `14 ${t.len}`,
                      "--trace-len": `${t.len + 14}`,
                      animationDuration: `${round(3.5 + (i % 5) * 0.9)}s`,
                      animationDelay: `${round(-(i * 0.7) % 6)}s`,
                    } as React.CSSProperties
                  }
                />
              )}
            </g>
          ))}
        </g>
      </svg>

      {/* Frame ticks along the top and right edges */}
      <svg className="absolute inset-0 h-full w-full opacity-60">
        {TICKS.map((t) => (
          <g key={t}>
            <line x1={t} y1="0" x2={t} y2={t % 180 === 0 ? 10 : 5} stroke="#c9d2d8" strokeOpacity="0.25" strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* Scan line: a slow, faint sweep */}
      <div className="scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent" />

      {/* Depth shading so copy always sits on a calm, readable field */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,transparent_0%,rgb(14_26_34/0.35)_60%,rgb(14_26_34/0.85)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-ink/80 to-transparent" />
    </div>
  );
}
