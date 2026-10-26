"use client";

import { gsap } from "./gsap";
import { motion } from "./motion";

type Target = gsap.TweenTarget;

/**
 * Standard entrance: rise and fade in once when the trigger enters view.
 * End values are always explicit (never inferred from the element's current
 * state), so an element can never be left stuck invisible.
 */
export function revealUp(
  targets: Target,
  trigger: gsap.DOMTarget,
  {
    distance = 32,
    delay = 0,
    stagger = motion.stagger.items as number,
    start = "top 82%",
  }: { distance?: number; delay?: number; stagger?: number; start?: string } = {},
) {
  return gsap.fromTo(
    targets,
    { y: distance, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: motion.duration.component,
      ease: motion.ease.out,
      stagger,
      delay,
      scrollTrigger: { trigger: trigger as Element, start, once: true },
    },
  );
}

/** Masked rise: content slides up from behind its own overflow mask. */
export function maskUp(
  targets: Target,
  trigger: gsap.DOMTarget,
  {
    stagger = motion.stagger.words as number,
    duration = motion.duration.text as number,
    start = "top 85%",
  }: { stagger?: number; duration?: number; start?: string } = {},
) {
  return gsap.fromTo(
    targets,
    { yPercent: motion.maskTravel },
    {
      yPercent: 0,
      duration,
      ease: motion.ease.out,
      stagger,
      scrollTrigger: { trigger: trigger as Element, start, once: true },
    },
  );
}
