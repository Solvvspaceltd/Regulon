"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";

/**
 * Scroll-linked statement: words brighten in step with scroll position.
 * Fully reversible because it is scrubbed to scroll progress, and static
 * at full strength for reduced-motion users.
 */
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        gsap.fromTo(
          ref.current!.querySelectorAll("[data-word]"),
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-word>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
