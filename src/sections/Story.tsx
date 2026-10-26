"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion, mq } from "@/lib/motion";
import { chapters, hero, storyItems } from "@/lib/content";
import { Orb, ORB_ARC } from "@/components/Orb";
import { AssessLink } from "@/components/AssessLink";
import {
  ActionsStatic,
  AssessmentStatic,
  CheckIcon,
  ExampleTag,
  FootprintStatic,
  RisksStatic,
  ScoreStatic,
  Segments,
} from "@/components/StoryVisuals";
import { getLenis } from "@/components/SmoothScroll";

const INTRO_KEY = "regulon-intro-seen";
const BRAND = "REGULON".split("");
const EXAMPLE_SCORE = 74;

/* ------------------------------------------------------------------ */
/* Scene states. Every value is in units of the visual area's size S,  */
/* so the whole choreography scales with the viewport.                  */
/* ------------------------------------------------------------------ */

type ItemState = {
  x: number;
  y: number;
  scale: number;
  dot: number;
  node: number;
  panel: number;
  w: number;
  h: number;
  mode: "row" | "card" | "check" | "none";
  tick?: boolean;
};
type OrbState = { x: number; y: number; scale: number; score: number; arc: number };
type SceneState = { orb: OrbState; items: (i: number) => ItemState; lines: boolean };

const ROW = { w: 0.78, h: 0.094 };
const CARD = { w: 0.29, h: 0.2 };
const rowY = (i: number) => -0.29 + i * 0.116;
const nodeAt = (i: number) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x: Math.cos(a) * 0.4, y: Math.sin(a) * 0.4 };
};

const hidden = (): ItemState => ({ x: 0, y: 0, scale: 0.35, dot: 0, node: 0, panel: 0, w: ROW.w, h: ROW.h, mode: "none" });

const STATES: SceneState[] = [
  // 0 · Hero
  { orb: { x: 0, y: 0, scale: 0.9, score: 0, arc: 100 }, items: hidden, lines: false },
  // 1 · Footprint: the orb becomes the centre of a connected network
  {
    orb: { x: 0, y: 0, scale: 0.34, score: 0, arc: 100 },
    items: (i) => ({ ...nodeAt(i), scale: 1, dot: 1, node: 1, panel: 0, w: ROW.w, h: ROW.h, mode: "none" }),
    lines: true,
  },
  // 2 · Assessment: nodes reorganise into assessment rows
  {
    orb: { x: 0, y: -0.47, scale: 0.16, score: 0, arc: 100 },
    items: (i) => ({ x: 0, y: rowY(i), scale: 1, dot: 0, node: 0, panel: 1, w: ROW.w, h: ROW.h, mode: "row" }),
    lines: false,
  },
  // 3 · Score: rows converge into the score dashboard
  { orb: { x: 0, y: 0, scale: 0.9, score: 1, arc: EXAMPLE_SCORE }, items: () => ({ ...hidden(), scale: 0.2 }), lines: false },
  // 4 · Risks: the dashboard expands into risk cards
  {
    orb: { x: 0, y: -0.39, scale: 0.3, score: 0, arc: EXAMPLE_SCORE },
    items: (i) => ({
      x: (i % 3) * 0.31 - 0.31,
      y: i < 3 ? -0.03 : 0.21,
      scale: 1,
      dot: 0,
      node: 0,
      panel: 1,
      w: CARD.w,
      h: CARD.h,
      mode: "card",
    }),
    lines: false,
  },
  // 5 · Actions: cards become a remediation checklist
  {
    orb: { x: 0, y: -0.47, scale: 0.16, score: 0, arc: EXAMPLE_SCORE },
    items: (i) => ({ x: 0, y: rowY(i), scale: 1, dot: 0, node: 0, panel: 1, w: ROW.w, h: ROW.h, mode: "check", tick: true }),
    lines: false,
  },
  // 6 · Closing call to action
  { orb: { x: 0, y: 0, scale: 0.9, score: 0, arc: 100 }, items: hidden, lines: false },
];

