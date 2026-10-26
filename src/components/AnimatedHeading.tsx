"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { mq } from "@/lib/motion";
import { maskUp } from "@/lib/reveal";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  /** Each string is one line; words inside a line reveal in sequence. */
  lines: React.ReactNode[];
  className?: string;
  /** Reveal when scrolled into view (default) or wait to be driven by a parent timeline. */
  trigger?: "scroll" | "manual";
  id?: string;
};

/**
 * Masked, word-by-word headline reveal. The full text is always in the DOM,
 * so screen readers and crawlers read it normally, and reduced-motion users
 * simply see it.
 */
export function AnimatedHeading({ as: Tag = "h2", lines, className = "", trigger = "scroll", id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (trigger !== "scroll" || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        maskUp(ref.current!.querySelectorAll(".word-inner"), ref.current);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {typeof line === "string"
            ? line.split(" ").map((w, j, arr) => (
                <span key={j} className="word-mask">
                  <span className="word-inner">
                    {w}
                    {j < arr.length - 1 ? " " : ""}
                  </span>
                </span>
              ))
            : (
                <span className="word-mask">
                  <span className="word-inner">{line}</span>
                </span>
              )}
        </span>
      ))}
    </Tag>
  );
}
