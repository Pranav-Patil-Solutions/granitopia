# Granitopia — Page Enhancement Prompt (loop-engineered)

A single, hardcoded, reusable prompt for elevating **photos, UI, and UX** across
the site — grounded in the real brand at **https://www.granitopia.com**.

Per the repo build rule (see `AGENTS.md`): **engineer once, loop over every page,
verify each output before wiring it in.** Do **not** rewrite this prompt per page —
only fill `{{PAGE}}` / `{{PAGE_GOAL}}` and run it again.

---

## Brand truth — from granitopia.com (do NOT invent)

Use these real facts; never fabricate numbers, products, or contact details.

- **Name / tagline:** Granitopia Stones International LLP — _"Utopia of Natural Stones."_
- **Positioning / tone:** premium natural-stone **exporter**, global reach; confident,
  reliable, expert, understated-luxury. Editorial, not salesy.
- **Product categories:** Granite, Marble, Exotics, Monuments, Sandstone/Limestone/Slate,
  Tiles & Cobbles. Real named stones live in `src/data/stones.ts` (e.g. Absolute Black,
  Black Galaxy, Brown Fantasy, Crystallo Divine, Rainforest Green, Tan Brown).
- **Stats (only these):** 38+ countries · 200,000 SQM/year · 35 containers/year ·
  4 manufacturing units.
- **Contact:** sales@granitopia.com · +91 799 699 6655 (phone/WhatsApp) · Bengaluru,
  Karnataka, India (Jigani). Keep in sync with `src/lib/contact.ts`.
- **Visual style:** photographic stone surfaces; natural palette (blacks, greys, warm
  browns, cream) with a single **copper** accent. Clean, spacious, product-forward.

---

## Design system — this repo (reuse, don't reinvent)

- **Color tokens** (`src/app/globals.css`): `copper #b6702a`, `copper-deep #965a20`
  (filled buttons), `copper-bright #d98b45` (accents on dark), `gold #d19a20`,
  `ink #2c2c2c`, `ink-soft #6a6a6a`, `paper #fff`, `paper-2 #f6f3ee` (alt sections),
  `dark #3e3333`, `line #e4e0d9` (hairlines). Use tokens, never raw hexes.
- **Type:** `font-display` for headings; generous tracking on eyebrows
  (`text-xs uppercase tracking-[0.3em] text-copper`).
- **Section rhythm:** `px-6 py-24 md:py-32`, `max-w-7xl`/`max-w-5xl` containers,
  alternate `bg-paper` / `bg-paper-2`, `border-t border-line` between bands.
  Inner pages open with `<PageHeader eyebrow title subtitle? />`.
- **Reusable components:** `PageHeader`, `Reveal` / `RevealImage` (in-view fade,
  no-op under reduced motion), `StoneCard`, `Marquee`, `Stats`. Prefer composing
  these over new one-offs.
- **Images:** always `next/image` with `fill` + explicit `sizes`,
  `object-cover`, and a hover `scale-105` on `group-hover`. Self-host under
  `public/images/<section>/`. Remote hosts must be whitelisted in `next.config.ts`.
- **i18n:** all copy via next-intl namespaces in `messages/{en,de,ar}.json`.
  **Every key must exist in all three locales** — translate properly (no English
  in de/ar). Add nav labels under `Nav`.
- **Accessibility / motion:** honor `prefers-reduced-motion` (via `Reveal` /
  `useReducedMotion`), full **RTL** for Arabic (logical layout; mirror directional
  arrows with `rtl:` variants), visible focus states, alt text on every image,
  AA contrast (copper-deep on white, copper-bright on dark).

---

## THE PROMPT  (copy verbatim; fill `{{PAGE}}` and `{{PAGE_GOAL}}` only)

