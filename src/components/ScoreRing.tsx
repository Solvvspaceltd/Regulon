"use client";

import { forwardRef } from "react";

export const RING_CIRCUMFERENCE = 2 * Math.PI * 54; // r = 54 in a 120 viewBox

type Props = {
  value: number;
  size?: number;
  label: string;
  tone?: "ink" | "paper";
  /** When true, CSS transitions the arc as the value changes. */
  animate?: boolean;
  children?: React.ReactNode;
};

/**
 * The score ring, the motif that ties every part of the product together.
 * The arc length is a pure function of the value, so it is correct with or
 * without JavaScript and needs no animation to be understood.
 */
export const ScoreRing = forwardRef<SVGCircleElement, Props>(function ScoreRing(
  { value, size = 200, label, tone = "ink", animate = true, children },
  arcRef,
) {
  const offset = RING_CIRCUMFERENCE * (1 - value / 100);
  const track = tone === "ink" ? "rgb(245 241 232 / 0.12)" : "var(--color-paper-3)";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label}>
        <circle cx="60" cy="60" r="54" fill="none" stroke={track} strokeWidth="8" />
        <circle
          ref={arcRef}
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={
            animate
              ? { transition: "stroke-dashoffset 900ms var(--ease-out-expo)" }
              : undefined
          }
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
      ) : null}
    </div>
  );
});
