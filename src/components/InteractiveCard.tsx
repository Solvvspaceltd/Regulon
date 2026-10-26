"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion, mq } from "@/lib/motion";

/**
 * Subtle 3D tilt toward the pointer on fine-pointer devices with motion
 * allowed. Everywhere else it is a plain container.
 */
export function InteractiveCard({
  children,
  className = "",
  id,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${mq.motion} and ${mq.finePointer}`, () => {
        gsap.set(el, { transformPerspective: 1200 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: motion.ease.out });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: motion.ease.out });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * motion.hover.tiltMax);
          rx(-py * motion.hover.tiltMax);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <article ref={ref} id={id} aria-labelledby={labelledBy} className={`will-change-transform ${className}`}>
      {children}
    </article>
  );
}
