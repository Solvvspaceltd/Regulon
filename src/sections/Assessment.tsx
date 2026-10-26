"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { band, orgQuestions, personalQuestions, type Question } from "@/lib/content";
import { ASSESS_EVENT, type AssessMode } from "@/components/AssessLink";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MagneticButton } from "@/components/MagneticButton";
import { Orb } from "@/components/Orb";

const SETS: Record<AssessMode, { questions: Question[]; title: string; intro: string; time: string }> = {
  personal: {
    questions: personalQuestions,
    title: "Check my security",
    intro: "Ten questions about the habits and settings that matter most for you and your household.",
    time: "About 3 minutes",
  },
  organisation: {
    questions: orgQuestions,
    title: "Assess my organisation",
    intro: "Eight questions about the controls that stop most attacks on small and mid-sized organisations.",
    time: "About 3 minutes",
  },
};

function scoreOf(questions: Question[], answers: Record<string, number>) {
  const pts = questions.map((q) => q.options[answers[q.id]]?.points ?? 0);
  return Math.round((pts.reduce((a, b) => a + b, 0) / questions.length) * 100);
}

function byCategory(questions: Question[], answers: Record<string, number>) {
  const map = new Map<string, number[]>();
  questions.forEach((q) => {
    const p = q.options[answers[q.id]]?.points ?? 0;
    map.set(q.category, [...(map.get(q.category) ?? []), p]);
  });
  return [...map.entries()].map(([name, ps]) => ({
    name,
    value: Math.round((ps.reduce((a, b) => a + b, 0) / ps.length) * 100),
  }));
}

/**
 * 07 · Self-assessment
 * A real, short assessment. The score is computed only from the visitor's
 * own answers, is labelled as indicative, and nothing leaves the browser:
 * no requests are made and nothing is stored.
 */
