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

Single long-form page, built as one continuous interface. Every nav link is an in-page anchor, so back and forward buttons, direct links and refreshes all work.

| # | Section | Anchor | Job |
|---|---------|--------|-----|
| — | Intro | — | First visit per session: the orb assembles, then glides into the hero (about 2.5 s, skippable) |
| 01 | Hero | `#top` | "How exposed is your digital world?" with two entry points |
| 02–06 | Story | `#story` | Footprint → assessment → score → risks → actions → call to action, one continuous visual |
| 07 | Self-assessment | `#assess` | Step one of every training path: personal (10 questions) or organisation (8) |
| 08 | Platform | `#platform` | Assess → Learn → Practise → Certify, then the certificate |
| 09 | Products | `#products` | Two doors: Clocked and Regulon |
| 10 | Plans | `#plans` | Bronze, Silver, Gold for families and organisations (**draft contents, no prices yet**) |
| 11 | Principles | `#principles` | Trust: disclosed drills, earned scores, personal stays personal |
| 12 | Early access | `#join` | Conversion |

**Layout rhythm.** Placement varies deliberately so the page never settles into a left-text, right-visual pattern.

- Intro and hero: centred.
- Story chapters:
  - Footprint: copy left.
  - Assessment: copy right.
  - Score: centred.
  - Risks: copy left.
  - Actions: copy right.
  - Closing: centred.
- In each story chapter the orb and its visual travel to the opposite side of the copy.
- Platform: centred heading over a stepped trail.
- Certificate: visual left, copy right.
- Plans: centred.
- Principles: headline right-aligned.

The header's **Platform** button opens a capability map (`src/components/PlatformMenu.tsx`).

## 2. Visual direction

- **Concept:** the score ring became a **glass orb**, an amber network inside a glass sphere, wrapped in the score arc. It is the logo, the intro, the hero, the product UI and the thread through the whole story.
- **Art direction:** a dark, glass-and-light-trails world. The supplied image sits in the persistent backdrop. Orbs, trails, particles and grid are drawn in code (SVG/CSS), so they stay sharp at any size and can animate.
- **Palette:** ink `#0E1A22` ground, amber `#F0A04B` signal, paper `#F5F1E8` text, with a single paper card for the sign-up as the closing contrast moment.
- **Type:** Bricolage Grotesque (display), IBM Plex Sans (body), IBM Plex Mono (labels). All self-hosted.
- **Tokens:** `src/app/globals.css` (`@theme`). Motion presets: `src/lib/motion.ts`.

### Swapping in the full-resolution image pack

Put files in `public/media/` and reference them through `asset()` (`src/lib/asset.ts`), which adds the GitHub Pages base path. To replace the backdrop, export the new image as `backdrop-760` and `backdrop-1206` in `.avif`, `.webp` and `.jpg`, or add larger widths to the `srcSet` in `src/components/Backdrop.tsx`.

## 3. Motion language

**One persistent stage.** The backdrop never unmounts, and the orb is a single element that moves from the intro into the hero and through every chapter. Nothing is destroyed and recreated.

### Intro timeline (`src/sections/Story.tsx`)

| Time | Stage |
|---|---|
| 0.0 s | A point of light appears |
| 0.25 s | Concentric rings pulse out; the orb's network lines form |
| 0.8 s | The glass body and score arc assemble |
| 1.4 s | The scanning arc and indicator points come alive |
| 1.45 s | REGULON rises letter by letter |
| 1.95 s | Status changes from "Initialising interface" to "Interface ready" |
| 2.35 s | The veil lifts and the orb glides into its hero position |
| 2.95 s | Headline, copy, calls to action and navigation reveal in sequence |

**Rules:**

- The intro plays once per browser session, is skipped for deep links (`/#assess`), and stops on any key, click, scroll or the Skip button.
- It is desktop-only, is never shown with reduced motion, and never pretends to scan anything.

### Story choreography