> **Role:** You are a senior product designer + front-end engineer for Granitopia
> ("Utopia of Natural Stones"), a premium natural-stone exporter. Reference the live
> brand at https://www.granitopia.com for tone, products, stats and imagery style.
>
> **Task:** Enhance the **`{{PAGE}}`** page of this Next.js 16 + next-intl site so it
> feels world-class — a quiet, editorial, luxury-stone brand. Goal of this page:
> **`{{PAGE_GOAL}}`**. Improve three dimensions and nothing else:
>
> **1 — PHOTOS.** Replace weak/placeholder visuals with grand, tactile, on-brand 4K
> photography that fits this page's story. Source license-free stock, **open and
> visually verify every candidate** (reject off-theme/wrong-mood shots), pick the
> best, and **self-host** it under `public/images/<section>/` (~2880px, q≈82). Wire
> with `next/image` (`fill`, real `sizes`, `object-cover`, tasteful `group-hover`
> scale, descriptive `alt`). Keep the natural palette + single copper accent; no
> text/logos baked into images. Document the one-line image brief you looped in a
> code comment.
>
> **2 — UI.** Tighten visual hierarchy using existing design tokens and components
> (`PageHeader`, `Reveal`, `StoneCard`, section rhythm `px-6 py-24 md:py-32`,
> `max-w-7xl`, alternating `paper`/`paper-2`, `border-line` dividers). Refine
> spacing, type scale (`font-display` headings, tracked copper eyebrows), card
> design, buttons (`copper` outline → `copper-deep` fill on hover), and imagery
> framing. Consistent, restrained, premium. Do not introduce new colors or a second
> accent.
>
> **3 — UX.** Sharpen the page's job-to-be-done and its path to a quote/contact.
> Clear primary CTA, scannable content order, logical reading flow, responsive at
> 375 / 768 / 1280, fast (lazy images, no layout shift), and a subtle in-view
> `Reveal` cadence. Add nothing that hurts clarity.
>
> **Constraints:** Use real brand facts only (stats, products, contact — never
> invent). Route all copy through `messages/{en,de,ar}.json`, translated properly
> and key-parity-complete across all three locales. Honor `prefers-reduced-motion`
> and full RTL for Arabic. Match the surrounding code style; reuse before you build.
>
> **Deliver:** the edited page + any new components/images, a short list of exactly
> what changed, and confirmation that `npm run build` compiles and prerenders
> en/de/ar with no errors.

---

## Pages to loop over  (`{{PAGE}}` → `{{PAGE_GOAL}}`)

| Page | File | Page goal |
|------|------|-----------|
| Home `/` | `app/[locale]/page.tsx` | Awe → trust → quote. Hero, proof, journey, collections. |
| About `/about` | `app/[locale]/about/page.tsx` | Credibility: quarry-to-container scale, mission/vision. |
| Collections `/collections` | `app/[locale]/collections/page.tsx` | Browse the six ranges; make each category enticing. |
| Category `/collections/[category]` | `app/[locale]/collections/[category]/page.tsx` | Rich grid of stones in a range; strong category hero. |
| Stone detail `/stones/[slug]` | `app/[locale]/stones/[slug]/page.tsx` | Sell one stone: big photography, specs, "request this". |
| Contact `/contact` | `app/[locale]/contact/page.tsx` | Frictionless enquiry; reassurance + direct WhatsApp. |
| Careers `/careers` | `app/[locale]/careers/page.tsx` | Attract talent; warm, human, aspirational roles. |
| Legal `/impressum` `/privacy` `/cookies` | `app/[locale]/…` | Clean, trustworthy, readable — UI/UX polish only, minimal imagery. |

**Per-page focus for PHOTOS:** About → quarry/manufacturing scale; Collections →
one evocative hero per category (reuse `public/images/categories/`); Stone detail →
large hero + macro veining; Contact → a warm showroom/handshake mood; Careers →
already themed. Legal pages need no new imagery.

---

## Verify each looped output (do not skip)

1. `npm run build` compiles; en/de/ar all prerender with no errors/warnings.
2. **Open every new image** to confirm it's on-theme, well-cropped, and reasonable
   weight (< ~3 MB each).
3. Locale **key parity**: no missing/extra keys across en/de/ar; de/ar are truly
   translated.
4. Spot-check the page at 375 / 768 / 1280 and in **RTL (`/ar`)**; no horizontal
   scroll, mirrored arrows correct.
5. `prefers-reduced-motion`: animations degrade to static.
6. Note anything intentionally skipped.

---

_Reference implementation of this exact method: the Journey chapter imagery — one
image brief looped across five chapters, each candidate opened and vetted — lives in
`src/components/three/storyChapters.ts` and `src/components/scroll/StoryScroller.tsx`._
