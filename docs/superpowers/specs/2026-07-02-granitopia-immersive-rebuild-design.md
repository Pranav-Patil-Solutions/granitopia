# Granitopia — Immersive 3D + Video Website (Production Rebuild)

**Date:** 2026-07-02
**Owner:** Pranav (HandelOS)
**Status:** Design approved — proceeding to implementation plan
**Project home:** `D:\vyaparwerk\granitopia`

---

## 1. Summary

Rebuild [granitopia.com](https://www.granitopia.com/) — the site of **Granitopia Stones International LLP**, a
Bengaluru-based natural-stone exporter ("Utopia of Natural Stones", 38+ countries, 4 units, 600,000+ m²/yr) —
as a **production-grade, immersive, 3D + video, trilingual website**. The current site is a clean but static
product-photography layout; the rebuild makes stone feel *expensive* through a dark cinematic identity, real
WebGL 3D, cinematic video, and scroll-driven storytelling.

## 2. Decisions locked in brainstorming

| Question | Decision |
|---|---|
| Purpose | **Production replacement** for the live site |
| Scope | **Full multi-page site** |
| Assets | **Build now, swap later** — stock imagery + procedural 3D materials now; real photos/video/scans wired in before go-live (`TODO(assets):` markers) |
| Brand | **Open to full rebrand** (name + tagline kept) |
| Visual direction | **"Obsidian Gallery"** — dark, cinematic, gold-accented luxury |
| Immersive core | **A + B + C** — cinematic video hero, interactive 3D slab viewer, scroll storytelling. (D — virtual 3D showroom — deferred to phase 2.) |
| Lead capture | **WhatsApp click-to-chat + Formspree + Vercel Analytics** (no backend) |
| Languages | **English + German + Arabic**, including **RTL** for Arabic |

## 3. Architecture

**Chosen: Next.js (App Router) + React Three Fiber — full custom build.**
Rejected alternatives: Astro + islands (fights heavy scroll-scrub + R3F, i18n/RTL less turnkey); no-code Webflow/Spline
(not a real production replacement — weak i18n/RTL, unowned code, perf/SEO ceilings).

### Tech stack
- **Framework:** Next.js 15 App Router + TypeScript, deployed on Vercel
- **Styling:** Tailwind CSS + CSS variables for design tokens
- **3D:** React Three Fiber + `@react-three/drei` (+ postprocessing for lighting)
- **Scroll/motion:** GSAP ScrollTrigger + Lenis smooth scroll; Framer Motion for UI micro-interactions
- **i18n:** `next-intl` with locale routing `/en` `/de` `/ar` + `dir="rtl"` handling
- **Forms:** React Hook Form + Zod validation → Formspree endpoint
- **Analytics:** `@vercel/analytics` + custom events, gated behind cookie consent
- **Testing:** Vitest + Testing Library (unit/component), Playwright (E2E smoke)

## 4. Brand & visual system ("Obsidian Gallery")

- **Name/tagline kept:** *Granitopia — Utopia of Natural Stones.*
- **Palette:** obsidian `#0A0A0B`, charcoal `#141416`, ivory text `#F2EDE4`, **gold accent `#C9A961`**, muted stone-taupe secondaries.
- **Type:** display serif (Fraunces / Cormorant) for headlines; Inter for body/UI; IBM Plex Sans Arabic / Noto Naskh for Arabic.
- **Logo:** refined wordmark + optional "G" monogram (2 options proposed during build).
- **Motion:** slow, weighty, cinematic; gold hairline reveals; **respects `prefers-reduced-motion`**.

## 5. Sitemap (per-locale: `/en`, `/de`, `/ar`)

- **Home** — video hero → stats → featured stones (3D) → quarry-to-space scroll story → why-us → quote CTA → footer
- **Collections** index → collection pages: Granite · Marble · Monuments · Exotics · Sandstone/Limestone/Slate · Tiles & Cobbles
- **Stone detail** template — 3D slab viewer, finishes, specs, applications, "request this stone"
- **About** — heritage scroll story, 4 units, 38+ countries, vision/mission
- **Contact** — form + WhatsApp + offices/map
- **Quote** — multi-field enquiry form
- **Legal** — Privacy Policy, Impressum, Cookie notice

## 6. Signature experiences

- **A — Cinematic video hero:** full-bleed muted quarry→slab footage, **scroll-scrubbed**; static poster + reduced-motion fallback; lazy/adaptive sources.
- **B — Interactive 3D slab viewer:** R3F canvas, photoreal PBR slab (procedural material now, real scans later), orbit/zoom, **live finish swap** (polished/leathered/honed), lazy-mounted on scroll into view, **2D image fallback** when WebGL unavailable.
- **C — Scroll storytelling:** GSAP ScrollTrigger + Lenis; pinned **"quarry → factory → your space"** sections with parallax; **degrades to plain stacked sections** without JS/motion.

## 7. Module breakdown (isolated, testable units)

- `layout/` — Nav, Footer, LocaleSwitcher (+ RTL), skip-link
- `hero/VideoHero` — scroll-scrubbed video + fallbacks
- `three/SlabViewer` + `useStoneMaterial` — R3F canvas, finish swapping, WebGL guard
- `scroll/StoryScroller` — GSAP/Lenis pinned narrative
- `collections/` — CollectionGrid, StoneCard
- `stone/` — StoneDetail template
- `forms/` — QuoteForm, ContactForm (RHF + Zod + Formspree)
- `i18n/` — next-intl config, `messages/{en,de,ar}.json`, RTL utilities
- `data/stones.ts` — typed `Stone` catalog (slug, category, colors, finishes, specs, i18n keys)
- `analytics/` — Vercel Analytics + event helpers
- `consent/` — cookie banner gating analytics

## 8. Content & data model

Typed `Stone[]` drives collection + detail pages (no CMS in v1; structured TS data, CMS-ready later). Copy in
`messages/{en,de,ar}.json`. Placeholder stock imagery + procedural 3D now; `TODO(assets):` markers everywhere real
photos/video/scans must replace placeholders before go-live.

## 9. Performance

Route-level code splitting; **3D + video lazy-loaded, never blocking first paint**; `next/image` + adaptive video;
mobile gets lighter 3D / poster fallbacks. Targets: Lighthouse **perf ≥ 90**, SEO/best-practices/a11y **≥ 95**.

## 10. Accessibility & compliance

Public + EU/DE audience (German) + India entity → in scope:
- **WCAG 2.1 AA** — contrast, visible focus, full keyboard nav, alt text, reduced-motion, correct RTL.
- **OWASP** hygiene on all forms (validation, spam/honeypot, no injection surface).
- **GDPR** (EU/DE) — cookie consent gating analytics + full Privacy Policy + **Impressum (§5 DDG)**.
- **DPDP Act 2023** (India entity) — enquiry-data handling & notice.

Per global rule: build compliance in, run a **cert-readiness audit + independent re-audit AFTER the final build**,
then bring Pranav **one consolidated sign-off**. Use `TODO(legal):` sentinels for facts only Pranav can supply
(registration numbers, legal addresses, DPO/grievance contact). No irreversible/legal-fact content invented.

## 11. Testing strategy

- **Unit/component (Vitest + TL):** forms + validation, i18n rendering, RTL flip, `stones` data integrity, WebGL/reduced-motion guards.
- **E2E (Playwright):** each route × each locale loads; language + RTL switch; quote/contact submit (mocked); graceful degradation (no-JS, no-WebGL).

## 12. Build phases

1. **Foundation** — Next+TS+Tailwind, design tokens, i18n/RTL shell, layout (Nav/Footer/LocaleSwitcher)
2. **Home + signature experiences** — VideoHero (A), SlabViewer (B), StoryScroller (C)
3. **Collections + Stone detail** — grid, cards, detail template, `stones` data
4. **About / Contact / Quote** — forms (Formspree), analytics, consent
5. **Legal + compliance** — Privacy/Impressum/Cookie, a11y + cert-readiness audit + re-audit
6. **Performance pass** — Lighthouse tuning, lazy-load verification, mobile fallbacks
7. **localhost preview** — smoke-test, hand Pranav a localhost link for approval

## 13. Deployment (global rule — preview before production)

`npm run build` green → localhost smoke-test → **Pranav approves localhost link** → Vercel **preview** URL →
Pranav approves → **production**. Never straight to prod. Track: Git-integrated (Track A) if a Vercel-linked remote
exists, else Vercel CLI preview→prod (Track B).

## 14. Open items / risks

- **Real assets** (photos, quarry/slab video, slab scans) — placeholders until Pranav supplies; go-live blocker.
- **Translations** — DE/AR copy; machine draft now, human review recommended before go-live (`TODO(i18n-review):`).
- **`TODO(legal):`** — company registration facts, legal addresses, privacy/grievance contact for Impressum + DPDP.
- **3D mobile perf** — mitigated via lazy-mount, poster fallbacks, quality scaling.
- **Formspree account/endpoint** — needs Pranav's Formspree form ID (or a chosen alternative).
