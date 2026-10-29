"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { app, band } from "@/lib/content";
import {
  QUESTIONS,
  TITLES,
  encodeAnswers,
  fixesFor,
  scoreOf,
} from "@/lib/quick-check";
import { ASSESS_EVENT, type AssessMode } from "@/components/AssessLink";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { MagneticButton } from "@/components/MagneticButton";
import { Orb } from "@/components/Orb";

const SETS: Record<AssessMode, { intro: string; time: string; who: string }> = {
  personal: {
    intro:
      "Ten questions about the habits and settings that matter most for you and your household.",
    time: "About 3 minutes",
    who: "For you and your household",
  },
  organisation: {
    intro:
      "Eight questions about the controls that stop most attacks on small and mid-sized organisations.",
    time: "About 3 minutes",
    who: "For your organisation",
  },
};

/**
 * 07 · Self-assessment
 * A real, short assessment. The score is computed in the browser from the
 * visitor's own answers and shown straight away. The full report (score by
 * area and every fix) is gated: the personal assessment emails it, the
 * organisational one carries the answers into a Regulon account. Nothing is
 * sent until the visitor asks for that report.
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
  const questions = QUESTIONS[mode];
  const total = questions.length;
  const finished = step >= total;
  const q = questions[Math.min(step, total - 1)]!;
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
    const score = scoreOf(mode, answers);
    return { score, band: band(score), gaps: fixesFor(mode, answers).length };
  }, [finished, mode, answers]);

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
      className="px-[var(--gutter)] py-[var(--section-y)] text-paper"
    >
      <div className="mx-auto grid max-w-[1240px] gap-10 rounded-[var(--radius-panel)] border border-paper/12 bg-ink-2/75 p-6 backdrop-blur-xl sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:p-14">
        {/* Intro column */}
        <div>
          <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal">
            Free assessment &middot; {set.who}
          </p>
          <h2
            id="assess-title"
            className="mt-5 font-display text-[clamp(30px,3.3vw,48px)] font-bold leading-[1.02] tracking-[-0.035em]"
          >
            {TITLES[mode]}
          </h2>
          <p className="mt-5 max-w-[28rem] text-[17px] leading-relaxed text-soft-on-ink">
            {set.intro}
          </p>
          <div
            role="group"
            aria-label="Who is this assessment for"
            className="mt-8 inline-flex gap-1 rounded-full border border-paper/15 p-1"
          >
            {tab("personal", "Me and my family")}
            {tab("organisation", "My organisation")}
          </div>
          <ul className="mt-8 flex flex-col gap-3 text-[14px] text-muted-on-ink">
            <li className="flex gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {set.time}
            </li>
            <li className="flex gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 018 0v3" />
              </svg>
              Your score appears straight away. Nothing is sent unless you ask
              for the full report.
            </li>
            <li className="flex gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              >
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
              </svg>
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
                <div
                  className="h-full rounded-full bg-signal transition-[width] duration-500 ease-[var(--ease-out-expo)]"
                  style={{ width: `${(step / total) * 100}%` }}
                />
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
                          on
                            ? "border-signal bg-signal/10"
                            : "border-paper/15 hover:border-paper/35 hover:bg-paper/5"
                        }`}
                      >
                        <input
                          id={id}
                          type="radio"
                          name={`${name}-${q.id}`}
                          checked={on}
                          onChange={() =>
                            setAnswers((a) => ({ ...a, [q.id]: i }))
                          }
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal ${
                            on ? "border-signal" : "border-paper/40"
                          }`}
                        >
                          {on ? (
                            <span className="h-2.5 w-2.5 rounded-full bg-signal" />
                          ) : null}
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
                <MagneticButton
                  onClick={() => go(step + 1)}
                  disabled={chosen === undefined}
                  arrow
                >
                  {step === total - 1 ? "See my score" : "Next"}
                </MagneticButton>
              </div>
            </div>
          ) : result ? (
            <div className="q-enter">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                <Orb
                  value={result.score}
                  className="w-[min(60vw,220px)] shrink-0"
                  label={`Indicative score ${result.score} out of 100`}
                >
                  <AnimatedCounter
                    value={result.score}
                    className="font-display text-[60px] font-bold leading-none tracking-[-0.04em]"
                  />
                  <span className="mt-1 text-[12px] text-muted-on-ink">
                    out of 100
                  </span>
                </Orb>
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-signal">
                    Your indicative score
                  </p>
                  <h3
                    ref={resultRef}
                    tabIndex={-1}
                    className="mt-2 font-display text-[32px] font-semibold tracking-[-0.025em] outline-none"
                  >
                    {result.band.label}
                  </h3>
                  <p className="mt-2 max-w-[26rem] text-[16px] leading-relaxed text-soft-on-ink">
                    {result.gaps
                      ? `We found ${result.gaps} ${result.gaps === 1 ? "thing" : "things"} to fix. Your full report shows your score in each area and exactly what to do, most important first.`
                      : "No gaps in what we asked about. Your full report confirms each area."}
                  </p>
                </div>
              </div>

              <FullReport mode={mode} answers={answers} gaps={result.gaps} />

              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton
                  variant="ghost-paper"
                  onClick={() => switchMode(mode)}
                >
                  Start again
                </MagneticButton>
                <button
                  type="button"
                  onClick={() =>
                    switchMode(
                      mode === "personal" ? "organisation" : "personal",
                    )
                  }
                  className="min-h-12 px-3 text-[15px] font-semibold text-soft-on-ink underline-offset-4 hover:text-paper hover:underline"
                >
                  {mode === "personal"
                    ? "Assess my organisation instead"
                    : "Assess myself instead"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Decorative preview of what the full report holds. No real values are drawn. */
function LockedPreview() {
  return (
    <div aria-hidden="true" className="pointer-events-none select-none">
      <div className="grid gap-x-8 gap-y-4 opacity-60 blur-[5px] sm:grid-cols-2">
        {[64, 38, 82, 51].map((w, i) => (
          <div key={i}>
            <div className="mb-1.5 flex justify-between text-[14px]">
              <span className="h-3 w-24 rounded bg-paper/25" />
              <span className="h-3 w-6 rounded bg-paper/25" />
            </div>
            <div className="h-1.5 rounded-full bg-paper/10">
              <div
                className="h-full rounded-full bg-signal"
                style={{ width: `${w}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-2 opacity-50 blur-[5px]">
        <div className="h-10 rounded-xl border border-paper/12 bg-ink/40" />
        <div className="h-10 rounded-xl border border-paper/12 bg-ink/40" />
      </div>
    </div>
  );
}

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; to: string }
  | { kind: "error"; message: string };

/**
 * The gate. Personal: email and consent, then the platform emails the
 * report. Organisation: the answers travel to Regulon in the link's fragment
 * (never sent to a server as part of the URL) and are saved to the account.
 */
function FullReport({
  mode,
  answers,
  gaps,
}: {
  mode: AssessMode;
  answers: Record<string, number>;
  gaps: number;
}) {
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const id = useId();

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    setState({ kind: "sending" });
    try {
      const res = await fetch(`${app.url}/api/quick-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "personal",
          email,
          answers,
          updates: form.get("updates") === "on",
          website: String(form.get("website") ?? ""),
        }),
      });
      if (res.ok) return setState({ kind: "sent", to: email });
      const body = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setState({
        kind: "error",
        message:
          body?.error ??
          "We couldn't send your report just now. Please try again in a few minutes.",
      });
    } catch {
      setState({
        kind: "error",
        message:
          "We couldn't reach Regulon. Check your connection and try again.",
      });
    }
  }

  return (
    <div className="relative mt-10 overflow-hidden rounded-[22px] border border-paper/12 bg-ink/50 p-6 sm:p-8">
      <span
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-signal to-transparent"
      />
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-signal">
          Full report
        </p>
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-on-ink">
          {gaps
            ? `${gaps} ${gaps === 1 ? "fix" : "fixes"} inside`
            : "All areas"}
        </p>
      </div>
      <h4 className="mt-3 font-display text-[24px] font-semibold leading-tight tracking-[-0.02em]">
        {mode === "personal"
          ? "Your score by area, and what to fix first"
          : "Your organisation's score by area, with every fix"}
      </h4>

      <div className="mt-6">
        <LockedPreview />
      </div>

      {mode === "organisation" ? (
        <div className="mt-6">
          <p className="max-w-[34rem] text-[15px] leading-relaxed text-soft-on-ink">
            Create a free Regulon account for your organisation. Your answers
            come with you, and the full report is waiting on your dashboard,
            next to the complete IT controls audit.
          </p>
          <div className="mt-5">
            <MagneticButton
              href={`${app.url}/check#o=${encodeAnswers(answers)}`}
              variant="signal"
              arrow
            >
              Get the full report on Regulon
            </MagneticButton>
          </div>
        </div>
      ) : state.kind === "sent" ? (
        <p
          role="status"
          className="mt-6 rounded-2xl border border-signal/40 bg-signal/10 p-4 text-[15px] leading-relaxed"
        >
          Your report is on its way to <strong>{state.to}</strong>. It can take
          a minute or two; check your junk folder if you don&apos;t see it.
        </p>
      ) : (
        <form onSubmit={send} className="mt-6" noValidate={false}>
          <label
            htmlFor={`${id}-email`}
            className="block text-[14px] font-semibold"
          >
            Email me the full report
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              className="min-h-12 min-w-0 flex-1 rounded-full border border-paper/20 bg-ink/60 px-5 text-[15px] text-paper placeholder:text-muted-on-ink focus:border-signal focus:outline-none"
            />
            <MagneticButton
              type="submit"
              variant="signal"
              disabled={state.kind === "sending"}
              arrow
            >
              {state.kind === "sending" ? "Sending" : "Send my report"}
            </MagneticButton>
          </div>
          {/* Left empty by people; bots fill it in. */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px overflow-hidden"
          >
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-soft-on-ink">
            <input
              name="updates"
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-signal)]"
            />
            Also tell me when the Clocked app launches. Optional; one click to
            stop.
          </label>
          {state.kind === "error" ? (
            <p role="alert" className="mt-4 text-[14px] text-signal">
              {state.message}
            </p>
          ) : null}
          <p className="mt-4 text-[12px] leading-relaxed text-muted-on-ink">
            We use your email to send this report. Your answers and email are
            kept in the UK for up to 12 months, or until the Clocked launch if
            you ask to hear about it. See the{" "}
            <a
              href={`${app.url}/legal/privacy`}
              className="underline underline-offset-2 hover:text-paper"
            >
              privacy notice
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}
