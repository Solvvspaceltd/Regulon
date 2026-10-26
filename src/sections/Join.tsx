"use client";

import { useId, useState } from "react";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { MagneticButton } from "@/components/MagneticButton";

type Audience = "family" | "organisation";
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const errors: Record<string, string> = {
  invalid_email: "That email address doesn't look right. Please check it and try again.",
  not_configured: "Early access sign-up isn't open just yet. Please check back soon.",
  upstream_failed: "We couldn't save your details just now. Please try again in a moment.",
};

/**
 * 08 · Call to action
 * A real form with inline validation, a loading state, and honest success
 * and error feedback driven by the /api/waitlist response.
 */
export function Join() {
  const [audience, setAudience] = useState<Audience>("family");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const emailId = useId();
  const hintId = useId();
  const statusId = useId();

  const invalid = touched && !EMAIL.test(email.trim());

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    if (!EMAIL.test(email.trim())) return;
    const company = (new FormData(e.currentTarget).get("company") as string) ?? "";
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, audience, company }),
      });
      if (res.ok) {
        setStatus({ kind: "success" });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus({ kind: "error", message: errors[data.error ?? ""] ?? errors.upstream_failed });
    } catch {
      setStatus({ kind: "error", message: "You seem to be offline. Please check your connection and try again." });
    }
  }

  const tab = (value: Audience, label: string) => (
    <button
      type="button"
      aria-pressed={audience === value}
      onClick={() => setAudience(value)}
      className={`min-h-11 rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 ${
        audience === value ? "bg-ink text-paper" : "text-ink hover:bg-paper-3/60"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section
      id="join"
      data-theme="light"
      aria-labelledby="join-title"
      className="bg-paper px-[var(--gutter)] py-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[880px] text-center">
        <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-signal-deep">Early access</p>
        <AnimatedHeading
          id="join-title"
          lines={["Be first in."]}
          className="mt-5 font-display text-[clamp(52px,8vw,112px)] font-bold leading-[0.92] tracking-[-0.05em]"
        />
        <p className="mx-auto mt-6 max-w-[34rem] text-[18px] leading-relaxed text-muted">
          {audience === "family"
            ? "Leave your email and we'll tell you the day Clocked lands on iOS and Android."
            : "Leave your work email and we'll invite your organisation to the Regulon pilot."}
        </p>

        {status.kind === "success" ? (
          <div role="status" className="mx-auto mt-10 max-w-[30rem] rounded-[var(--radius-card)] bg-ink px-8 py-10 text-paper">
            <p className="font-display text-[28px] font-semibold tracking-[-0.02em]">You&apos;re on the list.</p>
            <p className="mt-2 text-soft-on-ink">We&apos;ll be in touch at {email.trim()}.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-10 max-w-[38rem]">
            <div role="group" aria-label="Who is this for" className="inline-flex gap-1 rounded-full bg-paper-2 p-1">
              {tab("family", "Me and my family")}
              {tab("organisation", "My organisation")}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 text-left">
                <label htmlFor={emailId} className="sr-only">
                  {audience === "family" ? "Email address" : "Work email address"}
                </label>
                <input
                  id={emailId}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  aria-invalid={invalid}
                  aria-describedby={`${hintId} ${statusId}`}
                  placeholder={audience === "family" ? "you@example.com" : "you@organisation.org"}
                  className={`min-h-14 w-full rounded-full border-[1.5px] bg-[#fffdf8] px-6 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus-visible:shadow-[0_0_0_4px_rgb(240_160_75/0.35)] ${
                    invalid ? "border-[#b42318]" : "border-ink"
                  }`}
                />
                <p id={hintId} className={`mt-2 px-6 text-[13px] ${invalid ? "text-[#b42318]" : "sr-only"}`}>
                  {invalid ? "Please enter a valid email address." : "We only use this to tell you about early access."}
                </p>
              </div>
              {/* Honeypot for bots, hidden from people and assistive tech */}
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <MagneticButton type="submit" variant="ink" disabled={status.kind === "sending"} className="min-h-14 px-8">
                {status.kind === "sending" ? "Joining…" : "Join early access"}
              </MagneticButton>
            </div>

            <p id={statusId} role="status" aria-live="polite" className="mt-4 min-h-6 text-[15px] text-[#b42318]">
              {status.kind === "error" ? status.message : ""}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
