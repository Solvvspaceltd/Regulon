"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { allLinks, navLinks } from "@/lib/content";
import { PlatformMenu } from "./PlatformMenu";
import { RegulonWordmark } from "./Logo";
import { MagneticButton } from "./MagneticButton";
import { getLenis } from "./SmoothScroll";

type Theme = "dark" | "light";

/**
 * Header that reads the section beneath it: transparent over the dark hero,
 * then a quiet frosted bar that flips between light and dark as sections
 * change. Includes an active-section indicator, a scroll progress line and
 * an accessible full-screen mobile menu.
 */
export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useGSAP(() => {
    const triggers: ScrollTrigger[] = [];

    document.querySelectorAll<HTMLElement>("[data-theme]").forEach((section) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top+=36",
          end: "bottom top+=36",
          onToggle: (self) => {
            if (self.isActive) setTheme(section.dataset.theme as Theme);
          },
        }),
      );
    });

    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(id);
            else setActive((cur) => (cur === id ? null : cur));
          },
        }),
      );
    });

    // "Scrolled" means anywhere past the very top, including the very bottom.
    const scrolledTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScrolled(self.scroll() > 12),
      onRefresh: (self) => setScrolled(self.scroll() > 12),
    });
    triggers.push(scrolledTrigger);

    const progress = gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
    );

    return () => {
      triggers.forEach((t) => t.kill());
      progress.scrollTrigger?.kill();
      progress.kill();
    };
  });

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, focus the first link, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const menu = menuRef.current;
    const focusables = menu?.querySelectorAll<HTMLElement>("a, button");
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab" && focusables && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, close]);

  const dark = theme === "dark";
  const surface = !scrolled
    ? "bg-transparent"
    : dark
      ? "bg-ink/80 backdrop-blur-md"
      : "bg-paper/85 backdrop-blur-md border-b border-paper-3";
  const text = dark ? "text-paper" : "text-ink";

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-signal px-5 py-3 font-semibold text-ink"
      >
        Skip to content
      </a>
      <header
        ref={header}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-[var(--ease-out-expo)] ${surface} ${text}`}
        data-header
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1240px] items-center justify-between gap-4 px-[var(--gutter)]">
          <a href="#top" aria-label="Regulon, back to top" data-intro-hide data-nav>
            <RegulonWordmark tone={dark ? "paper" : "ink"} />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-8 text-[15px] lg:flex" data-intro-hide data-nav>
            {navLinks.map((l) => {
              const isActive = active === l.id;
              if (l.id === "platform") return <PlatformMenu key={l.id} active={isActive} />;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className="group relative py-2"
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-signal transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3" data-intro-hide data-nav>
            <span className="hidden sm:inline-block">
              <MagneticButton href="#join" variant="signal">
                Get early access
              </MagneticButton>
            </span>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-current lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 8h16" className={`origin-center transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
                <path d="M4 16h16" className={`origin-center transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
              </svg>
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="h-[2px] w-full">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-signal" />
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink text-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="flex h-full flex-col justify-center gap-2 px-[var(--gutter)] pt-[var(--header-h)]">
          {allLinks.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-paper/10 py-3.5 font-display text-[clamp(26px,7vw,42px)] font-semibold tracking-[-0.03em]"
            >
              <span className="font-mono text-[13px] text-signal">0{i + 1}</span>
              {l.label}
            </a>
          ))}
          <div className="mt-8">
            <MagneticButton href="#join" onClick={() => setOpen(false)} arrow>
              Get early access
            </MagneticButton>
          </div>
        </nav>
      </div>
    </>
  );
}
