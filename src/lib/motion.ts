/**
 * Central motion configuration.
 * Every timing and easing in the site comes from here, so the feel of the
 * whole experience can be tuned in one file.
 */
export const motion = {
  duration: {
    micro: 0.18,
    text: 0.8,
    component: 0.6,
    section: 1.0,
    ring: 1.4,
  },
  stagger: {
    words: 0.06,
    items: 0.09,
  },
  ease: {
    out: "expo.out",
    inOut: "power3.inOut",
    soft: "power2.out",
    spring: "back.out(1.6)",
  },
  hover: {
    scale: 1.03,
    magnetStrength: 0.28,
    tiltMax: 6,
  },
  /** Distance (in % of element height) masked text travels up from */
  maskTravel: 110,
} as const;

/** Breakpoint queries shared with gsap.matchMedia */
export const mq = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 900px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;