/**
 * 01–06 · Hero and connected story.
 *
 * Desktop with motion: one sticky visual on the right. A cinematic intro
 * assembles the orb, which then glides into the hero; as the copy scrolls
 * on the left, the same orb and six elements move through every chapter,
 * scrubbed to scroll position and fully reversible.
 *
 * Phones, reduced motion and no-JS: the same copy in normal flow, with a
 * static visual under each chapter.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const scene = html.classList.contains("story-scene");
      const q = gsap.utils.selector(root);
      const navItems = document.querySelectorAll("[data-nav]");
      const heroBits = q("[data-hero-bit]");
      const words = q("[data-hero-word]");

      const revealHero = (delay = 0) =>
        gsap
          .timeline({ delay, defaults: { ease: motion.ease.out } })
          .fromTo(words, { yPercent: motion.maskTravel, y: 0 }, { yPercent: 0, y: 0, duration: motion.duration.text, stagger: motion.stagger.words })
          .fromTo(heroBits, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: motion.duration.component, stagger: motion.stagger.items }, "-=0.55")
          .fromTo(navItems, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: motion.duration.component, stagger: 0.06 }, "-=0.5");

      const done = () => {
        html.classList.remove("intro-pending");
        html.classList.add("intro-done");
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
      };

      const mm = gsap.matchMedia();

      /* ---------------- Flow mode (phones, reduced motion) ------------ */
      mm.add(mq.motion, () => {
        if (scene) return;
        gsap.set([...navItems, ...heroBits], { opacity: 1 });
        revealHero(0.1).eventCallback("onComplete", done);
        gsap.utils.toArray<HTMLElement>("[data-flow-reveal]").forEach((el) =>
          gsap.fromTo(
            el,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: motion.duration.component, ease: motion.ease.out, scrollTrigger: { trigger: el, start: "top 85%", once: true } },
          ),
        );
      });
      mm.add(mq.reduced, () => {
        gsap.set([...navItems, ...heroBits], { opacity: 1 });
        done();
      });

      /* ---------------- Scene mode (desktop with motion) -------------- */
      mm.add(mq.motion, () => {
        if (!scene) return;
        const area = q("[data-area]")[0] as HTMLElement;
        const orb = q("[data-orb]")[0] as HTMLElement;
        const arc = q("[data-orb-arc]");
        const score = q("[data-orb-score]");
        const items = q("[data-item]");
        const lines = q("[data-line]");
        const S = () => area.offsetWidth;

        // Hero state
        gsap.set(orb, { x: 0, y: 0, scale: STATES[0].orb.scale });
        gsap.set(score, { opacity: 0 });
        gsap.set(lines, { strokeDashoffset: 42, opacity: 0 });
        items.forEach((el) => {
          gsap.set(el, { x: 0, y: 0, scale: 0.35 });
          gsap.set(el.querySelectorAll("[data-dot],[data-node],[data-panel],[data-layer]"), { opacity: 0 });
        });

        // Ambient life: slow scan and a breathing network
        const scan = gsap.to(q("[data-orb-scan]"), { rotation: 360, svgOrigin: "50 50", duration: 9, ease: "none", repeat: -1 });
        const drift = gsap.to(q("[data-orb-net]"), { rotation: 360, svgOrigin: "50 50", duration: 140, ease: "none", repeat: -1 });

        // Pointer response: the orb tilts gently toward the cursor
        const tilt = q("[data-orb-tilt]")[0] as HTMLElement;
        const tx = gsap.quickTo(tilt, "x", { duration: 1.2, ease: "power3.out" });
        const ty = gsap.quickTo(tilt, "y", { duration: 1.2, ease: "power3.out" });
        const rx = gsap.quickTo(tilt, "rotationY", { duration: 1.2, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const px = e.clientX / window.innerWidth - 0.5;
          const py = e.clientY / window.innerHeight - 0.5;
          tx(px * 14);
          ty(py * 14);
          rx(px * 8);
        };
        gsap.set(tilt, { transformPerspective: 900 });
        window.addEventListener("pointermove", onMove, { passive: true });

        /* -------- Scroll-scrubbed chapter choreography -------- */
        let story: gsap.core.Timeline | null = null;
        const buildStory = () => {
          story = gsap.timeline({
            defaults: { ease: "power2.inOut", duration: 0.7 },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          for (let k = 1; k < STATES.length; k++) {
            const st = STATES[k];
            const at = k - 1 + 0.15;
            story
              .to(orb, { x: () => st.orb.x * S(), y: () => st.orb.y * S(), scale: st.orb.scale }, at)
              .to(arc, { strokeDashoffset: ORB_ARC * (1 - st.orb.arc / 100) }, at)
              .to(score, { opacity: st.orb.score }, at)
              .to(lines, { strokeDashoffset: st.lines ? 0 : 42, opacity: st.lines ? 1 : 0, stagger: 0.04 }, at);
            items.forEach((el, i) => {
              const s = st.items(i);
              story!
                .to(el, { x: () => s.x * S(), y: () => s.y * S(), scale: s.scale, delay: i * 0.03 }, at)
                .to(el.querySelector("[data-dot]"), { opacity: s.dot }, at)
                .to(el.querySelector("[data-node]"), { opacity: s.node }, at)
                .to(el.querySelector("[data-panel]"), { opacity: s.panel, width: () => s.w * S(), height: () => s.h * S() }, at)
                .to(el.querySelector('[data-layer="row"]'), { opacity: s.mode === "row" ? 1 : 0 }, at)
                .to(el.querySelector('[data-layer="card"]'), { opacity: s.mode === "card" ? 1 : 0 }, at)
                .to(el.querySelector('[data-layer="check"]'), { opacity: s.mode === "check" ? 1 : 0 }, at)
                .to(
                  el.querySelector("[data-tick]"),
                  { backgroundColor: s.tick ? "#f0a04b" : "rgba(245,241,232,0)", color: s.tick ? "#0e1a22" : "rgba(14,26,34,0)", duration: 0.3, delay: 0.3 + i * 0.05 },
                  at,
                );
            });
          }
          // Every transition finishes inside its own block (k-1 → k), and the
          // timeline is pinned to exactly one unit per block, so chapter k
          // always lines up with block k.
          story.to({}, { duration: 0.001 }, STATES.length - 1 - 0.001);
          if (process.env.NODE_ENV !== "production" && story.duration() > STATES.length - 1 + 0.01) {
            console.warn("[story] timeline overruns its blocks:", story.duration());
          }
        };

        /* -------- Cinematic intro -------- */
        const pending = html.classList.contains("intro-pending") && window.scrollY < 10;
        let intro: gsap.core.Timeline | null = null;
        const unlock = () => {
          window.removeEventListener("wheel", skip);
          window.removeEventListener("touchstart", skip);
          window.removeEventListener("keydown", skip);
          window.removeEventListener("pointerdown", skip);
          html.style.overflow = "";
          getLenis()?.start();
        };
        function skip() {
          intro?.progress(1);
        }

        if (!pending) {
          html.classList.remove("intro-pending");
          gsap.set(q("[data-loader]"), { autoAlpha: 0 });
          revealHero(0.15).eventCallback("onComplete", done);
          buildStory();
        } else {
          html.style.overflow = "hidden";
          getLenis()?.stop();
          window.addEventListener("wheel", skip, { passive: true });
          window.addEventListener("touchstart", skip, { passive: true });
          window.addEventListener("keydown", skip);
          window.addEventListener("pointerdown", skip);

          const r = area.getBoundingClientRect();
          const cx = window.innerWidth / 2 - (r.left + r.width / 2);
          const cy = window.innerHeight / 2 - 48 - (r.top + r.height / 2);
          const L = (sel: string) => q(`[data-loader] ${sel}`);

          gsap.set(orb, { x: cx, y: cy, scale: 0.4 });
          gsap.set(q("[data-orb-glass]"), { opacity: 0 });
          gsap.set(q("[data-orb-link]"), { opacity: 0 });
          gsap.set(q("[data-orb-point]"), { opacity: 0 });
          gsap.set(q("[data-orb-glow]"), { opacity: 0 });
          gsap.set(q("[data-orb-scan]"), { opacity: 0 });
          gsap.set(q("[data-orb-dot]"), { opacity: 0.15 });
          gsap.set(arc, { strokeDashoffset: ORB_ARC });
          gsap.set(L("[data-l-ring]"), { scale: 0.2, opacity: 0 });
          gsap.set(L("[data-l-letter]"), { yPercent: 110 });
          gsap.set(L("[data-l-ready]"), { opacity: 0 });

          intro = gsap.timeline({
            defaults: { ease: motion.ease.out },
            onComplete: () => {
              unlock();
              gsap.set(q("[data-loader]"), { autoAlpha: 0 });
              done();
              buildStory();
              ScrollTrigger.refresh();
            },
          });
          intro
            // 1 · a point of light
            .fromTo(L("[data-l-point]"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 }, 0)
            // 2 · rings pulse out, the network starts forming
            .to(L("[data-l-ring]"), { keyframes: [{ opacity: 0.55, duration: 0.15 }, { scale: 2.6, opacity: 0, duration: 0.9 }], stagger: 0.18, ease: "power2.out" }, 0.25)
            .to(q("[data-orb-link]"), { opacity: 0.35, duration: 0.6, stagger: { each: 0.008, from: "random" } }, 0.45)
            .to(q("[data-orb-point]"), { opacity: 1, duration: 0.4, stagger: { each: 0.012, from: "center" } }, 0.5)
            // 3 · the glass and score arc assemble
            .to(q("[data-orb-glass]"), { opacity: 1, duration: 0.7 }, 0.8)
            .to(L("[data-l-point]"), { opacity: 0, scale: 0.4, duration: 0.5 }, 1.0)
            .to(arc, { strokeDashoffset: 0, duration: 0.9, ease: motion.ease.inOut }, 0.95)
            // 4 · scanning arc and indicators come alive
            .to(q("[data-orb-scan]"), { opacity: 1, duration: 0.4 }, 1.4)
            .to(q("[data-orb-dot]"), { opacity: 1, duration: 0.2, stagger: 0.04 }, 1.45)
            // 5 · the name
            .to(L("[data-l-letter]"), { yPercent: 0, duration: 0.6, stagger: 0.045 }, 1.45)
            // 6 · status
            .to(L("[data-l-init]"), { opacity: 0, duration: 0.2 }, 1.95)
            .to(L("[data-l-ready]"), { opacity: 1, duration: 0.25 }, 2.05)
            // 7 · the orb glides into the hero
            .to(L("[data-l-text]"), { opacity: 0, y: 10, duration: 0.35, ease: "power2.in" }, 2.35)
            .to(q("[data-l-veil]"), { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 2.35)
            .to(orb, { x: 0, y: 0, scale: STATES[0].orb.scale, duration: 1.05, ease: motion.ease.inOut }, 2.4)
            .to(q("[data-orb-glow]"), { opacity: 1, duration: 0.8 }, 2.7)
            // 8–9 · the page arrives around it
            .add(revealHero(), 2.95);
        }

        return () => {
          window.removeEventListener("pointermove", onMove);
          unlock();
          scan.kill();
          drift.kill();
          intro?.kill();
          story?.scrollTrigger?.kill();
          story?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      data-theme="dark"
      aria-label="Regulon: how exposed is your digital world"
      className="relative text-paper"
    >
      {/* ---------------- Intro (desktop scene, first visit) ---------------- */}
      {/* The veil sits behind the orb but above the backdrop, so the orb assembles in full light. */}
      <div data-loader data-l-veil className="pointer-events-none fixed inset-0 z-[1] hidden bg-ink/90 [.intro-pending_&]:block" aria-hidden="true" />
      <div data-loader className="pointer-events-none fixed inset-0 z-[70] hidden [.intro-pending_&]:block" aria-hidden="true">
        <div className="absolute left-1/2 top-[calc(50%-48px)] -translate-x-1/2 -translate-y-1/2">
          <span data-l-point className="absolute left-1/2 top-1/2 block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd29a] shadow-[0_0_30px_8px_rgb(240_160_75/0.6)]" />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-l-ring
              className="absolute left-1/2 top-1/2 block h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/70"
            />
          ))}
        </div>
        <div data-l-text className="absolute inset-x-0 top-[calc(50%-20px+min(44vw,74svh,640px)*0.2)] flex flex-col items-center gap-4">
          <p className="flex overflow-hidden font-display text-[28px] font-bold tracking-[0.42em] text-paper">
            {BRAND.map((c, i) => (
              <span key={i} data-l-letter className="inline-block">
                {c}
              </span>
            ))}
          </p>
          <p className="relative h-5 font-mono text-[12px] uppercase tracking-[0.16em] text-muted-on-ink">
            <span data-l-init className="block">Initialising interface</span>
            <span data-l-ready className="absolute inset-0 block text-center text-signal">Interface ready</span>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown"))}
        className="fixed bottom-6 right-6 z-[71] hidden rounded-full border border-paper/25 bg-ink/60 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-paper backdrop-blur [.intro-pending_&]:block"
      >
        Skip intro
      </button>

      <div className="relative z-[2] mx-auto grid max-w-[1320px] px-[var(--gutter)] [.story-scene_&]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] [.story-scene_&]:gap-10">
        {/* ---------------- Copy column ---------------- */}
        <div className="min-w-0">
          {/* Hero */}
          <div data-block="hero" className="flex min-h-[100svh] flex-col justify-center pb-16 pt-[calc(var(--header-h)+2rem)]">
            <div data-flow-only className="mb-10 flex justify-center">
              <Orb value={100} className="w-[min(64vw,300px)]" />
            </div>
            <p data-hero-bit data-intro-hide className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">
              {hero.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="mt-6 font-display text-[clamp(44px,4.9vw,80px)] font-bold leading-[0.96] tracking-[-0.045em]"
            >
              {hero.headline.map((line, i) => (
                <span key={i} className="block">
                  {line.split(" ").map((w, j, arr) => (
                    <span key={j} className="word-mask">
                      <span data-hero-word className="word-inner">
                        {w}
                        {j < arr.length - 1 ? " " : ""}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p data-hero-bit data-intro-hide className="mt-7 max-w-[32rem] text-[clamp(17px,1.35vw,19px)] leading-relaxed text-soft-on-ink">
              {hero.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <span data-hero-bit data-intro-hide>
                <AssessLink mode="personal" variant="signal" arrow>
                  {hero.primary}
                </AssessLink>
              </span>
              <span data-hero-bit data-intro-hide>
                <AssessLink mode="organisation" variant="ghost-paper">
                  {hero.secondary}
                </AssessLink>
              </span>
            </div>
            <p data-hero-bit data-intro-hide className="mt-6 text-[13px] text-muted-on-ink">
              Free, about three minutes. Your answers stay in your browser.
            </p>
          </div>

          {/* Chapters */}
          <div id="story" className="scroll-mt-[var(--header-h)]">
            {chapters.map((c) => (
              <article
                key={c.id}
                data-block={c.id}
                aria-labelledby={`ch-${c.id}`}
                className="flex flex-col justify-center py-16 [.story-scene_&]:min-h-[100svh] [.story-scene_&]:py-0"
              >
                <div data-flow-reveal>
                  <p className="font-mono text-[13px] text-signal">
                    {c.index} · {c.label}
                  </p>
                  <h2
                    id={`ch-${c.id}`}
                    className="mt-4 max-w-[16ch] font-display text-[clamp(32px,3.6vw,54px)] font-semibold leading-[1.02] tracking-[-0.035em]"
                  >
                    {c.title}
                  </h2>
                  <p className="mt-5 max-w-[30rem] text-[17px] leading-relaxed text-soft-on-ink">{c.body}</p>
                  {c.id === "score" || c.id === "risks" || c.id === "actions" ? (
                    <p className="mt-4 text-[13px] text-muted-on-ink">
                      Figures shown are an example. Your real score comes from your own assessment.
                    </p>
                  ) : null}
                </div>
                <div data-flow-only data-flow-reveal className="mt-10">
                  {c.id === "footprint" && <FootprintStatic />}
                  {c.id === "assessment" && <AssessmentStatic />}
                  {c.id === "score" && <ScoreStatic />}
                  {c.id === "risks" && <RisksStatic />}
                  {c.id === "actions" && <ActionsStatic />}
                </div>
              </article>
            ))}

            {/* Closing call to action */}
            <div data-block="cta" className="flex flex-col justify-center py-16 [.story-scene_&]:min-h-[100svh] [.story-scene_&]:py-0">
              <div data-flow-reveal>
                <p className="font-mono text-[13px] text-signal">06 · Your turn</p>
                <h2 className="mt-4 max-w-[14ch] font-display text-[clamp(36px,4.2vw,64px)] font-bold leading-[0.98] tracking-[-0.04em]">
                  See where you really stand.
                </h2>
                <p className="mt-5 max-w-[30rem] text-[17px] leading-relaxed text-soft-on-ink">
                  Ten quick questions for you, or eight for your organisation. You get an indicative score and your top fixes,
                  straight away.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <AssessLink mode="personal" variant="signal" arrow>
                    {hero.primary}
                  </AssessLink>
                  <AssessLink mode="organisation" variant="ghost-paper">
                    {hero.secondary}
                  </AssessLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Sticky visual (desktop scene) ---------------- */}
        <div data-scene-only className="relative hidden [.story-scene_&]:block" aria-hidden="true">
          <div className="sticky top-0 flex h-[100svh] items-center justify-center">
            <div data-area className="relative aspect-square w-[min(44vw,74svh,640px)]">
              {/* Footprint connections */}
              <svg viewBox="-50 -50 100 100" className="absolute inset-0 h-full w-full overflow-visible">
                {storyItems.map((it, i) => {
                  const p = nodeAt(i);
                  return (
                    <line
                      key={it.key}
                      data-line
                      x1="0"
                      y1="0"
                      x2={(p.x * 100).toFixed(2)}
                      y2={(p.y * 100).toFixed(2)}
                      stroke="#f0a04b"
                      strokeOpacity="0.45"
                      strokeWidth="0.25"
                      strokeDasharray="42"
                      strokeDashoffset="42"
                      opacity="0"
                    />
                  );
                })}
              </svg>

              {/* The orb */}
              <div data-orb className="absolute inset-0 will-change-transform">
                <div data-orb-tilt className="h-full w-full">
                  <Orb value={100} className="h-full w-full">
                    <div data-orb-score className="flex flex-col items-center opacity-0">
                      <span className="font-display text-[clamp(64px,7vw,120px)] font-bold leading-none tracking-[-0.05em]">
                        {EXAMPLE_SCORE}
                      </span>
                      <span className="mt-2 text-[13px] text-muted-on-ink">out of 100</span>
                      <ExampleTag className="mt-3" />
                    </div>
                  </Orb>
                </div>
              </div>

              {/* Six shared elements */}
              {storyItems.map((it) => (
                <div key={it.key} data-item className="absolute left-1/2 top-1/2 h-0 w-0">
                  <span
                    data-dot
                    className="absolute left-0 top-0 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal opacity-0 shadow-[0_0_18px_4px_rgb(240_160_75/0.55)]"
                  />
                  <span
                    data-node
                    className="absolute left-0 top-4 -translate-x-1/2 whitespace-nowrap rounded-full border border-paper/15 bg-ink/70 px-3 py-1 text-[13px] opacity-0 backdrop-blur"
                  >
                    {it.node}
                  </span>
                  <div
                    data-panel
                    className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-paper/12 bg-ink-2/75 opacity-0 backdrop-blur-md"
                    style={{ width: 0, height: 0 }}
                  >
                    <div data-layer="row" className="absolute inset-0 flex items-center justify-between px-4 text-[clamp(12px,1vw,15px)] opacity-0">
                      <span>{it.label}</span>
                      <Segments value={it.value} />
                    </div>
                    <div data-layer="card" className="absolute inset-0 flex flex-col justify-between p-3 opacity-0">
                      <span className="text-[12px] text-muted-on-ink">{it.label}</span>
                      <span className="font-display text-[clamp(20px,2vw,30px)] font-semibold leading-none">{it.value}</span>
                      <span className="block h-1 rounded-full bg-paper/10">
                        <span className="block h-full rounded-full bg-signal" style={{ width: `${it.value}%` }} />
                      </span>
                    </div>
                    <div data-layer="check" className="absolute inset-0 flex items-center gap-3 px-4 text-[clamp(12px,1vw,15px)] opacity-0">
                      <span data-tick className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-signal/60">
                        <CheckIcon />
                      </span>
                      <span className="truncate">{it.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
