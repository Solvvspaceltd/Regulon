"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion, mq } from "@/lib/motion";

type Variant = "signal" | "ink" | "paper" | "ghost-paper" | "ghost-ink";

const variants: Record<Variant, string> = {
  signal: "bg-signal text-ink [--fill:var(--color-paper)]",
  ink: "bg-ink text-paper [--fill:var(--color-signal)] hover:text-ink",
  paper: "bg-paper text-ink [--fill:var(--color-signal)]",
  "ghost-paper":
    "border-[1.5px] border-paper/40 text-paper [--fill:var(--color-paper)] hover:text-ink",
  "ghost-ink": "border-[1.5px] border-ink text-ink [--fill:var(--color-ink)] hover:text-paper",
};

type Props = {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  arrow?: boolean;
};

/**
 * A call to action with an animated fill and, on fine pointers with motion
 * allowed, a gentle magnetic pull. Touch and keyboard users get the same
 * button without the pull.
 */
export function MagneticButton({
  href,
  onClick,
  type = "button",
  variant = "signal",
  children,
  className = "",
  disabled,
  arrow,
}: Props) {
  const wrap = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${mq.motion} and ${mq.finePointer}`, () => {
        const x = gsap.quickTo(el, "x", { duration: 0.5, ease: motion.ease.out });
        const y = gsap.quickTo(el, "y", { duration: 0.5, ease: motion.ease.out });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * motion.hover.magnetStrength);
          y((e.clientY - (r.top + r.height / 2)) * motion.hover.magnetStrength);
        };
        const leave = () => {
          x(0);
          y(0);
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
    { scope: wrap },
  );

  const classes = `group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[15px] font-semibold transition-colors duration-300 ease-[var(--ease-out-expo)] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[var(--fill)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="relative">{children}</span>
      {arrow ? (
        <svg
          className="relative transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      ) : null}
    </>
  );

  return (
    <span ref={wrap} className="inline-block will-change-transform">
      {href ? (
        <a href={href} className={classes} onClick={onClick}>
          {inner}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={classes} disabled={disabled}>
          {inner}
        </button>
      )}
    </span>
  );
}
