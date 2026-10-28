"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { app, plans, type Tier } from "@/lib/content";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { MagneticButton } from "@/components/MagneticButton";

type Audience = "family" | "organisation";

const LEVEL = { bronze: 1, silver: 2, gold: 3 } as const;

/** Level meter: three bars, lit up to the tier, like a signal-strength readout. */
function Level({ tier }: { tier: Tier }) {
  const lit = LEVEL[tier.key as keyof typeof LEVEL] ?? 1;
  return (
    <span aria-hidden="true" className="flex items-end gap-[3px]">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className="w-[5px] rounded-[1px]"
          style={{ height: 6 + n * 5, background: n <= lit ? tier.metal : "rgb(245 241 232 / 0.14)" }}
        />
      ))}
    </span>
  );
}

/**
 * 10 · Plans: Bronze, Silver and Gold, for families and organisations.
 * Three columns that rise out of the page: each panel lifts up from the
 * bottom on reveal, is lit along its top edge in the tier's metal, and fades
 * back into the background below its features. Contents are a draft; prices are
 * announced at launch, never invented here.
 */
export function Plans() {
  const root = useRef<HTMLElement>(null);
  const [audience, setAudience] = useState<Audience>("family");
  const tiers = plans[audience];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const tiersEl = root.current!.querySelector("[data-tiers]");
        const st = { trigger: tiersEl as Element, start: "top 80%", once: true };
        gsap.fromTo(
          "[data-tier-panel]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.out", stagger: 0.12, scrollTrigger: st },
        );
        gsap.fromTo(
          "[data-tier-edge]",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.55, scrollTrigger: st },
        );
        revealUp(root.current!.querySelectorAll("[data-tier-body]"), tiersEl, { distance: 28, stagger: 0.12, delay: 0.25 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const tab = (a: Audience, label: string) => (
    <button
      type="button"
      aria-pressed={audience === a}
      onClick={() => setAudience(a)}
      className={`min-h-11 rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${
        audience === a ? "bg-paper text-ink" : "text-paper hover:bg-paper/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="plans" ref={root} data-theme="dark" aria-labelledby="plans-title" className="px-[var(--gutter)] py-[var(--section-y)] text-paper">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">Plans</p>
          <AnimatedHeading
            id="plans-title"
            lines={["Bronze, Silver, Gold."]}
            className="mt-5 font-display text-[clamp(40px,5vw,76px)] font-bold leading-[0.95] tracking-[-0.045em]"
          />
          <p className="mx-auto mt-6 max-w-[32rem] text-[17px] leading-relaxed text-soft-on-ink">
            Every level includes the assessment, the stories and certificates. Each step up adds more people, more practice and
            more protection.
          </p>
          <div role="group" aria-label="Show plans for" className="mt-8 inline-flex gap-1 rounded-full border border-paper/15 p-1">
            {tab("family", "Families")}
            {tab("organisation", "Organisations")}
          </div>
        </div>

        <div data-tiers className="mt-16 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {tiers.map((t) => {
            const gold = t.key === "gold";
            return (
              <article key={`${audience}-${t.key}`} aria-labelledby={`tier-${t.key}`} className="relative flex flex-col px-7 pb-8 pt-9 sm:px-9">
                {/* Panel: lit at the top, fading out below the features */}
                <div
                  data-tier-panel
                  aria-hidden="true"
                  className="absolute inset-0 rounded-t-[22px] border-x border-t border-paper/10 [mask-image:linear-gradient(to_bottom,#000_0%,#000_45%,transparent_100%)]"
                  style={{
                    background: `linear-gradient(to bottom, ${gold ? "rgb(232 189 106 / 0.13)" : "rgb(245 241 232 / 0.05)"} 0%, rgb(22 38 47 / 0.85) 28%, rgb(22 38 47 / 0.35) 75%, transparent 100%)`,
                  }}
                />
                <span
                  data-tier-edge
                  aria-hidden="true"
                  className="absolute inset-x-6 top-0 h-px origin-center"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.metal}, transparent)`, boxShadow: `0 0 18px ${t.metal}` }}
                />

                <div data-tier-body className="relative flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: t.metal }}>
                      {t.name}
                    </p>
                    <Level tier={t} />
                  </div>
                  <h3 id={`tier-${t.key}`} className="mt-6 font-display text-[clamp(34px,3vw,44px)] font-bold leading-none tracking-[-0.035em]">
                    {t.title}
                  </h3>
                  <p className="mt-4 min-h-[3.2em] text-[15px] leading-relaxed text-soft-on-ink">{t.who}</p>

                  {t.inherits ? (
                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-on-ink">{t.inherits}</p>
                  ) : (
                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-on-ink">Includes</p>
                  )}
                  <ol className="mt-3 text-[15px]">
                    {t.features.map((f, i) => (
                      <li key={f} className="flex gap-4 border-t border-paper/[0.08] py-3 first:border-t-0">
                        <span className="w-6 shrink-0 pt-[3px] font-mono text-[11px] tabular-nums" style={{ color: t.metal }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-auto pt-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-on-ink">Pricing announced at launch</p>
                    <div className="mt-4">
                      <MagneticButton href={audience === "organisation" ? app.signIn : "#join"} variant={gold ? "signal" : "ghost-paper"} arrow>
                        {audience === "organisation" ? "Get started on Regulon" : "Join early access"}
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
