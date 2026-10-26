import { TextReveal } from "@/components/TextReveal";

/**
 * 02 · Introduction
 * The section overlaps the hero with a rounded top edge (layered overlap),
 * then a scroll-scrubbed statement brightens word by word.
 */
export function Intro() {
  return (
    <section
      id="intro"
      data-theme="light"
      aria-labelledby="intro-label"
      className="relative z-10 -mt-10 rounded-t-[var(--radius-panel)] bg-paper px-[var(--gutter)] py-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <p id="intro-label" className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal-deep">
          Why people
        </p>
        <TextReveal
          className="mt-8 max-w-[22ch] font-display text-[clamp(34px,5.4vw,76px)] font-semibold leading-[1.02] tracking-[-0.035em]"
          text="Scammers rarely break through firewalls. They talk their way past people. So we train people, with stories true enough to remember and a score that shows it is working."
        />
      </div>
    </section>
  );
}
