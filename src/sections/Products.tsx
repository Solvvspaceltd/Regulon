"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion, mq } from "@/lib/motion";
import { revealUp } from "@/lib/reveal";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { InteractiveCard } from "@/components/InteractiveCard";
import { MagneticButton } from "@/components/MagneticButton";
import { ClockedMark, RegulonMark } from "@/components/Logo";
import { app } from "@/lib/content";

function Icon({ d, tone }: { d: string[]; tone: "deep" | "signal" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={tone === "deep" ? "var(--color-signal-deep)" : "var(--color-signal)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      {d.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const icons = {
  story: ["M4 5h11a3 3 0 013 3v11H7a3 3 0 01-3-3z", "M8 9h6", "M8 13h4"],
  check: ["M11 18a7 7 0 100-14 7 7 0 000 14z", "M20 20l-4-4"],
  family: ["M9 11a3 3 0 100-6 3 3 0 000 6z", "M3 20c0-3 3-5 6-5s6 2 6 5", "M17 6v6", "M14 9h6"],
  mail: ["M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z", "M3 7l9 6 9-6"],
  chart: ["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"],
  list: ["M9 6h11", "M9 12h11", "M9 18h11", "M4 6l1 1 2-2", "M4 12l1 1 2-2", "M4 18l1 1 2-2"],
  shield: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", "M9 12l2 2 4-4"],
};

/**
 * 04 · Products
 * Two equal doors. Each panel opens with a clip-path mask reveal, its copy
 * staggers in, and on fine pointers the panel tilts gently toward the cursor.
 */
export function Products() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-door]").forEach((door, i) => {
          gsap.fromTo(
            door,
            { clipPath: "inset(14% 8% 14% 8% round 48px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 32px)",
              ease: motion.ease.inOut,
              duration: motion.duration.section,
              delay: i * 0.12,
              scrollTrigger: { trigger: door, start: "top 85%", once: true },
            },
          );
          revealUp(door.querySelectorAll("[data-door-item]"), door, { distance: 28, delay: 0.25 + i * 0.12, start: "top 85%" });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="products"
      ref={root}
      data-theme="dark"
      aria-labelledby="products-title"
      className="px-[var(--gutter)] py-[var(--section-y)] text-paper"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="border-t border-paper/20 pt-10">
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">Two ways in</p>
          <AnimatedHeading
            id="products-title"
            lines={["Same stories. Same score.", "Built for a family or a workforce."]}
            className="mt-5 max-w-[22ch] font-display text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.0] tracking-[-0.035em]"
          />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Clocked */}
          <div data-door>
            <InteractiveCard
              id="clocked"
              labelledBy="clocked-title"
              className="flex h-full flex-col gap-6 rounded-[var(--radius-card)] bg-paper-2 p-8 text-ink sm:p-12"
            >
              <div data-door-item className="flex flex-wrap items-center gap-3">
                <ClockedMark size={34} />
                <span className="font-display text-[34px] font-bold tracking-[-0.03em]">Clocked</span>
                <span className="text-[12px] text-muted">powered by Regulon</span>
              </div>
              <h3 data-door-item id="clocked-title" className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em]">
                For you and your family
              </h3>
              <p data-door-item className="text-[17px] leading-relaxed text-body">
                An app for iOS and Android that turns real scam stories into a reflex. Check anything that looks off and
                watch your household&apos;s score climb.
              </p>
              <ul className="flex flex-col gap-3.5 text-[16px]">
                <li data-door-item className="flex gap-3"><Icon d={icons.story} tone="deep" />Real stories, not lectures</li>
                <li data-door-item className="flex gap-3"><Icon d={icons.check} tone="deep" />Check a text, number or link for a verdict</li>
                <li data-door-item className="flex gap-3"><Icon d={icons.family} tone="deep" />A family score, shared by choice</li>
              </ul>
              <div data-door-item className="mt-auto flex flex-wrap gap-3 pt-4">
                <MagneticButton href="#join" variant="ink">iOS · coming soon</MagneticButton>
                <MagneticButton href="#join" variant="ink">Android · coming soon</MagneticButton>
              </div>
            </InteractiveCard>
          </div>

          {/* Regulon */}
          <div data-door>
            <InteractiveCard
              id="regulon"
              labelledBy="regulon-title"
              className="flex h-full flex-col gap-6 rounded-[var(--radius-card)] border border-paper/12 bg-ink-2/80 p-8 text-paper backdrop-blur-md sm:p-12"
            >
              <div data-door-item className="flex flex-wrap items-center gap-3">
                <RegulonMark size={34} tone="paper" />
                <span className="font-display text-[34px] font-bold tracking-[-0.03em]">Regulon</span>
                <span className="text-[12px] text-muted-on-ink">Awareness</span>
              </div>
              <h3 data-door-item id="regulon-title" className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em]">
                For your organisation
              </h3>
              <p data-door-item className="text-[17px] leading-relaxed text-soft-on-ink">
                Your IT controls audit, completed online at your own pace and reviewed by SolvvSpace, with staff training
                and certificates in the same place.
              </p>
              <ul className="flex flex-col gap-3.5 text-[16px]">
                <li data-door-item className="flex gap-3"><Icon d={icons.list} tone="signal" />The standard IT audit, section by section, saved as you go</li>
                <li data-door-item className="flex gap-3"><Icon d={icons.chart} tone="signal" />Scored and reported back by SolvvSpace, with clear next steps</li>
                <li data-door-item className="flex gap-3"><Icon d={icons.shield} tone="signal" />Staff courses with Bronze, Silver and Gold certificates</li>
              </ul>
              <div data-door-item className="mt-auto flex flex-wrap gap-3 pt-4">
                <MagneticButton href={app.signIn} variant="signal" arrow>
                  Open Regulon
                </MagneticButton>
                <MagneticButton href="#join" variant="ghost-paper">
                  Register for the pilot
                </MagneticButton>
              </div>
            </InteractiveCard>
          </div>
        </div>
      </div>
    </section>
  );
}
