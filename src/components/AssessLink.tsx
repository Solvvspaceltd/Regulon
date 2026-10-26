"use client";

import { MagneticButton } from "./MagneticButton";

export type AssessMode = "personal" | "organisation";

export const ASSESS_EVENT = "regulon:assess";

/** Opens the self-assessment section in the chosen mode. */
export function openAssessment(mode: AssessMode) {
  window.dispatchEvent(new CustomEvent<AssessMode>(ASSESS_EVENT, { detail: mode }));
}

export function AssessLink({
  mode,
  variant,
  children,
  arrow,
}: {
  mode: AssessMode;
  variant: "signal" | "ghost-paper";
  children: React.ReactNode;
  arrow?: boolean;
}) {
  return (
    <MagneticButton href="#assess" variant={variant} arrow={arrow} onClick={() => openAssessment(mode)}>
      {children}
    </MagneticButton>
  );
}
