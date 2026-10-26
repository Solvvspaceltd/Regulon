"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let instance: Lenis | null = null;

/** Access the running Lenis instance (null on reduced motion or before mount). */
export function getLenis() {
  return instance;
}

/**
 * Optional smooth scrolling, kept in lockstep with ScrollTrigger.
 * Native touch scrolling is untouched, and Lenis turns smoothing off
 * itself for people who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      // Lenis already honours scroll-padding-top and scroll-margin-top, so no extra offset.
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