- The copy scrolls normally on the left; the visual is sticky on the right (native `position: sticky`, no scroll hijacking).
- One scrubbed timeline maps exactly one unit to each one-screen block, so chapter *k* always lines up with block *k*, and it is fully reversible.
- Six shared elements change role through the chapters: footprint node → assessment row → (converge into the score) → risk card → checklist item.

### Other details

- **Pointer:** the orb tilts toward the cursor, and the backdrop layers shift at different depths, on fine pointers only.
- **Timing tokens** (`src/lib/motion.ts`): micro 180 ms, text 800 ms, components 600 ms, sections 1000 ms. Staggers are 60 ms for words and 90 ms for items.

## 4. Component architecture

```
src/
  app/            layout (fonts, pre-paint mode script), page, globals.css, api/waitlist
  lib/            motion, gsap, reveal, content (all copy + questions), asset, seeded
  components/
    Backdrop        persistent image, grid, light trails, particles, pointer depth
    Orb             the glass orb (hooks: data-orb-*)
    StoryVisuals    static chapter visuals for phones / reduced motion / no-JS
    AssessLink      buttons that open the assessment in a chosen mode
    SiteHeader, SmoothScroll, MagneticButton, AnimatedHeading,
    AnimatedCounter, InteractiveCard, Logo
  sections/
    Story           intro + hero + chapters 01–06
    Assessment      the self-assessment and results
    Products, Principles, Join, SiteFooter
```

## 5. Modes and fallbacks

A small inline script picks the experience before the first paint, so nothing jumps.

| Situation | Experience |
|---|---|
| Desktop (≥ 900 px), motion allowed | Intro (first visit), sticky animated story |
| Phone or tablet portrait | Copy in normal flow with a static visual under each chapter; light reveals |
| `prefers-reduced-motion` | Static flow, no intro, everything visible immediately |
| JavaScript fails | Static flow. If the bundle fails mid-way, hidden hero pieces reveal after 6 s |

### Honesty rules built in

- Story figures are labelled **Example** wherever they appear.
- The self-assessment's score is computed only from the visitor's answers and labelled **indicative**. It makes **no network requests** (verified in testing) and stores nothing.
- Nothing is scanned. Any future active checks on organisational assets must require proof of authorisation first.

## 6. Accessibility

- Semantic landmarks, one `h1`, ordered headings, skip link.
- The assessment uses real radio inputs inside a fieldset. Focus moves to each new question, then to the result heading.
- The mobile menu is a modal dialog with a focus trap and Escape to close.
- Decorative layers are `aria-hidden`. Score visuals carry spoken labels.
- `prefers-reduced-motion` is respected everywhere.

## 7. Performance

- The backdrop image is 46 KB as AVIF (WebP and JPEG fallbacks).
- Everything else visual is SVG/CSS. There is no WebGL or 3D library; the orb doesn't need one.
- GSAP and Lenis only. All contexts are reverted on unmount, and the ambient loops are a few transform tweens.

## 8. Testing checklist

Verified during build (Chromium, 1440 × 900 and 390 × 844):

- [x] Build, lint and type-check clean; no console errors
- [x] Intro frames: the orb assembles in full light, glides to the hero, and the hero reveals
- [x] Each chapter lands exactly on its own state (layer opacities measured per chapter)
- [x] Assessment: the organisation button opens organisation mode; all questions are answerable; the result renders; focus lands on the result; **zero network requests**
- [x] Mobile static flow: no horizontal overflow
- [x] Reduced motion: no intro, content visible at first paint
- [x] GitHub Pages static build: assets and the backdrop image load under `/Regulon/`

Still to run on real devices:

- [ ] Safari and Firefox (desktop), iOS Safari, Android Chrome
- [ ] Low-power CPU (4× throttle): intro and scrub smoothness
- [ ] Keyboard-only and screen reader pass
- [ ] Lighthouse on the live URL

## 9. Placeholders to replace

