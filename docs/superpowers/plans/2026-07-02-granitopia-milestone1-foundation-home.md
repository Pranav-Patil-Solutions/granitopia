# Granitopia Milestone 1 — Foundation + Immersive Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js + Obsidian design system with i18n/RTL, and build the immersive Home page (cinematic video hero + interactive 3D slab viewer + scroll storytelling) to a working localhost preview for Pranav's approval.

**Architecture:** Next.js 15 App Router + TypeScript on Vercel. Locale-routed (`/en` `/de` `/ar`) via `next-intl`, RTL for Arabic. Obsidian design tokens in Tailwind. 3D via React Three Fiber (lazy, WebGL-guarded, 2D fallback). Scroll via GSAP ScrollTrigger + Lenis (reduced-motion aware). Placeholder stock imagery + procedural stone materials now; `TODO(assets):` markers for real media.

**Tech Stack:** Next.js 15, TypeScript, Tailwind, next-intl, @react-three/fiber, @react-three/drei, gsap, lenis, framer-motion, Vitest + Testing Library, Playwright.

**Scope note:** This is Milestone 1 of the full spec (`docs/superpowers/specs/2026-07-02-granitopia-immersive-rebuild-design.md`). Milestones 2–5 (Collections, Stone detail, Forms/Analytics, Legal/Compliance, Perf) are separate plans written after this one is approved on localhost.

---

## File structure (Milestone 1)

```
granitopia/
  src/
    app/
      layout.tsx                 # root <html>, fonts, analytics mount
      [locale]/
        layout.tsx               # locale provider, dir=ltr|rtl, Nav/Footer
        page.tsx                 # Home: composes hero + featured + story + cta
    components/
      layout/Nav.tsx
      layout/Footer.tsx
      layout/LocaleSwitcher.tsx
      hero/VideoHero.tsx         # scroll-scrubbed video + poster/reduced-motion fallback
      three/SlabViewer.tsx       # R3F canvas, orbit, finish swap
      three/StoneMaterial.tsx    # procedural PBR material + useStoneMaterial hook
      three/WebGLGuard.tsx       # renders SlabViewer or 2D fallback
      scroll/StoryScroller.tsx   # GSAP pinned "quarry->factory->space"
      scroll/SmoothScroll.tsx    # Lenis provider
      home/Stats.tsx
      home/FeaturedStones.tsx
      home/QuoteCta.tsx
      ui/Reveal.tsx              # framer-motion in-view reveal, reduced-motion safe
    data/stones.ts               # typed Stone catalog (subset for featured)
    i18n/
      routing.ts                 # next-intl locales + routing
      request.ts                 # next-intl request config
    lib/
      motion.ts                  # prefers-reduced-motion helper
      webgl.ts                   # WebGL availability check
    styles/globals.css           # tailwind + tokens + font faces
  messages/{en,de,ar}.json
  public/media/                  # placeholder poster + procedural notes (TODO assets)
  tests/                         # vitest unit + playwright e2e
```

---

### Task 1: Scaffold Next.js project

**Files:** create project skeleton in `D:\vyaparwerk\granitopia`.

- [ ] **Step 1: Scaffold**
```bash
cd /d/vyaparwerk/granitopia
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --import-alias "@/*" --no-turbopack --use-npm
```
Expected: Next.js app created in current dir.

- [ ] **Step 2: Install deps**
```bash
npm i next-intl @react-three/fiber @react-three/drei three gsap lenis framer-motion react-hook-form zod @vercel/analytics
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react @playwright/test @types/three
```

- [ ] **Step 3: Verify build**
Run: `npm run build`
Expected: PASS (default app builds).

- [ ] **Step 4: Init git + commit**
```bash
git init && git add -A && git commit -m "chore: scaffold Next.js + deps for Granitopia rebuild"
```

---

### Task 2: Design tokens + fonts (Obsidian Gallery)

**Files:** Modify `src/styles/globals.css` (or `src/app/globals.css`), `tailwind.config.ts`.

