"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { journey } from "@/lib/content";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { Certificate } from "@/components/Certificate";
import { InteractiveCard } from "@/components/InteractiveCard";
import { AssessLink } from "@/components/AssessLink";

const ICONS: Record<string, string[]> = {
  assess: ["M12 21a9 9 0 100-18 9 9 0 000 18z", "M12 12l4-4", "M12 7v1M7 12h1M16.5 12h.5"],
  learn: ["M4 5h11a3 3 0 013 3v11H7a3 3 0 01-3-3z", "M8 9h6", "M8 13h4"],
  practise: ["M4 6h16v10H8l-4 4z", "M9 11l2 2 4-4"],
  certify: ["M12 15a5 5 0 100-10 5 5 0 000 10z", "M9 14l-2 7 5-3 5 3-2-7"],
};

function LineIcon({ d }: { d: string[] }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

/**
 * 08 · The platform: Assess → Learn → Practise → Certify.
 * Centred heading; the four stations sit on a light trail that draws in step
 * with scroll, alternating high and low. Then the certificate, shown on the
 * left with the copy on the right.
 */
export function Platform() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const path = root.current!.querySelector<SVGPathElement>("[data-trail]");
        if (path) {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: "[data-journey]", start: "top 75%", end: "bottom 60%", scrub: 0.5 },
            },
          );
        }
        gsap.utils.toArray<HTMLElement>("[data-station]").forEach((st) =>
          revealUp(st.querySelectorAll("[data-station-item]"), st, { distance: 26, stagger: 0.07, start: "top 85%" }),
        );
        revealUp(root.current!.querySelectorAll("[data-cert-copy] > *"), root.current!.querySelector("[data-cert]"), { stagger: 0.08 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="platform" ref={root} data-theme="dark" aria-labelledby="platform-title" className="px-[var(--gutter)] py-[var(--section-y)] text-paper">
      <div className="mx-auto max-w-[1240px]">
        {/* Centred heading */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">The platform</p>
          <AnimatedHeading
            id="platform-title"
            lines={["Assess. Learn.", "Practise. Certify."]}
            className="mt-5 font-display text-[clamp(40px,5.4vw,80px)] font-bold leading-[0.95] tracking-[-0.045em]"
          />
          <p className="mx-auto mt-6 max-w-[34rem] text-[17px] leading-relaxed text-soft-on-ink">
            One training path for a person, a household or a whole organisation. The self-assessment is always step one, so
            everything after it is about your real gaps.
          </p>
        </div>

        {/* Journey along a light trail */}
        <div data-journey className="relative mt-20">
          <svg aria-hidden="true" viewBox="0 0 1200 260" preserveAspectRatio="none" className="absolute inset-x-0 top-[38px] hidden h-[260px] w-full lg:block">
            <defs>
              <linearGradient id="journey-trail" x1="0" x2="1">
                <stop offset="0" stopColor="#f0a04b" stopOpacity="0.15" />
                <stop offset="0.5" stopColor="#f0a04b" stopOpacity="0.9" />
                <stop offset="1" stopColor="#ffd29a" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path d="M0 0 L37 0 C 185 0, 185 160, 333 160 S 481 0, 629 0 S 777 160, 925 160 L 1200 160" fill="none" stroke="rgb(245 241 232 / 0.08)" strokeWidth="2" />
            <path data-trail d="M0 0 L37 0 C 185 0, 185 160, 333 160 S 481 0, 629 0 S 777 160, 925 160 L 1200 160" fill="none" stroke="url(#journey-trail)" strokeWidth="2" />
          </svg>

          <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-6">
            {journey.map((s, i) => (
              <li key={s.key} data-station className={`relative ${i % 2 === 1 ? "lg:mt-40" : ""}`}>
                <div data-station-item className="flex items-center gap-4">
                  <span className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border border-signal/40 bg-ink-2/80 text-signal shadow-[0_0_40px_rgb(240_160_75/0.18)] backdrop-blur">
                    <LineIcon d={ICONS[s.key]} />
                    <span className="absolute -right-1 -top-1 rounded-full bg-signal px-1.5 font-mono text-[10px] font-semibold text-ink">{s.n}</span>
                  </span>
                  <h3 className="font-display text-[30px] font-semibold tracking-[-0.025em]">{s.title}</h3>
                </div>
                <p data-station-item className="mt-5 max-w-[24rem] text-[16px] leading-relaxed text-soft-on-ink">
                  {s.body}
                </p>
                <ul data-station-item className="mt-4 flex flex-col gap-2 text-[14px] text-muted-on-ink">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        {/* Certificate: visual left, copy right */}
        <div data-cert className="mt-[var(--section-y)] grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
          <InteractiveCard className="mx-auto w-full max-w-[540px] lg:-rotate-2">
            <Certificate />
          </InteractiveCard>
          <div data-cert-copy>
            <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">Certificates</p>
            <h3 className="mt-5 max-w-[14ch] font-display text-[clamp(34px,3.8vw,56px)] font-bold leading-[1.0] tracking-[-0.035em]">
              Finish the path. Earn the proof.
            </h3>
            <p className="mt-6 max-w-[30rem] text-[17px] leading-relaxed text-soft-on-ink">
              Complete a training path and Regulon issues a certificate with your name, the path you finished and your final
              score. For families it&apos;s a milestone worth sharing. For organisations it&apos;s evidence that every
              member of staff was trained, ready for auditors, insurers and funders.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AssessLink mode="personal" variant="signal" arrow>
                Start with step one
              </AssessLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
