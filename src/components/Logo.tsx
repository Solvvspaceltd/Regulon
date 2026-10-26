type MarkProps = { size?: number; tone?: "ink" | "paper"; className?: string };

/** Regulon mark: a score ring three-quarters drawn. */
export function RegulonMark({ size = 30, tone = "ink", className }: MarkProps) {
  const track = tone === "ink" ? "var(--color-paper-3)" : "rgb(245 241 232 / 0.25)";
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" className={className}>
      <circle cx="15" cy="15" r="11" fill="none" stroke={track} strokeWidth="4" />
      <circle
        cx="15"
        cy="15"
        r="11"
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="50 69"
        transform="rotate(-90 15 15)"
      />
    </svg>
  );
}

/** Clocked mark: a ring with a tick, the moment you catch it. */
export function ClockedMark({ size = 30, tone = "ink", className }: MarkProps) {
  const ring = tone === "ink" ? "var(--color-ink)" : "var(--color-paper)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="9" stroke={ring} strokeWidth="2" />
      <path
        d="M8 12.5l2.6 2.6L16 9.5"
        stroke="var(--color-signal-deep)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RegulonWordmark({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <span className="flex items-center gap-2.5">
      <RegulonMark tone={tone} />
      <span className="font-display text-[22px] font-bold tracking-[-0.02em]">Regulon</span>
    </span>
  );
}
