# Regulon — marketing site

The public site for **Regulon** (human-risk platform for organisations) and **Clocked** (the consumer app, powered by Regulon), products of SolvvSpace Limited.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3 + ScrollTrigger · Lenis

---

## Run it

```bash
npm install
cp .env.example .env.local      # optional: add WAITLIST_WEBHOOK_URL
npm run dev                     # http://localhost:3000
```

Production check:

```bash
npm run build && npm run start
```

`npm run lint` and `npx tsc --noEmit` should both pass clean.

---

## 1. Information architecture

Single long-form page. Every nav link is an in-page anchor, so back/forward, direct links (`/#drill`) and refreshes all work natively.

| # | Section | Anchor | Job |
|---|---------|--------|-----|
| 01 | Hero | `#top` | State the idea in four words: one score, three scales |
| 02 | Introduction | `#intro` | Why people, not systems |
| 03 | Three scales | `#scales` | The core story: you → household → organisation |
| 04 | Products | `#products` | Two equal doors: Clocked and Regulon |
| 05 | The loop | `#process` | Baseline → Stories → Drills → Score |
| 06 | Drill demo | `#drill` | Show impact interactively (example figures) |
| 07 | Principles | `#principles` | Trust: disclosed drills, real stories, privacy wall |
| 08 | Early access | `#join` | Conversion: one form, two audiences |
| 09 | Footer | — | Company details, navigation |

Deliberately left out until real content exists: a work/case-study gallery, testimonials and a statistics block. Inventing those would undermine a product whose whole pitch is trust.

## 2. Visual direction

- **Concept:** the score ring is the brand. It is the logo, the hero visual, the product UI and the thread through every section.
- **Ground:** warm paper `#F5F1E8` with ink `#0E1A22`; dark sections bookend the page (hero, principles, footer).
- **Signal:** one amber `#F0A04B` for scores, focus and calls to action. A deeper `#A3500F` is used for small text on paper, where it passes AA.
- **Type:** Bricolage Grotesque (display, variable), IBM Plex Sans (body), IBM Plex Mono (labels and figures). All are self-hosted from `src/fonts`, with OFL licences included, so there are no third-party font requests.
- **Layout:** editorial. Large type, rule lines that open each section, generous whitespace and no card grids.
- All tokens live in `src/app/globals.css` under `@theme`.

## 3. Motion language

Three primary transition styles, used consistently:

1. **Masked rise.** Text slides up from behind its own mask (headlines, footer wordmark).
2. **Clip-path reveal.** Panels open from an inset rounded mask (product doors).
3. **Colour interpolation.** Backgrounds shift paper → ink on scroll (principles), and the header re-themes to match the section beneath it.

Supporting: scroll-scrubbed word brightening (intro), sticky-card state changes (three scales), a scrubbed progress line (timeline), ring arc drawing (hero and dashboard).

### Motion tokens: `src/lib/motion.ts`

| Token | Value |
|---|---|
| Micro-interactions | 180 ms |
| Text reveals | 800 ms, `expo.out` |
| Component entrances | 600 ms, `expo.out` |
| Section transitions | 1000 ms, `power3.inOut` |
| Ring draw | 1400 ms, `power3.inOut` |
| Word stagger | 60 ms |
| Item stagger | 90 ms |
| Magnet strength | 0.28 |
| Card tilt | ±6° |

CSS mirrors (`--ease-out-expo`, `--duration-*`) are in `globals.css`.

### Hero load sequence

1. An inline script marks the document `motion-ready` before first paint, so hero pieces start hidden and there is no flash.
2. The ring fades and scales in.
3. Its arc draws while the number counts 0 → 82.
4. The headline rises word by word.
5. The intro copy staggers in.
6. The calls to action follow.
7. The navigation drops in.
8. The scroll cue appears and the outer ring begins a slow ambient drift.
9. Scrolling eases the hero copy up and the ring down (scrubbed, reversible).

**Safety:** if JavaScript fails to load, a CSS fallback reveals the hero after 2.5 s. Reduced-motion visitors never get the hidden state at all.

### Rules followed

- Every reveal tween states its end values explicitly, through `src/lib/reveal.ts`, so nothing can be left stuck invisible.
- Scroll effects are either `once` entrances or scrubbed to real scroll position, so they are deterministic and reversible.
- There is no scroll hijacking: the sticky story uses native CSS `position: sticky`. Lenis adds smoothing on wheel only and leaves touch scrolling native.
- Animations use transform and opacity. Bars and rings use CSS transitions on width and dash-offset, which are cheap at these sizes.
- All GSAP work runs inside `useGSAP` with `gsap.matchMedia`, so it is reverted on unmount and when media conditions change.

## 4. Component architecture