- [ ] **Step 1:** Add CSS variables + font faces: obsidian `#0A0A0B`, charcoal `#141416`, ivory `#F2EDE4`, gold `#C9A961`, taupe secondaries. Load Fraunces (display), Inter (body), IBM Plex Sans Arabic via `next/font`.
- [ ] **Step 2:** Extend Tailwind theme colors (`obsidian`, `charcoal`, `ivory`, `gold`, `taupe`) + fontFamily (`display`, `body`, `arabic`).
- [ ] **Step 3:** Add base styles: dark bg, ivory text, `[dir=rtl]` font swap, `@media (prefers-reduced-motion)` reset.
- [ ] **Step 4:** Commit `style: obsidian design tokens + fonts`.

---

### Task 3: i18n routing + RTL (next-intl)

**Files:** Create `src/i18n/routing.ts`, `src/i18n/request.ts`, `messages/{en,de,ar}.json`, `middleware.ts`; move pages under `src/app/[locale]/`.

- [ ] **Step 1: Write failing test** `tests/i18n.test.ts` — asserts `routing.locales` = `['en','de','ar']`, `defaultLocale='en'`, and a helper `isRtl('ar') === true`, `isRtl('en') === false`.
- [ ] **Step 2:** Run `npx vitest run tests/i18n.test.ts` — expect FAIL (module missing).
- [ ] **Step 3:** Implement `routing.ts` (locales, defaultLocale, `isRtl`), `request.ts`, `middleware.ts` per next-intl App Router docs. Seed `messages/*.json` with `nav`, `hero`, `stats`, `cta` keys (EN real; DE/AR machine-draft + `TODO(i18n-review)`).
- [ ] **Step 4:** Run test — expect PASS.
- [ ] **Step 5:** `[locale]/layout.tsx` sets `<html lang dir>` from locale, wraps `NextIntlClientProvider`.
- [ ] **Step 6:** `npm run build` PASS; commit `feat: i18n routing + RTL scaffolding (en/de/ar)`.

---

### Task 4: Stone data model + featured subset

**Files:** Create `src/data/stones.ts`, `tests/stones.test.ts`.

- [ ] **Step 1: Failing test** — `Stone` records each have unique `slug`, non-empty `category`, ≥1 `finish`, valid `heroColor` hex; `featuredStones` length ≥ 3.
- [ ] **Step 2:** Run vitest — FAIL.
- [ ] **Step 3:** Implement `Stone` type (`slug, name, category, finishes[], heroColor, specs, i18nKey`) + ~8 seed stones + `featuredStones` export. `TODO(assets):` real imagery.
- [ ] **Step 4:** Run test — PASS. Commit `feat: typed stone catalog + featured subset`.

---

### Task 5: WebGL guard + reduced-motion helpers

**Files:** Create `src/lib/webgl.ts`, `src/lib/motion.ts`, `tests/webgl.test.ts`.

- [ ] **Step 1: Failing test** — `isWebGLAvailable()` returns boolean; `prefersReducedMotion()` reads matchMedia (mock).
- [ ] **Step 2:** vitest FAIL.
- [ ] **Step 3:** Implement both helpers (SSR-safe: guard `typeof window`).
- [ ] **Step 4:** vitest PASS. Commit `feat: webgl + reduced-motion guards`.

---

### Task 6: Layout — Nav, Footer, LocaleSwitcher

**Files:** Create `src/components/layout/{Nav,Footer,LocaleSwitcher}.tsx`; use in `[locale]/layout.tsx`.

- [ ] **Step 1:** Nav — fixed, transparent→obsidian on scroll, gold wordmark, links from messages, WhatsApp CTA to `+91 799 699 6655`. Keyboard accessible, skip-link.
- [ ] **Step 2:** LocaleSwitcher — en/de/ar, preserves path, sets dir.
- [ ] **Step 3:** Footer — offices, email `sales@granitopia.com`, socials, legal links (stubs), copyright.
- [ ] **Step 4:** `npm run build` PASS; commit `feat: nav, footer, locale switcher`.

---

### Task 7: SmoothScroll (Lenis) + Reveal (framer-motion)

**Files:** Create `src/components/scroll/SmoothScroll.tsx`, `src/components/ui/Reveal.tsx`.

- [ ] **Step 1:** SmoothScroll — Lenis provider, disabled when `prefersReducedMotion()`.
- [ ] **Step 2:** Reveal — in-view fade/translate, no-op under reduced motion.
- [ ] **Step 3:** Wrap Home in SmoothScroll; commit `feat: smooth scroll + reveal primitives`.

