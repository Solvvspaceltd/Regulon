"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion, mq } from "@/lib/motion";
import { MagneticButton } from "@/components/MagneticButton";
import { RING_CIRCUMFERENCE } from "@/components/ScoreRing";

const HERO_SCORE = 82;

/**
 * 01 · Hero
 * A cinematic, full-viewport opening. The giant score ring is the visual:
 * it fades in, its arc draws, the headline rises word by word, then the
 * supporting copy, the calls to action and the navigation follow. Once the
 * sequence settles, the outer ring drifts slowly as ambient movement.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const number = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const finalOffset = RING_CIRCUMFERENCE * (1 - HERO_SCORE / 100);
      // Selectors that live outside this section (the header) are queried globally.
      const reveals = document.querySelectorAll("[data-hero-reveal]");
      const navItems = document.querySelectorAll("[data-nav]");
      const mm = gsap.matchMedia();

      mm.add(mq.motion, () => {
        const q = gsap.utils.selector(root);
        const counter = { n: 0 };
        // Take over from the CSS pre-paint guard: GSAP owns visibility from here,
        // and every tween below states its end values explicitly.
        gsap.set(reveals, { opacity: 1 });
        const tl = gsap.timeline({
          defaults: { ease: motion.ease.out },
          onComplete: () => html.classList.add("hero-done"),
        });

        // 2. Background visual fades and scales in
        tl.fromTo(
          q("[data-ring-stage]"),
          { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, duration: motion.duration.section * 1.2 },
        )
          .fromTo(
            arc.current,
            { strokeDashoffset: RING_CIRCUMFERENCE },
            { strokeDashoffset: finalOffset, duration: motion.duration.ring, ease: motion.ease.inOut },
            "-=0.7",
          )
          .to(
            counter,
            {
              n: HERO_SCORE,
              duration: motion.duration.ring,
              ease: motion.ease.inOut,
              onUpdate: () => {
                if (number.current) number.current.textContent = String(Math.round(counter.n));
              },
            },
            "<",
          )
          // 3. Headline, line by line, word by word
          .from(
            q("h1 .word-inner"),
            { yPercent: motion.maskTravel, duration: motion.duration.text, stagger: motion.stagger.words },
            "-=1.2",
          )
          // 4. Supporting text
          .fromTo(
            q("[data-hero-sub]"),
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: motion.duration.component, stagger: motion.stagger.items },
            "-=0.45",
          )
          // 5. Calls to action
          .fromTo(
            q("[data-hero-cta]"),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: motion.duration.component, stagger: motion.stagger.items },
            "-=0.35",
          )
          // 6. Navigation
          .fromTo(
            navItems,
            { y: -14, opacity: 0 },
            { y: 0, opacity: 1, duration: motion.duration.component, stagger: 0.06 },
            "-=0.4",
          )
          .fromTo(q("[data-scroll-cue]"), { opacity: 0 }, { opacity: 1, duration: motion.duration.component }, "-=0.2");

        // 7. Ambient movement after the sequence
        const drift = gsap.to(q("[data-ring-drift]"), {
          rotation: 360,
          duration: 120,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
          paused: true,
        });
        tl.call(() => {
          drift.play();
        });

        // 8. Scrolling hands off: hero content eases up and softens
        gsap.to(q("[data-hero-copy]"), {
          yPercent: -12,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(q("[data-ring-parallax]"), {
          yPercent: 10,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      mm.add(mq.reduced, () => {
        gsap.set(reveals, { opacity: 1 });
        html.classList.add("hero-done");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const headline = ["One score.", "Three scales."];

  return (
    <section
      id="top"
      ref={root}
      data-theme="dark"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink text-paper"
      aria-labelledby="hero-title"
    >
      {/* Visual: the score ring */}
      <div
        aria-hidden="true"
        data-ring-parallax
        className="pointer-events-none absolute inset-y-0 right-[-48vw] -z-10 flex items-center opacity-35 sm:opacity-100 sm:right-[-30vw] lg:right-[-16vw] 2xl:right-[-8vw]"
      >
        <div data-hero-reveal data-ring-stage className="relative h-[min(84vh,760px)] w-[min(84vh,760px)]">
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
            <g data-ring-drift>
              <circle cx="60" cy="60" r="58.5" fill="none" stroke="rgb(245 241 232 / 0.10)" strokeWidth="0.25" strokeDasharray="0.6 2.4" />
            </g>
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(245 241 232 / 0.08)" strokeWidth="5" />
            <circle
              ref={arc}
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - HERO_SCORE / 100)}
              transform="rotate(-90 60 60)"
            />
            <circle cx="60" cy="60" r="44" fill="none" stroke="rgb(245 241 232 / 0.06)" strokeWidth="0.3" />
          </svg>
          <div className="absolute inset-0 hidden flex-col items-center justify-center xl:flex">
            <span ref={number} className="font-display text-[clamp(96px,10vw,176px)] font-bold leading-none tracking-[-0.05em]">
              {HERO_SCORE}
            </span>
            <span className="mt-3 font-mono text-[12px] uppercase tracking-[0.12em] text-muted-on-ink">
              Example score
            </span>
          </div>
        </div>
      </div>

      <div data-hero-copy className="mx-auto w-full max-w-[1240px] px-[var(--gutter)] pb-24 pt-[calc(var(--header-h)+3rem)]">
        <p data-hero-reveal data-hero-sub className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">
          Human risk, measured
        </p>
        <h1
          id="hero-title"
          data-hero-reveal
          className="mt-6 max-w-[11ch] font-display text-[clamp(52px,7.4vw,124px)] font-bold leading-[0.92] tracking-[-0.05em]"
        >
          {headline.map((line, i) => (
            <span key={i} className="block">
              {line.split(" ").map((w, j, arr) => (
                <span key={j} className="word-mask">
                  <span className="word-inner">
                    {w}
                    {j < arr.length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p data-hero-reveal data-hero-sub className="mt-8 max-w-[34rem] text-[clamp(17px,1.4vw,20px)] leading-relaxed text-soft-on-ink">
          Scammers target people, not systems. Regulon measures how ready people are, and real stories make them
          sharper, whether that is you, your household or everyone you employ.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <span data-hero-reveal data-hero-cta>
            <MagneticButton href="#scales" variant="signal" arrow>
              See how it works
            </MagneticButton>
          </span>
          <span data-hero-reveal data-hero-cta>
            <MagneticButton href="#join" variant="ghost-paper">
              Get early access
            </MagneticButton>
          </span>
        </div>
      </div>

      <a
        href="#intro"
        data-hero-reveal
        data-scroll-cue
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col sm:flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-on-ink"
      >
        Scroll
        <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-paper/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_var(--ease-in-out-soft)_infinite] bg-signal" />
        </span>
      </a>
    </section>
  );
}