```
src/
  app/
    layout.tsx           fonts, metadata, pre-paint motion gate
    page.tsx             section composition
    globals.css          design tokens, base, focus, reduced motion
    api/waitlist/route.ts  sign-up endpoint (validates, forwards to webhook)
  lib/
    motion.ts            central motion presets and media queries
    gsap.ts              plugin registration (client only)
    reveal.ts            revealUp / maskUp helpers (explicit end states)
    content.ts           all copy and example figures in one place
  components/
    SiteHeader.tsx       theme-aware header, active section, progress line, mobile menu
    SmoothScroll.tsx     Lenis ↔ ScrollTrigger sync
    MagneticButton.tsx   fill animation and magnetic pull (fine pointers only)
    AnimatedHeading.tsx  masked word-by-word reveal
    TextReveal.tsx       scroll-scrubbed word brightening
    AnimatedCounter.tsx  number tweening
    InteractiveCard.tsx  pointer tilt (fine pointers only)
    ScoreRing.tsx        the ring
    Logo.tsx             Regulon and Clocked marks
  sections/
    Hero, Intro, ThreeScales, Products, Process, DrillDemo, Principles, Join, SiteFooter
  fonts/                 self-hosted woff2 and OFL licences
```

## 5. Per-section notes

| Section | Entry | Scroll | Hover | Mobile | Reduced motion |
|---|---|---|---|---|---|
| Hero | Sequenced timeline | Copy and ring parallax (scrub) | Magnetic CTAs | Ring dimmed to 35%; no number or scroll cue | Static, fully visible |
| Intro | — | Words brighten (scrub) | — | Same | Full-strength text |
| Three scales | Panel items rise | Sticky card switches scale at viewport centre | — | No sticky; each panel shows its own ring | Same states, no tween |
| Products | Clip-path open and stagger | — | Tilt and button fills | Stacked | Static |
| Process | Steps rise | Progress line and markers (scrub) | — | Vertical line | Line full, markers on |
| Drill demo | Heading mask | — | Button | Stacked | Instant number changes |
| Principles | Items rise | Background paper → ink; outline → solid headline | — | Same | Solid headline, dark ground |
| Join | Heading mask | — | Button fill, focus ring | Stacked form | Same |
| Footer | Wordmark rises | — | Link colour | Same | Static |

## 6. Accessibility

- Semantic landmarks, one `h1`, ordered headings, and a skip link to `#main`.
- The mobile menu is a modal dialog: focus moves in, Tab is trapped, Escape closes it and focus returns to the toggle.
- Visible `:focus-visible` ring everywhere (3 px amber).
- Rings carry `role="img"` with a spoken label. Animated counters are hidden from screen readers and paired with real text.
- Live regions announce the active scale, drill results and form status.
- The form has a labelled input, `aria-invalid`, and described-by hint and status text.
- `prefers-reduced-motion` is respected everywhere. No content depends on animation to be readable.

## 7. Performance

- Two client libraries for motion (GSAP and Lenis), with no 3D or WebGL. Three.js and shaders weren't justified for this content and would cost real weight on mobile.
- Fonts are self-hosted with `display: swap`. Only latin subsets are included, about 130 KB total.
- The page is prerendered static; only `/api/waitlist` runs on demand.
- Animation contexts are cleaned up on unmount, and there is one Lenis RAF loop driven by the GSAP ticker.

## 8. Testing checklist

Verified during build:

- [x] `npm run build`, lint and type-check clean
- [x] 1440 × 900, 1280 × 800 and 390 × 844: no horizontal overflow, no console errors
- [x] Hero sequence completes and all elements end visible
- [x] Reduced motion: hero fully visible at first paint
- [x] Sticky story switches scale and the titles stay visible
- [x] Drill demo moves every team bar and the overall score
- [x] Form: invalid email is flagged; submitting without a webhook shows the "not open yet" message
- [x] Mobile menu: focus in, Escape closes, focus returns
- [x] Header stays solid at the bottom of the page

Still to run on real devices before launch:

- [ ] iOS Safari and Android Chrome (address-bar resize, sticky behaviour)
- [ ] Firefox and Safari desktop
- [ ] Throttled network ("Slow 4G") and low-power CPU (4× slowdown)
- [ ] Rapid scrolling and resizing during animations
- [ ] Screen reader pass (VoiceOver, NVDA)
- [ ] Lighthouse / Core Web Vitals on the deployed URL
- [ ] Live form submission once `WAITLIST_WEBHOOK_URL` is set

## 9. Placeholders to replace

- `[CONTACT EMAIL]` in `src/sections/SiteFooter.tsx`
- Privacy notice link (footer). Write the notice before collecting emails.
- App store links once Clocked is listed. They currently point to `#join`.
- Example figures in `src/lib/content.ts` stay labelled "example" until you have real data.

## 10. Deployment

### Vercel (simplest)

1. Push the repo to GitHub.
2. Import it at vercel.com/new. The defaults are correct for Next.js.
3. Add `WAITLIST_WEBHOOK_URL` under Project → Settings → Environment Variables.
4. Point your domain at it under Project → Domains.

### Self-hosted (any Node 20+ host, Azure App Service, a container)

```bash
npm ci
npm run build
WAITLIST_WEBHOOK_URL=https://… npm run start   # serves on PORT (default 3000)
```

Put it behind your usual reverse proxy and TLS.

### Hooking up the form with Power Automate

Create a flow with the trigger **"When an HTTP request is received"**. Use this JSON schema: `email` (string), `audience` (string), `source` (string), `at` (string). Then add your action, for example adding a row to a SharePoint list or Excel table. Paste the flow's HTTP POST URL into `WAITLIST_WEBHOOK_URL`.