- `[CONTACT EMAIL]` in `src/sections/SiteFooter.tsx`
- Plan contents in `src/lib/content.ts` (`plans`), including the family member limit `[5]`, are a draft to confirm. Prices are intentionally absent.
- Certificate details (path names, date, verification) once the training platform exists.
- Full-resolution originals of the image pack (see "Swapping in the full-resolution image pack"). Confirm SolvvSpace holds a commercial licence for them.
- Privacy notice link (footer). Write the notice before collecting emails.
- App store links once Clocked is listed. They currently point to `#join`.
- Example figures in `src/lib/content.ts` stay labelled "example" until you have real data.

## 10. Deployment

The same code deploys two ways. Nothing needs changing to move between them.

| | GitHub Pages (current) | Vercel Pro (later) |
|---|---|---|
| Build | Static export (`DEPLOY_TARGET=pages`) | Normal Next.js app |
| Sign-up form | Browser posts to `WAITLIST_URL` | Server route `/api/waitlist` forwards to `WAITLIST_WEBHOOK_URL` |
| Webhook URL | Visible in page source | Hidden on the server |
| Deploys | `.github/workflows/pages.yml` on push to `main` | Vercel on push to `main` |

### GitHub Pages (current)

One-time setup:

1. **Settings → General → Danger Zone → Change visibility → Public.** Pages is free on public repositories.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main`, or run the workflow from the **Actions** tab. When it goes green, the site is at `https://solvvspaceltd.github.io/Regulon/`.

The workflow:

- installs with `npm ci`
- drops the server-only `src/app/api` folder from the build
- exports static files with the correct base path
- publishes them

**Custom domain later:** add it under Settings → Pages → Custom domain and set the DNS records GitHub shows you. The workflow reads the new base path from GitHub automatically, so the site moves from `/Regulon/` to the root without code changes. Tick **Enforce HTTPS** once the certificate is issued.

### Vercel Pro (later)

1. Import the repo at vercel.com/new. The defaults are correct.
2. Add `WAITLIST_WEBHOOK_URL` under Project → Settings → Environment Variables.
3. Add your domain under Project → Domains, and remove it from GitHub Pages.
4. Delete `.github/workflows/pages.yml` or disable it, so the two hosts don't both deploy.

Vercel's free Hobby plan is for non-commercial use only. This site needs Pro.

### Self-hosted (any Node 20+ host, Azure App Service, a container)

```bash
npm ci
npm run build
WAITLIST_WEBHOOK_URL=https://… npm run start   # serves on PORT (default 3000)
```

## 11. Sign-up form

### On GitHub Pages

The browser posts straight to your webhook. It sends `text/plain` containing JSON:

```json
{ "email": "…", "audience": "family | organisation", "source": "regulon-site", "at": "ISO date" }
```

Sending `text/plain` avoids a CORS preflight. The webhook must still reply with an `Access-Control-Allow-Origin` header, or the browser can't read the reply and the visitor sees an error, even though the data arrived.

**Power Automate setup:**

1. Trigger: **When an HTTP request is received**. Allow anyone to trigger it, because website visitors aren't signed in.
2. **Parse JSON** on the request body, with the schema above. The body arrives as text; if Parse JSON rejects it, set Content to the expression `json(triggerBody())`.
3. **Condition:** only continue if `email` contains `@` and `source` equals `regulon-site`. This is basic spam filtering, because the URL is public.
4. Your action, for example adding a row to a SharePoint list.
5. **Response**: status 200, with the header `Access-Control-Allow-Origin` set to `https://solvvspaceltd.github.io` (or your custom domain later).
6. Copy the trigger's URL. In the repo, add it under **Settings → Secrets and variables → Actions → Variables → New variable**, named `WAITLIST_URL`. Re-run the workflow.

Without `WAITLIST_URL`, the live form tells visitors sign-up isn't open yet and sends nothing.

Test it end to end once it's live: submit your own email and check that the row appears and the page says "You're on the list".

### On Vercel or a Node host

Set `WAITLIST_WEBHOOK_URL` as a server environment variable. The `/api/waitlist` route validates the email, adds a honeypot check, and forwards it. The URL never reaches the browser, and no CORS header is needed.