export function Assessment() {
  const [mode, setMode] = useState<AssessMode>("personal");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const legendRef = useRef<HTMLLegendElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const name = useId();

  const set = SETS[mode];
  const total = set.questions.length;
  const finished = step >= total;
  const q = set.questions[Math.min(step, total - 1)];
  const chosen = answers[q.id];

  // Hero and closing CTAs open the assessment in the chosen mode.
  useEffect(() => {
    const open = (e: Event) => {
      const next = (e as CustomEvent<AssessMode>).detail;
      setMode(next);
      setStep(0);
      setAnswers({});
    };
    window.addEventListener(ASSESS_EVENT, open);
    return () => window.removeEventListener(ASSESS_EVENT, open);
  }, []);

  // Move focus with the user as they progress, for keyboard and screen readers.
  useEffect(() => {
    if (!moved.current) return;
    if (finished) resultRef.current?.focus();
    else legendRef.current?.focus();
  }, [step, finished]);

  const go = (n: number) => {
    moved.current = true;
    setStep(n);
  };
  const switchMode = (m: AssessMode) => {
    setMode(m);
    setAnswers({});
    moved.current = false;
    setStep(0);
  };

  const result = useMemo(() => {
    if (!finished) return null;
    const score = scoreOf(set.questions, answers);
    const fixes = set.questions
      .map((qq) => ({ q: qq, p: qq.options[answers[qq.id]]?.points ?? 0 }))
      .filter((x) => x.p < 1)
      .sort((a, b) => a.p - b.p)
      .slice(0, 3);
    return { score, band: band(score), cats: byCategory(set.questions, answers), fixes };
  }, [finished, set, answers]);

  const tab = (m: AssessMode, label: string) => (
    <button
      type="button"
      aria-pressed={mode === m}
      onClick={() => switchMode(m)}
      className={`min-h-11 rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${
        mode === m ? "bg-paper text-ink" : "text-paper hover:bg-paper/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section
      id="assess"
      data-theme="dark"
      aria-labelledby="assess-title"
      className="scroll-mt-[var(--header-h)] px-[var(--gutter)] py-[var(--section-y)] text-paper"
    >
      <div className="mx-auto grid max-w-[1240px] gap-10 rounded-[var(--radius-panel)] border border-paper/12 bg-ink-2/75 p-6 backdrop-blur-xl sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:p-14">
        {/* Intro column */}
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">Self-assessment</p>
          <h2 id="assess-title" className="mt-5 font-display text-[clamp(34px,4vw,56px)] font-bold leading-[1.0] tracking-[-0.035em]">
            {set.title}
          </h2>
          <p className="mt-5 max-w-[28rem] text-[17px] leading-relaxed text-soft-on-ink">{set.intro}</p>
          <div role="group" aria-label="Who is this assessment for" className="mt-8 inline-flex gap-1 rounded-full border border-paper/15 p-1">
            {tab("personal", "Me and my family")}
            {tab("organisation", "My organisation")}
          </div>
          <ul className="mt-8 flex flex-col gap-3 text-[14px] text-muted-on-ink">
            <li className="flex gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {set.time}
            </li>
            <li className="flex gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
              Your answers stay in this browser. Nothing is sent or stored.
            </li>
            <li className="flex gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></svg>
              No scanning. Nothing on your devices or systems is checked.
            </li>
          </ul>
        </div>

        {/* Question / result column */}
        <div className="min-w-0">
          {!finished ? (
            <div key={`${mode}-${q.id}`} className="q-enter">
              <div className="flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.1em] text-muted-on-ink">
                <span>
                  Question {step + 1} of {total}
                </span>
                <span>{q.category}</span>
              </div>
              <div
                className="mt-3 h-1 rounded-full bg-paper/10"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={step}
              >
                <div className="h-full rounded-full bg-signal transition-[width] duration-500 ease-[var(--ease-out-expo)]" style={{ width: `${(step / total) * 100}%` }} />
              </div>

              <fieldset className="mt-8">
                <legend
                  ref={legendRef}
                  tabIndex={-1}
                  className="font-display text-[clamp(22px,2.2vw,30px)] font-semibold leading-[1.2] tracking-[-0.02em] outline-none"
                >
                  {q.prompt}
                </legend>
                <div className="mt-6 flex flex-col gap-2.5">
                  {q.options.map((o, i) => {
                    const id = `${name}-${q.id}-${i}`;
                    const on = chosen === i;
                    return (
                      <label
                        key={i}
                        htmlFor={id}
                        className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border px-5 py-3.5 text-[16px] transition-colors duration-200 ${
                          on ? "border-signal bg-signal/10" : "border-paper/15 hover:border-paper/35 hover:bg-paper/5"
                        }`}
                      >
                        <input
                          id={id}
                          type="radio"
                          name={`${name}-${q.id}`}
                          checked={on}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal ${
                            on ? "border-signal" : "border-paper/40"
                          }`}
                        >
                          {on ? <span className="h-2.5 w-2.5 rounded-full bg-signal" /> : null}
                        </span>
                        {o.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  className="min-h-12 rounded-full px-5 text-[15px] font-semibold text-soft-on-ink hover:text-paper disabled:invisible"
                >
                  Back
                </button>
                <MagneticButton onClick={() => go(step + 1)} disabled={chosen === undefined} arrow>
                  {step === total - 1 ? "See my result" : "Next"}
                </MagneticButton>
              </div>
            </div>
          ) : result ? (
            <div className="q-enter">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                <Orb value={result.score} className="w-[min(60vw,240px)] shrink-0" label={`Indicative score ${result.score} out of 100`}>
                  <AnimatedCounter value={result.score} className="font-display text-[64px] font-bold leading-none tracking-[-0.04em]" />
                  <span className="mt-1 text-[12px] text-muted-on-ink">out of 100</span>
                </Orb>
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-signal">Indicative result</p>
                  <h3 ref={resultRef} tabIndex={-1} className="mt-2 font-display text-[32px] font-semibold tracking-[-0.025em] outline-none">
                    {result.band.label}
                  </h3>
                  <p className="mt-2 max-w-[26rem] text-[16px] leading-relaxed text-soft-on-ink">{result.band.note}</p>
                  <p className="mt-3 text-[13px] text-muted-on-ink">
                    Based only on your answers. Nothing on your devices or systems was checked.
                  </p>
                </div>
              </div>

              <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2" aria-label="Score by area">
                {result.cats.map((c) => (
                  <li key={c.name}>
                    <div className="mb-1.5 flex justify-between text-[14px]">
                      <span>{c.name}</span>
                      <span className="font-mono">{c.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-paper/10">
                      <div className="h-full rounded-full bg-signal" style={{ width: `${Math.max(c.value, 2)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>

              {result.fixes.length ? (
                <div className="mt-10">
                  <h4 className="font-display text-[22px] font-semibold tracking-[-0.02em]">Your top fixes</h4>
                  <ol className="mt-4 flex flex-col gap-3">
                    {result.fixes.map((f, i) => (
                      <li key={f.q.id} className="flex gap-4 rounded-2xl border border-paper/12 bg-ink/40 p-4 text-[15px] leading-relaxed">
                        <span className="font-mono text-[13px] text-signal">0{i + 1}</span>
                        {f.q.fix}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="mt-10 text-[16px] text-soft-on-ink">No gaps in what we asked about. Impressive. Keep those habits going.</p>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <MagneticButton href="#join" variant="signal" arrow>
                  Get early access
                </MagneticButton>
                <MagneticButton variant="ghost-paper" onClick={() => switchMode(mode)}>
                  Start again
                </MagneticButton>
                <button
                  type="button"
                  onClick={() => switchMode(mode === "personal" ? "organisation" : "personal")}
                  className="min-h-12 px-3 text-[15px] font-semibold text-soft-on-ink underline-offset-4 hover:text-paper hover:underline"
                >
                  {mode === "personal" ? "Assess my organisation instead" : "Check my own security instead"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
