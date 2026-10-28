"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { principles } from "@/lib/content";
import { AnimatedHeading } from "@/components/AnimatedHeading";

/**
 * 07 · Principles (in place of testimonials, which don't exist yet).
 * Read as an operating protocol rather than a slogan: the statement sits on
 * the left, and the three rules run down a circuit trace on the right. A
 * signal travels down the trace with scroll and each node lights as it
 * passes, with the commitment that backs the rule underneath.
 */
export function Principles() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const list = root.current!.querySelector("[data-rules]") as Element;
        gsap.fromTo(
          "[data-trace-fill]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.fromTo(
            el.querySelector("[data-node]"),
            { backgroundColor: "rgb(14 26 34)", boxShadow: "0 0 0 0 rgb(240 160 75 / 0)" },
            {
              backgroundColor: "rgb(240 160 75)",
              boxShadow: "0 0 18px 2px rgb(240 160 75 / 0.55)",
              duration: 0.4,
              scrollTrigger: { trigger: el, start: "top 62%", toggleActions: "play none none reverse" },
            },
          );
        });
        revealUp(root.current!.querySelectorAll("[data-rule]"), list, { distance: 28, stagger: 0.14 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="principles"
      ref={root}
      data-theme="dark"
      aria-labelledby="principles-title"
      className="px-[var(--gutter)] py-[var(--section-y)] text-paper"
    >
      <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+4rem)] lg:self-start">
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">Principles</p>
          <AnimatedHeading
            id="principles-title"
            lines={["We never", "ambush."]}
            className="mt-5 font-display text-[clamp(52px,6.4vw,104px)] font-bold leading-[0.9] tracking-[-0.05em]"
          />
          <p className="mt-7 max-w-[26rem] text-[17px] leading-relaxed text-soft-on-ink">
            Security training only works when people trust it. These are the rules Regulon runs on, for families and
            organisations alike.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-paper/12 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-on-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_rgb(240_160_75/0.8)]" />
            Operating protocol · 3 rules
          </div>
        </div>

        <ol data-rules className="relative">
          {/* The trace, and the signal filling it with scroll */}
          <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 w-px bg-paper/12" />
          <span
            aria-hidden="true"
            data-trace-fill
            className="absolute bottom-6 left-[11px] top-6 w-px origin-top bg-gradient-to-b from-signal via-signal to-signal/40"
          />

          {principles.map((p, i) => (
            <li key={p.title} data-rule className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-x-6 pb-14 last:pb-0 sm:gap-x-9">
              <span className="relative z-[1] mt-[6px] flex h-[23px] w-[23px] items-center justify-center rounded-[5px] border border-signal/70 bg-ink">
                <span data-node className="h-[9px] w-[9px] rounded-[2px] bg-signal motion-safe:bg-ink" />
              </span>
              <div className="rounded-[18px] border border-paper/10 bg-ink-2/55 p-7 backdrop-blur-md sm:p-9">
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-on-ink">
                  Rule {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-[clamp(26px,2.6vw,36px)] font-semibold leading-[1.05] tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-4 max-w-[34rem] text-[16px] leading-relaxed text-soft-on-ink">{p.body}</p>
                <p className="mt-6 flex items-start gap-3 border-t border-paper/10 pt-5 font-mono text-[12px] uppercase leading-relaxed tracking-[0.1em] text-signal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-[2px] shrink-0">
                    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                  </svg>
                  {p.rule}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
