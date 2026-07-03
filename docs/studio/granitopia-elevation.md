# Granitopia — "Studio" Elevation Pass

**Date:** 2026-07-02 · **Mode:** The Studio (best-in-class UI/UX reform) · **Status:** localhost preview, awaiting approval (NOT deployed)

## Phase 0 — References (best-in-class, combined)

- **Luxury stone brands:** Antolini, Salvatori, Cosentino — cinematic, editorial, material-first; generous whitespace; the stone is the hero.
- **Award-winning immersive (Awwwards / Orpetron):** preloader reveal, custom cursor, magnetic CTAs, kinetic typography, horizontal-scroll galleries, buttery scroll, WebGL 3D.

We already had buttery scroll (Lenis), WebGL 3D (R3F slab), scroll storytelling and real photography/video. This pass adds the remaining award-tier layer.

## What changed (design decisions)

| Pattern | Implementation | Why |
|---|---|---|
| **Preloader** | Brand curtain reveal (wordmark + copper progress line), once/session, reduced-motion-aware | Sets a premium first impression (Antolini/Awwwards) |
| **Custom cursor** | Dot + spring-follow ring that grows over interactive elements; desktop `pointer:fine` only | Signature award-site interactivity, tasteful |
| **Magnetic CTAs** | Hero buttons pull toward the cursor | Strengthens CTAs, adds craft |
| **Kinetic headline** | "Stone, perfected." word-by-word clip-rise on load | Kinetic typography trend, editorial drama |
| **Scroll progress** | Thin copper top bar (spring) | Orientation + polish |
| **Marquee** | Infinite band of collections + "38+ countries", pause-on-hover | Motion + credibility, luxury-retail staple |
| **Horizontal gallery** | Featured collections as scroll-driven horizontal track (pinned) | Award-tier signature; fallback = native horizontal scroll under reduced motion |
| **Animated counters** | Stats count up on scroll into view | Brings the numbers to life |
| **Type refinement** | Tighter display tracking, optical sizing, ligatures | Editorial finish |

All effects **respect `prefers-reduced-motion`** (preloader/cursor/magnetic/marquee/counters/horizontal-scroll all degrade gracefully).

## Verification (evidence)

- `npm run build`: **PASS** — 63 static pages ×3 locales + dynamic contact.
- Headless smoke (`tests/e2e/smoke.mjs`): **PASS** — hero video present, home + detail 3D canvases mount (real photo textures), real images load, contact form renders, Arabic `dir=rtl`, **0 client console errors**.

## Rubric scorecard (Studio §2)

- ✅ Semantic token system (brand palette), type scale, spacing, motion, reduced-motion.
- ✅ Interactive states, purposeful motion, real microcopy, responsive, next/image, code-split, server-first pages.
- ⚠️ Open: OKLCH token migration (currently hex brand tokens), full dark-mode parity (site is intentionally light), legal pages + WCAG/GDPR/DPDP audit, hi-res/own assets, Formspree ID, DE/AR human translation review.

---

## Pass 2 — Home flagship, deep (2026-07-03)

**Mode:** The Studio · **Scope chosen by Pranav:** "Home flagship, deep" (not the foundations/OKLCH slice, not audit-only). One deep pass over the seven home sections to the master-prompt §4/§7 bar. **Status:** localhost preview (`next start` :3010), awaiting approval — NOT deployed.

### What changed (section by section)

