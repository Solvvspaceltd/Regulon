"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { principles } from "@/lib/content";

/**
 * 07 · Principles (in place of testimonials, which don't exist yet).
 * The headline fills from outline to solid in step with scroll.
 */
export function Principles() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.fromTo(
          "[data-fill]",
          { backgroundSize: "0% 100%" },
          {
            backgroundSize: "100% 100%",
            ease: "none",
            scrollTrigger: { trigger: "[data-fill]", start: "top 80%", end: "top 35%", scrub: true },
          },
        );
        revealUp(root.current!.querySelectorAll("[data-principle]"), root.current!.querySelector("[data-principles]"));
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
      <div className="mx-auto max-w-[1240px]">
        <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal md:text-right">Principles</p>
        <h2
          id="principles-title"
          data-fill
          className="mt-6 font-display md:text-right text-[clamp(56px,11vw,168px)] font-bold leading-[0.88] tracking-[-0.05em] motion-safe:bg-[linear-gradient(var(--color-paper),var(--color-paper))] motion-safe:bg-clip-text motion-safe:bg-no-repeat motion-safe:text-transparent motion-safe:[-webkit-text-stroke:1.5px_var(--color-paper)]"
          style={{ backgroundSize: "100% 100%" }}
        >
          We never ambush.
        </h2>

        <div data-principles className="mt-16 grid gap-10 border-t border-paper/15 pt-10 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} data-principle>
              <h3 className="font-display text-[24px] font-semibold tracking-[-0.02em] text-signal">{p.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-soft-on-ink">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
