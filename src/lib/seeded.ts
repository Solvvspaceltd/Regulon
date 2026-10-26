/**
 * Deterministic pseudo-random numbers, so decorative particle and network
 * layouts render identically on the server and in the browser (no hydration
 * mismatch) and look the same on every visit.
 */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