| Section | Change | Brief ref |
|---|---|---|
| **VideoHero** | Flat 55% wash → layered gradient scrim (lets footage breathe at edges, lifts contrast behind the headline) + scroll-driven veil. Film modal made accessible: Escape-to-close, focus trap, focus return, scroll-lock, labelled dialog. Primary CTA → `copper-deep` (AA). | §6, §9 a11y |
| **Stats** | `tabular-nums` so count-up no longer jitters width. | polish |
| **Marquee** | Soft edge-fade mask (`.marquee-mask`) — items emerge/vanish instead of hard-clipping. | polish |
| **SlabShowcase (3D)** | Moved onto a **dark, museum-lit band** (deep warm gradient + copper spotlight). Added **3 lighting presets** (Gallery / Showroom / Evening) wired to per-preset R3F light rigs + canvas backdrop. Labelled Finish + Lighting groups. Default stone → **Alaska Gold** (a black slab reads as a void on a dark stage; a warm veiny stone glows). `autoRotate` disabled under reduced motion. Controls restyled for dark + AA. | §4A dark bands, lighting presets |
| **StoryScroller** | Added the brief-required visible **"Skip the story ↓"** jump-to-content control (also an a11y win). | §4A |
| **SignatureShowcase** | Replaced the scroll-pinned cinematic with a **bento grid + provenance** (Pranav's pick): mixed-size tiles, macro veining, name + one-line origin story per tile, hover/focus caption, click → stone page. Reflows to one column on mobile. Adds the provenance layer the home lacked and removes a third stacked scroll-pin. | §4B provenance, §5 bento, §7 |
| **QuoteCta** | Light panel → **full-bleed macro-stone-backed dark band** (Brown Fantasy + scrim) with a **magnetic** primary CTA; WhatsApp kept as a subordinate secondary. | §7 |

### New tokens / copy
- `--color-copper-deep` reused for filled buttons (white text 5.5:1 AA); added `--color-copper-bright #d98b45` for accents on dark bands (6:1 AA).
- Copy added in **all three locales**: `Slab.finishLabel`, `Slab.lightingLabel`, `Slab.lighting.{gallery,showroom,evening}`, `Story.skip`, `Featured.origin`, `Featured.imported`.

### Verification (evidence)
- `npm run build`: **PASS** — compiled, TypeScript clean, 66 static pages ×3 locales.
- Headless smoke (`BASE=…:3010 node tests/e2e/smoke.mjs`): **PASS** — hero video, home + detail 3D canvases mount, 6 bento marble tiles + 6 stone links, contact form, Arabic `dir=rtl`, **0 client console errors**.
- Reduced-motion / no-JS: SSR HTML carries all 7 sections, 6 bento stone links, provenance origins, the skip control and lighting labels — motion/3D are enhancement only.
- Visual: screenshots of hero, dark slab band (all 3 presets), bento (desktop + mobile), CTA — all read premium and stone-first.

### AA contrast
- New dark bands + filled buttons audited to WCAG AA (copper-deep 5.5:1, copper-bright 6:1, white on scrim > 4.5:1).
- **Known / deferred (foundations slice):** on-light eyebrows still use `text-copper` (~3.9:1) matching the existing site convention — belongs to the site-wide AA audit + OKLCH migration, not this pass.

### Deliberately out of scope this pass
OKLCH token migration, legal/WCAG/GDPR/DPDP audit + legal pages, hi-res asset swaps, Formspree wiring, DE/AR human translation review, surfacing the existing HorizontalStones "quarry-walk" on the home. (All tracked as the other slices.)

---

## Pass 3 — Photoreal slab + cinematic "Journey of a Slab" (2026-07-03)

**Mode:** The Studio · **Scope:** rebuild the two 3D-heavy sections to awwwards-tier realism + motion. **Status:** localhost preview (`next start` :3010), awaiting approval — NOT deployed.

### 1 · Photoreal 3D slab (`SlabViewer` + `StoneMaterial` + `StudioEnvironment`)
- **PBR material rebuilt** (`StoneMaterial.tsx`): crisp procedural albedo + a **real normal map** (Sobel-derived from a height field of the same veining, so grain reads as depth, not a decal) + a **finish-driven roughness map**. Seeded RNG → each stone veins deterministically. Maps generate once per stone; the finish selector only morphs surface params (cheap).
- **Finishes:** polished = low roughness + `clearcoat` 1 (wet sheen); honed/leathered = anisotropy; flamed = rough. **Translucent** stones (Crystallo Divine) use `transmission`/`thickness` for subsurface light bleed.
- **Studio HDRI** (`StudioEnvironment.tsx`): procedural `<Environment>` + `<Lightformer>` softboxes (warm key, cool fill, top wash) **+ a copper lightformer so reflections pick up the brand metal**. **CSP-safe / offline — no CDN HDRI fetch.**
- **ACES filmic tone mapping** + per-preset exposure; **ContactShadows** (soft contact shadow); real edge thickness; slow auto-rotate (off under reduced motion).
- **Post** (`@react-three/postprocessing`, NEW dep): subtle **Bloom + SSAO + DoF**, gated to capable desktops only (`isHighPerfDevice()`), off on mobile + reduced-motion.

### 2 · "Journey of a Slab" — scroll-driven cinematic (`StoryScroller` + `StorySlab`)
- Replaced the basic image cross-fades with a **pinned, scroll-driven 3D film**: ONE slab transforms in place across **5 stages** (Quarry → Block → Cut → Polish → Showroom) — camera dollies/orbits, the stone morphs **block → thin slab** (Z-scale) and **raw → honed → polished** (roughness/clearcoat), all driven by a Framer `scrollYProgress` MotionValue read in `useFrame` with **damped momentum** (never a hard cut).
- Copy reveals with **masked (clip-path) + staggered** motion; **slim copper progress rail** tracks the 5 stages; header + skip-to-content control.
- **RTL (Arabic):** mirrors the horizontal camera motion + text side + rail side — **not** the stone itself.
- **Reduced-motion / mobile / no-JS:** static **stacked, museum-light** fallback with all 5 stages fully readable (SSR-rendered) — 3D never mounts.

### Honest asset note (`TODO(assets)`)
The repo has **no real 4K photography and no scanned PBR maps** (stone images are 12–44 KB thumbnails) — so the "real albedo/normal/roughness maps of the stone" and "4K background" are delivered as **procedurally-derived PBR** now, structured to **auto-upgrade** the moment real maps land in `/public/images/stones/<slug>/` and a 4K quarry image in `/public/media/`. Same as the repo's standing asset TODO.

### New copy / deps
- `Story.stages.{quarry,block,cut,polish,showroom}.{title,body}` in **all three locales** (replaces the old 3 chapters).
- Added dep: `@react-three/postprocessing@3.0.4` + `postprocessing@6.39.2` (peer-compatible with R3F 9 / React 19 / three 0.185).

### Verification (evidence)
- `npm run build`: **PASS** — 66 static pages ×3 locales.
- Smoke (`tests/e2e/smoke.mjs`): **PASS, 0 client errors** (home upgraded slab canvas mounts, bento, detail, contact, Arabic RTL).
- `#story` cinematic: **0 console errors**; block→slab morph + camera dolly + copper rail + masked reveals visually confirmed across scroll positions.
- Reduced-motion: `#story` mounts **0 canvas**, shows **5 stacked stages**, **0 errors**. SSR carries all 5 stages (no-JS parity).
- AA: dark cinematic uses `copper-bright` accents + white text (audited in Pass 2).

### Notes for tuning (real-GPU)
Post-processing renders ~25s/frame under headless software GL only — a test artifact, not real-GPU perf. Procedural veining reads as etched depth; the biggest realism jump will come from dropping in **real scanned maps** (the asset TODO). Bloom/DoF strengths are conservative; easy to dial.

---

## Pass 4 — "The Journey" reframed as a five-chapter STORY (2026-07-03)

**Mode:** The Studio · **Scope:** rebuild the Journey section from a "slab changing finish" demo into a cinematic *narrative* — where the stone comes from and what it becomes. **Status:** localhost preview (`next start` :3010), awaiting approval — NOT deployed.

### The five chapters (single source of truth: `three/storyChapters.ts`)
Each chapter = a copy key + a camera keyframe + a full **mood** (background, fog, lighting, the stone's own emissive glow, exposure, block-vs-slab, roughness/clearcoat, dust). The 3D scene **interpolates the whole environment** between chapters as you scroll — not just the material.
1. **Born of the earth** — near-black, deep fog, the stone **glows from within** (emissive + bloom). Copy: time & origin.
2. **Unearthed** — cool quarry daylight, brighter, **drifting dust** peaks here, the raw block at scale.
3. **The cut** — neutral studio; the block becomes a thin slab (Z-scale morph), veining revealed; camera orbits across.
4. **The craft** — warm studio; raw → honed → deep clearcoat **polish**.
5. **The home** — warm, bright, resolved; front hero framing.

### How it works
- **Pinned scroll-driven film** (`three/StorySlab.tsx`): one R3F canvas, the SAME stone travels all five chapters. Camera dolly/orbit, background+fog+lights+emissive+exposure all lerped (smoothstep) from a damped scroll-progress MotionValue read in `useFrame` → momentum, never a hard cut. Drifting dust `<points>` field fades in at the quarry.
- **Narrative overlay** (`scroll/StoryScroller.tsx`): per chapter a **kicker · headline · body** with **masked (clip-path) + staggered** reveals; slim **copper 1–5 progress rail**; header + skip control; top/bottom legibility gradients that survive the mood shifts.
- **Copy** = short poetic headline + one emotional line per chapter, brand-voice (no spec sheets), in **all three locales**.
- **RTL:** mirrors camera x + text side + rail side — **not** the stone.
- **Reduced-motion / mobile / no-JS:** static **stacked museum-light** scenes with all five chapters fully readable (SSR-rendered), 3D never mounts.
- **Photoreal throughout:** PBR `MeshPhysicalMaterial` (albedo + Sobel normal + roughness maps), clearcoat, transmission-ready, procedural CSP-safe studio HDRI, ACES, contact shadows, gated **Bloom + SSAO + DoF**. No GLTF/Draco model — the slab is procedural box geometry (nothing to compress/preload beyond chapter-1 state); canvas is lazy (dynamic import, in-view mount).

### Honest asset note (unchanged `TODO(assets)`)
Still no real 4K photography / scanned PBR maps / stone GLTF in the repo — realism is procedurally derived and auto-upgrades when real maps drop into `/public/images/stones/<slug>/`.

### Verification
- `npm run build`: **PASS**.
- SSR: all 5 chapter headlines in raw HTML (no-JS parity).
- Reduced-motion: `#story` mounts **0 canvas**, shows **5 stacked chapters**, **0 errors**.
- Cinematic: visual capture of all 5 chapters (mood/lighting/camera transforms + ch-1 inner glow) + console-error check — see run notes.

## Guardrail

STOP at localhost preview. No production deploy without Pranav's approval. No invented legal facts.
