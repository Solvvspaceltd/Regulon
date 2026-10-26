"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { process } from "@/lib/content";
import { AnimatedHeading } from "@/components/AnimatedHeading";

/**
 * 05 · Process
 * A scroll-linked timeline. The progress line is scrubbed to scroll (and so
 * fully reversible); each stage's marker fills as the line reaches it.
 * Horizontal on desktop, vertical on mobile.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ desktop: mq.desktop, allow: mq.motion }, (ctx) => {
        const { desktop, allow } = ctx.conditions as { desktop: boolean; allow: boolean };
        const line = root.current!.querySelector("[data-progress]");
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const dots = steps.map((s) => s.querySelector<HTMLElement>("[data-dot]"));

        if (!allow) {
          dots.forEach((d) => d?.setAttribute("data-on", ""));
          return;
        }

        gsap.fromTo(
          line,
          desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
          {
            scaleX: 1,
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-track]",
              start: "top 70%",
              end: "bottom 55%",
              scrub: 0.4,
              onUpdate: (self) => {
                dots.forEach((d, i) => {
                  if (!d) return;
                  const reached = self.progress >= i / steps.length + 0.02 || self.progress === 1;
                  d.toggleAttribute("data-on", reached);
                });
              },
            },
          },
        );

        steps.forEach((step) => {
          revealUp(step.querySelectorAll("[data-step-item]"), step, { distance: 26, stagger: 0.07 });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="process"
      ref={root}
      data-theme="light"
      aria-labelledby="process-title"
      className="bg-paper px-[var(--gutter)] pb-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="border-t-2 border-ink pt-10">
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal-deep">The loop</p>
          <AnimatedHeading
            id="process-title"
            lines={["One number that moves", "when you get sharper."]}
            className="mt-5 max-w-[20ch] font-display text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.0] tracking-[-0.035em]"
          />
        </div>

        <div data-track className="relative mt-16">
          {/* Track */}
          <div aria-hidden="true" className="absolute left-[11px] top-0 h-full w-[2px] bg-paper-3 lg:left-0 lg:top-[11px] lg:h-[2px] lg:w-full">
            <div data-progress className="h-full w-full origin-top bg-signal lg:origin-left" />
          </div>

          <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
            {process.map((s) => (
              <li key={s.n} data-step className="relative pl-12 lg:pl-0 lg:pt-14">
                <span
                  data-dot
                  aria-hidden="true"
                  className="absolute left-0 top-0 block h-6 w-6 rounded-full border-2 border-paper-3 bg-paper transition-colors duration-300 data-[on]:border-signal data-[on]:bg-signal"
                />
                <p data-step-item className="font-mono text-[13px] text-signal-deep">{s.n}</p>
                <h3 data-step-item className="mt-3 font-display text-[28px] font-semibold tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p data-step-item className="mt-2 max-w-[24ch] text-[16px] leading-relaxed text-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
