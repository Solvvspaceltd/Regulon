"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { plans, type Tier } from "@/lib/content";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { MagneticButton } from "@/components/MagneticButton";
import { CheckIcon } from "@/components/StoryVisuals";

type Audience = "family" | "organisation";

function Medal({ tier }: { tier: Tier }) {
  const c = 2 * Math.PI * 26;
  const fill = tier.key === "bronze" ? 0.34 : tier.key === "silver" ? 0.67 : 1;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id={`medal-${tier.key}`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#1b2d38" />
          <stop offset="1" stopColor="#05090c" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="21" fill={`url(#medal-${tier.key})`} stroke={tier.metal} strokeOpacity="0.5" strokeWidth="0.8" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="rgb(245 241 232 / 0.1)" strokeWidth="3" />
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke={tier.metal}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${c * fill} ${c}`}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize="15" fill={tier.metal}>
        {tier.name[0]}
      </text>
    </svg>
  );
}

/**
 * 10 · Plans: Bronze, Silver and Gold, for families and organisations.
 * One glass panel split into three, each tier marked by a medal ring that
 * fills a little more at every level. Contents are a draft; prices are
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
        revealUp(root.current!.querySelectorAll("[data-tier]"), root.current!.querySelector("[data-tiers]"), { distance: 40, stagger: 0.12 });
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

        <div
          data-tiers
          className="mt-14 grid overflow-hidden rounded-[var(--radius-panel)] border border-paper/12 bg-ink-2/70 backdrop-blur-xl lg:grid-cols-3"
        >
          {tiers.map((t, i) => (
            <article
              key={`${audience}-${t.key}`}
              data-tier
              aria-labelledby={`tier-${t.key}`}
              className={`relative flex flex-col p-8 sm:p-10 ${i > 0 ? "border-t border-paper/10 lg:border-l lg:border-t-0" : ""} ${
                t.key === "gold" ? "bg-[radial-gradient(ellipse_at_top,rgb(232_189_106/0.12),transparent_65%)]" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <Medal tier={t} />
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.14em]" style={{ color: t.metal }}>
                    {t.name}
                  </p>
                  <h3 id={`tier-${t.key}`} className="font-display text-[26px] font-semibold tracking-[-0.02em]">
                    {t.title}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-soft-on-ink">{t.who}</p>

              <div className="mt-6 border-t border-paper/10 pt-6">
                {t.inherits ? <p className="mb-3 text-[13px] font-semibold text-muted-on-ink">{t.inherits}</p> : null}
                <ul className="flex flex-col gap-3 text-[15px]">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: t.metal, color: "#0e1a22" }}>
                        <CheckIcon />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-10">
                <p className="text-[13px] text-muted-on-ink">Pricing announced at launch</p>
                <div className="mt-3">
                  <MagneticButton href="#join" variant={t.key === "gold" ? "signal" : "ghost-paper"} arrow>
                    Join early access
                  </MagneticButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
