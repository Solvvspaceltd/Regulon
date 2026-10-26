"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion, mq } from "@/lib/motion";
import { maskUp } from "@/lib/reveal";
import { allLinks, company } from "@/lib/content";
import { RegulonMark } from "@/components/Logo";

/**
 * 09 · Footer
 * An oversized wordmark rises out of a mask as the footer arrives.
 */
export function SiteFooter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        maskUp(root.current!.querySelector("[data-wordmark]"), root.current, { duration: motion.duration.section * 1.2 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} data-theme="dark" className="bg-gradient-to-b from-transparent to-ink px-[var(--gutter)] pt-20 text-paper">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <RegulonMark tone="paper" />
              <span className="font-display text-[20px] font-bold">Regulon</span>
            </div>
            <p className="mt-4 max-w-[28rem] text-[15px] leading-relaxed text-soft-on-ink">
              Clocked and Regulon are products of {company.legal}, {company.place}. Company No. {company.number}.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-on-ink">Explore</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
              {allLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-paper underline-offset-4 hover:text-signal hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-on-ink">Contact</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
              <li>
                <a href="#join" className="text-paper underline-offset-4 hover:text-signal hover:underline">
                  Early access
                </a>
              </li>
              <li>
                {/* PLACEHOLDER: replace with the real contact address */}
                <a href="mailto:[CONTACT EMAIL]" className="text-paper underline-offset-4 hover:text-signal hover:underline">
                  [CONTACT EMAIL]
                </a>
              </li>
              <li>
                {/* PLACEHOLDER: link the privacy notice once written */}
                <a href="#" className="text-paper underline-offset-4 hover:text-signal hover:underline">
                  Privacy notice
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 overflow-hidden" aria-hidden="true">
          <p
            data-wordmark
            className="font-display text-[clamp(88px,22vw,340px)] font-bold leading-[0.78] tracking-[-0.06em] text-paper"
          >
            Regulon
          </p>
        </div>
        <p className="border-t border-paper/10 py-6 text-[13px] text-muted-on-ink">
          © {company.year} {company.legal}
        </p>
      </div>
    </footer>
  );
}
