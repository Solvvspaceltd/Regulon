import { storyItems } from "@/lib/content";
import { Orb } from "./Orb";

/**
 * Static versions of each chapter's visual, used on phones, with reduced
 * motion, and without JavaScript. The desktop scene animates one shared set
 * of elements through these same states.
 */

export function ExampleTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border border-paper/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-on-ink ${className}`}
    >
      Example
    </span>
  );
}

export function FootprintStatic() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Orb value={100} className="w-28" />
      <ul className="flex flex-wrap justify-center gap-2">
        {storyItems.map((it) => (
          <li key={it.key} className="flex items-center gap-2 rounded-full border border-paper/15 bg-ink-2/70 px-3.5 py-2 text-[14px]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
            {it.node}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Segments({ value }: { value: number }) {
  const lit = value >= 75 ? 3 : value >= 55 ? 2 : 1;
  return (
    <span aria-hidden="true" className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`h-1.5 w-5 rounded-full ${i < lit ? "bg-signal" : "bg-paper/15"}`} />
      ))}
    </span>
  );
}

export function AssessmentStatic() {
  return (
    <ul className="flex flex-col gap-2">
      {storyItems.map((it) => (
        <li key={it.key} className="flex items-center justify-between rounded-xl border border-paper/10 bg-ink-2/70 px-4 py-3 text-[15px]">
          {it.label}
          <Segments value={it.value} />
        </li>
      ))}
    </ul>
  );
}

export function ScoreStatic() {
  return (
    <div className="flex justify-center">
      <Orb value={74} className="w-[min(72vw,300px)]" label="Example score 74 out of 100">
        <span className="font-display text-[64px] font-bold leading-none tracking-[-0.04em]">74</span>
        <ExampleTag className="mt-3" />
      </Orb>
    </div>
  );
}

export function RisksStatic() {
  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {storyItems.map((it) => (
        <li key={it.key} className="rounded-xl border border-paper/10 bg-ink-2/70 p-4">
          <p className="text-[13px] text-muted-on-ink">{it.label}</p>
          <p className="mt-1 font-display text-[28px] font-semibold leading-none">{it.value}</p>
          <div className="mt-3 h-1 rounded-full bg-paper/10">
            <div className="h-full rounded-full bg-signal" style={{ width: `${it.value}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ActionsStatic() {
  return (
    <ol className="flex flex-col gap-2">
      {storyItems.map((it) => (
        <li key={it.key} className="flex items-center gap-3 rounded-xl border border-paper/10 bg-ink-2/70 px-4 py-3 text-[15px]">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-signal text-ink">
            <CheckIcon />
          </span>
          {it.action}
        </li>
      ))}
    </ol>
  );
}
