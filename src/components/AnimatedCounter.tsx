"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { motion } from "@/lib/motion";

/**
 * Counts between values when `value` changes. The rendered number is always
 * the true value once the tween settles, and reduced-motion users get the
 * final number immediately.
 */
export function AnimatedCounter({ value, className = "" }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { n: current.current };
    const tween = gsap.to(state, {
      n: value,
      duration: reduced ? 0 : motion.duration.component * 1.4,
      ease: motion.ease.soft,
      onUpdate: () => {
        current.current = state.n;
        setDisplay(Math.round(state.n));
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span className={`tabular-nums ${className}`} aria-hidden="true">
      {display}
    </span>
  );
}