---

### Task 8: VideoHero (experience A)

**Files:** Create `src/components/hero/VideoHero.tsx`; add poster to `public/media/`.

- [ ] **Step 1:** Full-bleed muted looping video with gold headline overlay + "Watch the film" + scroll cue. `TODO(assets):` real quarry footage; use a tasteful placeholder gradient/video now.
- [ ] **Step 2:** Scroll-scrub via GSAP ScrollTrigger mapping scroll→`video.currentTime`; fall back to static poster + CSS parallax under reduced motion / no-JS.
- [ ] **Step 3:** Verify on localhost by eye; commit `feat: cinematic scroll-scrubbed video hero`.

---

### Task 9: SlabViewer + StoneMaterial + WebGLGuard (experience B)

**Files:** Create `src/components/three/{SlabViewer,StoneMaterial,WebGLGuard}.tsx`.

- [ ] **Step 1:** StoneMaterial — procedural PBR (noise-based veining, roughness per finish) + `useStoneMaterial(finish)` hook.
- [ ] **Step 2:** SlabViewer — R3F Canvas, slab mesh, OrbitControls (damped), studio lighting, finish-swap buttons (polished/leathered/honed). Lazy-mounted (`next/dynamic`, `ssr:false`) on scroll into view.
- [ ] **Step 3:** WebGLGuard — render SlabViewer if `isWebGLAvailable()`, else a static 2D slab image fallback.
- [ ] **Step 4:** Verify interaction on localhost; commit `feat: interactive 3D slab viewer + fallback`.

---

### Task 10: StoryScroller (experience C) + Stats + FeaturedStones + QuoteCta

**Files:** Create `src/components/scroll/StoryScroller.tsx`, `src/components/home/{Stats,FeaturedStones,QuoteCta}.tsx`.

- [ ] **Step 1:** StoryScroller — GSAP pinned "quarry → factory → your space" with parallax; degrades to stacked sections under reduced motion.
- [ ] **Step 2:** Stats — 38+ countries / 600,000+ m² / 1,000+ containers / 4 units, count-up on view.
- [ ] **Step 3:** FeaturedStones — grid from `featuredStones`, hover reveal, links (stub) to future detail pages.
- [ ] **Step 4:** QuoteCta — gold CTA → `/quote` (stub) + WhatsApp.
- [ ] **Step 5:** Compose all in `[locale]/page.tsx`. `npm run build` PASS; commit `feat: home story, stats, featured, cta`.

---

### Task 11: E2E smoke + preview

**Files:** Create `tests/e2e/home.spec.ts`.

- [ ] **Step 1:** Playwright — `/en`, `/de`, `/ar` load; `/ar` has `dir="rtl"`; hero headline + at least one CTA visible; LocaleSwitcher changes locale.
- [ ] **Step 2:** Run `npx playwright test` — PASS (headless).
- [ ] **Step 3:** `npm run build` PASS, then `npm run dev`; smoke-test in browser.
- [ ] **Step 4:** Hand Pranav the **localhost link** for approval (per deployment rule — no deploy before his OK). Commit `test: home e2e smoke`.

---

## Self-Review

**Spec coverage (Milestone 1 portion):** Obsidian tokens (T2) ✓, i18n/RTL en+de+ar (T3) ✓, stone data (T4) ✓, perf/degradation guards (T5,7) ✓, layout+WhatsApp (T6) ✓, experiences A/B/C (T8,9,10) ✓, localhost preview gate (T11) ✓. Deferred to later milestones (correctly out of scope here): Collections/Stone-detail pages, Contact/Quote form submission + Formspree, Vercel Analytics + consent, Legal pages, full compliance audit, perf tuning pass. These are named in the spec §12 phases and will each get a plan.

**Placeholder scan:** No lazy placeholders; `TODO(assets|i18n-review)` are intentional asset/translation sentinels, not plan gaps.

**Type consistency:** `Stone` (slug/name/category/finishes/heroColor/specs/i18nKey) used consistently in T4/T9/T10; `useStoneMaterial(finish)` and `isWebGLAvailable()`/`prefersReducedMotion()` names consistent across T5/T9/T7.
