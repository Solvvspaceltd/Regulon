"use client";

import { useState } from "react";
import { drillTeams } from "@/lib/content";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { MagneticButton } from "@/components/MagneticButton";
import { ScoreRing } from "@/components/ScoreRing";

/**
 * 06 · Impact, shown rather than claimed.
 * An interactive preview of the Regulon dashboard. Running a disclosed drill
 * moves every team's bar and the overall ring. All figures are examples and
 * labelled as such; nothing here pretends to be live data.
 */
export function DrillDemo() {
  const [after, setAfter] = useState(false);
  const values = drillTeams.map((t) => (after ? t.after : t.before));
  const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <section
      id="drill"
      data-theme="light"
      aria-labelledby="drill-title"
      className="bg-paper px-[var(--gutter)] pb-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="border-t-2 border-ink pt-10">
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal-deep">For organisations</p>
          <AnimatedHeading
            id="drill-title"
            lines={["Watch a team", "get sharper."]}
            className="mt-5 max-w-[20ch] font-display text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.0] tracking-[-0.035em]"
          />
          <p className="mt-6 max-w-[36rem] text-[17px] leading-relaxed text-body">
            Run a disclosed drill, follow it with the right stories, and see the effect by team. Try it below.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[var(--radius-panel)] bg-ink text-paper shadow-[var(--shadow-lift)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/10 px-6 py-5 sm:px-10">
            <div className="flex items-center gap-3">
              <span className="font-display text-[18px] font-bold">Regulon</span>
              <span className="text-[13px] text-muted-on-ink">Human-risk dashboard · preview</span>
            </div>
            <span className="rounded-full border border-paper/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-on-ink">
              Example figures
            </span>
          </div>

          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col items-center gap-6 lg:items-start">
              <ScoreRing value={overall} size={220} label={`Organisation score ${overall} out of 100, example`}>
                <AnimatedCounter value={overall} className="font-display text-[72px] font-bold leading-none tracking-[-0.04em]" />
                <span className="mt-2 text-[12px] text-muted-on-ink">organisation</span>
              </ScoreRing>
              <MagneticButton variant={after ? "ghost-paper" : "signal"} onClick={() => setAfter((a) => !a)}>
                {after ? "Reset" : "Run a disclosed drill"}
              </MagneticButton>
              <p className="sr-only" aria-live="polite">
                {after
                  ? `After the drill and follow-up stories, the example organisation score is ${overall}.`
                  : `Before the drill, the example organisation score is ${overall}.`}
              </p>
            </div>

            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-on-ink">
                {after ? "After drill and follow-up stories" : "Team scores today"}
              </p>
              <ul className="mt-6 flex flex-col gap-6">
                {drillTeams.map((t, i) => (
                  <li key={t.name}>
                    <div className="mb-2 flex justify-between text-[16px]">
                      <span>{t.name}</span>
                      <span className="font-mono">
                        <AnimatedCounter value={values[i]} />
                        <span className="sr-only">{values[i]}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-paper/10">
                      <div
                        className="h-full rounded-full bg-signal transition-[width] duration-1000 ease-[var(--ease-out-expo)]"
                        style={{ width: `${values[i]}%`, transitionDelay: `${i * 70}ms` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
