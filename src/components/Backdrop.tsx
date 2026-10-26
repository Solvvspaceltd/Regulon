"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { asset } from "@/lib/asset";
import { round, seeded } from "@/lib/seeded";

const rand = seeded(7);
const PARTICLES = Array.from({ length: 26 }, () => ({
  x: round(rand() * 100),
  y: round(rand() * 100),
  size: round(2 + rand() * 7),
  blur: rand() > 0.6,
  delay: round(rand() * 6),
  duration: round(7 + rand() * 8),
}));

/** Flowing light trails, drawn as SVG so they stay sharp at any size. */
const TRAILS = [
  "M-100 520 C 180 420, 360 640, 640 520 S 1080 380, 1540 470",
  "M-100 560 C 220 470, 380 690, 660 560 S 1100 420, 1540 520",
  "M-100 600 C 240 520, 420 720, 700 600 S 1120 470, 1540 570",
  "M-100 470 C 160 380, 340 590, 620 480 S 1060 340, 1540 420",
];

/**
 * Persistent page background. It never unmounts, so the loader, hero and
 * every section share one continuous environment: the art-direction image,
 * a fine network grid, slow light trails and amber particles.
 * Moves a little with the pointer on desktop; static for reduced motion.
 */
export function Backdrop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${mq.motion} and ${mq.finePointer}`, () => {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]");
        const setters = layers.map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
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
      {/* Art-direction image: deep, soft, behind everything */}
      <div data-depth="-18" data-backdrop-image className="absolute -inset-8">
        <picture>
          <source
            type="image/avif"
            srcSet={`${asset("/media/backdrop-760.avif")} 760w, ${asset("/media/backdrop-1206.avif")} 1206w`}
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet={`${asset("/media/backdrop-760.webp")} 760w, ${asset("/media/backdrop-1206.webp")} 1206w`}
            sizes="100vw"
          />
          <img
            src={asset("/media/backdrop-1206.jpg")}
            alt=""
            width={1206}
            height={789}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover opacity-[0.42]"
          />
        </picture>
      </div>

      {/* Depth shading so copy always sits on a calm, readable field */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,transparent_0%,rgb(14_26_34/0.55)_55%,rgb(14_26_34/0.92)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-ink/85 to-transparent" />

      {/* Fine network grid */}
      <svg data-depth="-6" className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] opacity-[0.07]">
        <defs>
          <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="#f5f1e8" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Light trails */}
      <svg
        data-depth="10"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)]"
      >
        <defs>
          <linearGradient id="trail" x1="0" x2="1">
            <stop offset="0" stopColor="#c9d2d8" stopOpacity="0" />
            <stop offset="0.35" stopColor="#c9d2d8" stopOpacity="0.35" />
            <stop offset="0.7" stopColor="#c9d2d8" stopOpacity="0.18" />
            <stop offset="1" stopColor="#c9d2d8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trail-amber" x1="0" x2="1">
            <stop offset="0" stopColor="#f0a04b" stopOpacity="0" />
            <stop offset="0.5" stopColor="#f0a04b" stopOpacity="0.45" />
            <stop offset="1" stopColor="#f0a04b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {TRAILS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={i === 1 ? "url(#trail-amber)" : "url(#trail)"}
            strokeWidth={i === 1 ? 1.2 : 0.8}
            className="trail"
            style={{ animationDelay: `${i * -3}s` }}
          />
        ))}
      </svg>

      {/* Amber particles */}
      <div data-depth="22" className="absolute -inset-8">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`particle absolute rounded-full bg-signal ${p.blur ? "blur-[2px]" : ""}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${-p.delay}s`,
              animationDuration: `${p.duration}s`,
              boxShadow: `0 0 ${p.size * 2.5}px rgb(240 160 75 / 0.55)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
