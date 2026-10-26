"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Orb } from "./Orb";
import { AssessLink } from "./AssessLink";

const I = {
  assess: ["M12 21a9 9 0 100-18 9 9 0 000 18z", "M12 12l4-4"],
  learn: ["M4 5h11a3 3 0 013 3v11H7a3 3 0 01-3-3z", "M8 9h6", "M8 13h4"],
  practise: ["M4 6h16v10H8l-4 4z", "M9 11l2 2 4-4"],
  certify: ["M12 15a5 5 0 100-10 5 5 0 000 10z", "M9 14l-2 7 5-3 5 3-2-7"],
  family: ["M9 11a3 3 0 100-6 3 3 0 000 6z", "M3 20c0-3 3-5 6-5s6 2 6 5", "M17 8a2.5 2.5 0 110 5", "M21 20c0-2-1.5-3.5-3.5-4"],
  org: ["M4 21V7l8-4 8 4v14", "M9 21v-5h6v5", "M9 10h.01M15 10h.01"],
  plans: ["M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8L3.5 9.2l5.9-.9z"],
  mail: ["M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z", "M3 7l9 6 9-6"],
};

function Icon({ d }: { d: string[] }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const groups = [
  {
    title: "Training path",
    items: [
      { href: "#assess", icon: I.assess, label: "Self-assessment", note: "Step one: your baseline score and top fixes" },
      { href: "#platform", icon: I.learn, label: "Story lessons", note: "Real scams, told the way they unfolded" },
      { href: "#platform", icon: I.practise, label: "Disclosed drills", note: "Practice in email, text and calls, opted into" },
      { href: "#platform", icon: I.certify, label: "Certificates", note: "Proof of completion for people and staff" },
    ],
  },
  {
    title: "Products and plans",
    items: [
      { href: "#products", icon: I.family, label: "Clocked for families", note: "The app for you and your household" },
      { href: "#products", icon: I.org, label: "Regulon for organisations", note: "Human-risk score, simulations and reports" },
      { href: "#products", icon: I.mail, label: "Microsoft 365 integration", note: "Drills and reporting inside Outlook" },
      { href: "#plans", icon: I.plans, label: "Bronze, Silver, Gold", note: "Plans for families and organisations" },
    ],
  },
];

/**
 * "Platform" in the header: a disclosure button that opens a capability map.
 * Opens on click or keyboard (and on hover for mouse users); closes on
 * Escape, an outside click, or choosing a link. Focus returns to the button.
 */
export function PlatformMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const hover = (next: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(next), next ? 80 : 220);
  };

  return (
    <div ref={wrap} className="static" onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="group relative flex items-center gap-1.5 py-2"
      >
        Platform
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-signal transition-transform duration-500 ease-[var(--ease-out-expo)] ${
            active || open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-50 px-[var(--gutter)] pt-1.5"
      >
        <div className="menu-in mx-auto grid max-w-[1120px] gap-8 rounded-[28px] border border-paper/12 bg-ink/95 p-8 text-paper shadow-[var(--shadow-float)] backdrop-blur-xl lg:grid-cols-[1fr_1fr_300px]">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="border-b border-paper/10 pb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-on-ink">{g.title}</p>
              <ul className="mt-4 flex flex-col gap-1">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      onClick={() => setOpen(false)}
                      className="group/item flex gap-3.5 rounded-xl p-3 transition-colors duration-200 hover:bg-paper/[0.06] focus-visible:bg-paper/[0.06]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-paper/10 bg-ink-2 text-signal transition-colors group-hover/item:border-signal/40">
                        <Icon d={it.icon} />
                      </span>
                      <span>
                        <span className="block text-[15px] font-semibold">{it.label}</span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted-on-ink">{it.note}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="relative flex flex-col overflow-hidden rounded-[20px] border border-paper/10 bg-ink-2/80 p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 w-44 opacity-90">
              <Orb value={100} className="w-full" />
            </div>
            <p className="relative mt-28 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">Start here</p>
            <p className="relative mt-2 font-display text-[22px] font-semibold leading-tight tracking-[-0.02em]">How exposed are you?</p>
            <p className="relative mt-2 text-[13px] leading-relaxed text-muted-on-ink">
              Ten questions, an indicative score and your top fixes. Nothing leaves your browser.
            </p>
            <div className="relative mt-5" onClick={() => setOpen(false)}>
              <AssessLink mode="personal" variant="signal" arrow>
                Check My Security
              </AssessLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
