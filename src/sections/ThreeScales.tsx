"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { scales } from "@/lib/content";
import { ScoreRing } from "@/components/ScoreRing";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AnimatedHeading } from "@/components/AnimatedHeading";

/**
 * 03 · The story: one score, three scales.
 * Desktop: a sticky score card stays in view (native CSS sticky, no scroll
 * hijacking) while three story panels scroll past. Each panel that reaches
 * the centre of the screen becomes active and the card re-draws for it.
 * Mobile: no sticky; each panel carries its own compact ring.
 */
export function ThreeScales() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const current = scales[active];

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-scale-panel]");
      const triggers = panels.map((panel, i) =>
        ScrollTrigger.create({
          trigger: panel,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        }),
      );

      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        panels.forEach((panel) => {
          revealUp(panel.querySelectorAll("[data-panel-item]"), panel, { distance: 40, start: "top 75%" });
        });
      });

      return () => {
        triggers.forEach((t) => t.kill());
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="scales"
      ref={root}
      data-theme="light"
      aria-labelledby="scales-title"
      className="bg-paper px-[var(--gutter)] pb-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="border-t-2 border-ink pt-10">
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal-deep">How it works</p>
          <AnimatedHeading
            id="scales-title"
            lines={["The same score,", "from one person to a whole workforce."]}
            className="mt-5 max-w-[20ch] font-display text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.0] tracking-[-0.035em]"
          />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          {/* Sticky score card (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+6vh)]">
              <div className="rounded-[var(--radius-panel)] bg-ink p-10 text-paper shadow-[var(--shadow-lift)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-signal">{current.product}</span>
                  <span className="text-[12px] text-muted-on-ink">Example figures</span>
                </div>
                <div className="mt-8 flex items-center gap-8">
                  <ScoreRing value={current.score} size={210} label={`${current.label} score ${current.score} out of 100, example`}>
                    <AnimatedCounter value={current.score} className="font-display text-[68px] font-bold leading-none tracking-[-0.04em]" />
                    <span className="mt-2 text-[12px] text-muted-on-ink">out of 100</span>
                  </ScoreRing>
                  <div>
                    <p className="font-display text-[28px] font-semibold tracking-[-0.02em]" aria-live="polite">
                      {current.label}
                    </p>
                    <ol className="mt-4 flex gap-2" aria-label="Scale">
                      {scales.map((s, i) => (
                        <li
                          key={s.key}
                          className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${i === active ? "bg-signal" : "bg-paper/15"}`}
                        >
                          <span className="sr-only">
                            {s.label}
                            {i === active ? " (showing)" : ""}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <ul className="mt-10 flex flex-col gap-4">
                  {current.rows.map((r) => (
                    <li key={r.name}>
                      <div className="mb-1.5 flex justify-between text-[14px]">
                        <span>{r.name}</span>
                        <span className="font-mono">{r.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-paper/12">
                        <div
                          className="h-full rounded-full bg-signal transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                          style={{ width: `${r.value}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Story panels */}
          <div className="flex flex-col">
            {scales.map((s, i) => (
              <article
                key={s.key}
                data-scale-panel
                aria-labelledby={`scale-${s.key}`}
                className="flex flex-col justify-center border-b border-paper-3 py-12 last:border-b-0 lg:min-h-[72vh]"
              >
                <p data-panel-item className="font-mono text-[13px] text-signal-deep">
                  {s.index} · {s.label}
                </p>
                <h3
                  data-panel-item
                  id={`scale-${s.key}`}
                  className="mt-4 font-display text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.05] tracking-[-0.03em]"
                >
                  <span
                    className={`transition-opacity duration-500 ${i === active ? "lg:opacity-100" : "lg:opacity-40"}`}
                  >
                    {s.title}
                  </span>
                </h3>
                <p data-panel-item className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-body">
                  {s.body}
                </p>

                {/* Mobile: each panel shows its own ring */}
                <div data-panel-item className="mt-8 flex items-center gap-5 rounded-[var(--radius-card)] bg-ink p-6 text-paper lg:hidden">
                  <ScoreRing value={s.score} size={104} animate={false} label={`${s.label} score ${s.score} out of 100, example`}>
                    <span className="font-display text-[32px] font-bold leading-none">{s.score}</span>
                  </ScoreRing>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-signal">{s.product}</p>
                    <p className="mt-1 text-[13px] text-muted-on-ink">Example figure</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
