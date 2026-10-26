import { Orb } from "./Orb";
import { RegulonMark } from "./Logo";

/**
 * The Regulon certificate, issued when someone completes a training path.
 * Shown with example details; the real one carries the person's name,
 * path, score and date.
 */
export function Certificate({ className = "" }: { className?: string }) {
  return (
    <figure
      className={`relative overflow-hidden rounded-[22px] bg-paper p-2 text-ink shadow-[0_50px_100px_-30px_rgb(0_0_0/0.7)] ${className}`}
      aria-label="Example Regulon certificate of completion"
    >
      <div className="relative rounded-[16px] border border-ink/15 px-8 pb-8 pt-7 sm:px-10">
        {/* Fine guilloche-style rings, drawn in the background */}
        <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 h-[340px] w-[340px] opacity-[0.12]">
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx="200" cy="200" r={40 + i * 11} fill="none" stroke="#0e1a22" strokeWidth="0.6" />
          ))}
        </svg>

        <div className="relative flex items-center justify-between">
          <span className="flex items-center gap-2">
            <RegulonMark size={24} />
            <span className="font-display text-[17px] font-bold tracking-[-0.02em]">Regulon</span>
          </span>
          <span className="rounded-full border border-ink/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Example</span>
        </div>

        <p className="relative mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-signal-deep">Certificate of completion</p>
        <p className="relative mt-3 text-[14px] text-muted">This certifies that</p>
        <p className="relative mt-1 font-display text-[clamp(30px,3.4vw,44px)] font-semibold leading-tight tracking-[-0.03em]">Your name</p>
        <p className="relative mt-3 max-w-[22rem] text-[14px] leading-relaxed text-body">
          has completed the <strong className="font-semibold text-ink">Everyday Scams</strong> training path, including the self-assessment,
          story lessons and disclosed practice drills.
        </p>

        <div className="relative mt-8 flex items-end justify-between gap-6 border-t border-ink/15 pt-5">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-[12px]">
            <dt className="text-muted">Final score</dt>
            <dt className="text-muted">Issued</dt>
            <dd className="font-display text-[22px] font-semibold">86</dd>
            <dd className="font-display text-[22px] font-semibold">[Date]</dd>
          </dl>
          <div className="relative w-[88px] shrink-0">
            <Orb value={86} className="w-full" />
          </div>
        </div>
      </div>
    </figure>
  );
}
