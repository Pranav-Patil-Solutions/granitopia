# Granitopia — Master Design Prompt ("Best-Ever Stone Website")

> A single, portable, research-backed prompt for elevating the **Granitopia** natural-stone
> website to **Awwwards Site-of-the-Day quality**. Paste it (whole or in parts) into any
> design-capable LLM — Claude / Claude Code, v0, Lovable, Bolt, or Figma Make.
>
> **Purpose of this file:** it is the *brief*, not the build. It tells the model what to make
> and to what bar. It is grounded in the real Granitopia repo (so it **elevates**, never
> rebuilds) and in live research of premium/award-winning sites (every "best feature" below
> carries a real, citable source, gathered 2026-07-03).
>
> **Prepared:** 2026-07-03 · **Scope:** elevate existing build · **Do NOT** deploy without Pranav's approval.

---

## 0 · HOW TO USE THIS PROMPT (portability)

This is model-agnostic. Feed it per your tool:

| Tool | What to paste | Notes |
|---|---|---|
| **Claude / Claude Code** | The whole file. | It can read the repo directly — say *"elevate the existing Granitopia repo per this brief; do not rebuild."* Best for section-by-section execution. |
| **v0 (Vercel)** | §1, §2, §4, §5, §6 + the one §7 block for the component you're generating. | v0 works component-by-component. Drop repo file paths; keep the design system + the single section spec. Ask for React + Tailwind. |
| **Lovable / Bolt** | §1–§9 as the full-app brief. | Point it at the existing stack (§3) or let it scaffold; then paste §7 route-by-route. |
| **Figma Make** | §1, §2, §5, §6, §7. | It's visual-first — lead with the design system, motion feel, and section blueprints; it needs less of the engineering guardrails. |

**Golden rule for every tool:** *Restraint over spectacle.* The stone is the hero. Every
motion/3D/kinetic technique below appears **once or twice per page**, never everywhere. A
quiet-luxury stone brand earns its premium feel through space, typography, and real
photography — not effects. If a choice is between "more polish" and "more effects," choose polish.

---

## 1 · ROLE & MISSION

> You are an **award-winning creative director paired with a senior front-end engineer**.
> Your job is to elevate an existing, working natural-stone website — **Granitopia** — from
> "very good" to **best-in-class / Awwwards Site-of-the-Day**. You obsess over typography,
> whitespace, material photography, choreographed-but-restrained motion, performance, and
> accessibility in equal measure. You never add an effect that doesn't serve the stone.
>
> **Success = a juror on Awwwards would score it highly on Design, Creativity, Content, AND
> Usability** — and a luxury architect would trust it enough to specify Granitopia on a project.

---

## 2 · THE PRODUCT (brand context)

**Granitopia** is a premium natural-stone house — **granite, marble, exotics, sandstone,
monuments, and tiles** — sourced largely from Indian quarries (Karnataka, Rajasthan, Andhra,
Telangana) plus imported exotics, shipping to **38+ countries**. It is a *real* business; the
site is a marketing/e-commerce showcase, not a demo.

- **Audience (three mindsets):** (1) **Architects & interior designers** — want vein
  continuity, specs, provenance, application galleries; (2) **Fabricators & trade** —
  want finishes, thicknesses, availability, quotes; (3) **Luxury homeowners** — want to
  fall in love with a surface and picture it in their room.
- **Tone:** *material-first, editorial, quiet luxury.* Museum-lit, not showroom-loud.
  Confident and spare. The copy treats stone as a curated masterpiece of nature, not a commodity.
- **Positioning line already in use:** **"Stone, perfected."**
- **Reference brands** (aspire to their restraint & craft, avoid their corporate sprawl):
  Antolini, Salvatori, Cosentino, Neolith, Caesarstone, SapienStone, Lapicida, Serafini,
  Maison Valentina. Two literal stone-industry award sites to study directly:
  **Marvell Tile & Stone** and **The Quarry House** (both Awwwards SOTD).
- **Real catalog to design around** (already in the repo): Absolute Black, Black Galaxy,
  Tan Brown, Alaska Gold (granite); Brown Fantasy, Rainforest Green (marble); Crystallo
  Divine, Patagonia (exotics); Mint Sandstone; Mahogany (monuments); Tandur Grey (tiles).
  Each stone has: origin, finishes (polished/leathered/honed/flamed), thickness options,
  applications, and a blurb.

---

## 3 · WHAT ALREADY EXISTS — ELEVATE, DON'T REBUILD

This is the single most important constraint. **Keep the stack and the working features.
Refine, deepen, and complete them to award quality — do not start over.**

**Stack (locked — build within it):**
- **Next.js 16.2 (App Router) · React 19 · TypeScript**
- **Tailwind CSS v4** (`@theme` token layer in `src/app/globals.css`)
- **next-intl 4** — i18n **en / de / ar**, locale-prefixed routes (`/en /de /ar`), **Arabic is RTL**
- **Framer Motion 12 · GSAP 3 · Lenis 1.3** (smooth scroll)
- **React Three Fiber 9 + drei 10 + three 0.185** — the WebGL slab viewer
- **Zod 4 + react-hook-form 7** (contact/quote form) · **@vercel/analytics**
- **Vitest + Playwright** (unit + e2e smoke)
- **No Supabase / no DB** — this is a marketing site; the contact/quote flow posts to a form endpoint.

**Design tokens already defined** (`globals.css`, light "gallery" scheme — keep this direction):
- Surfaces: `--color-paper #ffffff`, `--color-paper-2 #f6f3ee` (warm off-white), `--color-dark #3e3333` (warm brand dark)
- Ink: `--color-ink #2c2c2c`, `--color-ink-soft #6a6a6a`, `--color-line #e4e0d9` (warm hairline)
- Accents: `--color-copper #b6702a`, `--color-copper-deep #965a20`, `--color-gold #d19a20`
- Type: `--font-display` = **Fraunces** (serif), `--font-body` = **Inter**, `--font-arabic` = **IBM Plex Arabic**
- Motion: `--ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1)`

**Home section order (real, in `src/app/[locale]/page.tsx`):**
`VideoHero → Stats → Marquee → SlabShowcase (3D) → StoryScroller → SignatureShowcase → QuoteCta`

**Routes:** `/` · `/collections` · `/collections/[category]` · `/stones/[slug]` · `/about` · `/contact`

**Award-tier FX already built** (in `src/components/fx/*` and elsewhere — polish, don't replace):
Preloader/curtain reveal · custom spring cursor · magnetic CTAs · kinetic headline
("Stone, perfected.") · scroll-progress bar · infinite marquee · scroll-pinned horizontal
gallery · animated counters · `Reveal` / `RevealImage` · Lenis smooth scroll · R3F slab viewer.

**Open items to close as part of this elevation** (from the repo's own studio notes):
migrate hex tokens → **OKLCH**; complete **WCAG/GDPR/DPDP** audit + legal pages; swap
low-res site thumbnails for **hi-res studio shots + scanned PBR textures**; wire the real
form endpoint (Formspree ID); **human DE/AR translation review**.

---

## 4 · THE BEST-FEATURES MATRIX (researched · cited · marked "adopt")

These are the specific premium patterns to adopt, distilled from award galleries (Awwwards,
Orpetron, Land-book), the Vercel/Next.js showcase, and the actual sites of luxury stone
brands. Each entry: **what to do → why it's premium → source → the discipline that keeps it
tasteful.** Use them at 1–2 moments per page.

### 4A · Experience, motion & interaction

| Adopt | Why premium | Source | Granitopia application & discipline |
|---|---|---|---|
| **Scroll-driven material narrative** (quarry block → cut slab → polished surface) | Turns a product page into an experiential journey; Awwwards jurors praised this "commercial → experiential" leap. | [The Quarry House — Awwwards SOTD](https://www.awwwards.com/sites/the-quarry-house-1) | Make it the **StoryScroller**: trace one signature stone from rockface → saw → finished countertop, anchored to real photos. Keep a visible skip/jump-to-content control. |
| **Full-bleed macro slab photography as the whole visual language** | A restrained 2-tone canvas + huge uncluttered material shots let the stone carry the luxury signal, not decoration. | [Marvell Tile & Stone — Awwwards SOTD](https://www.awwwards.com/sites/marvell-tile-stone) · [Antolini](https://www.antolini.com) | Every collection/stone page opens on a large-format macro of veining. Serve via `next/image` AVIF/WebP or CWV tanks. |
| **Horizontal "gallery-walk" scroll** | Reframes scrolling as *walking a showroom* — a recurring luxury SOTD pattern. | [Awwwards — Horizontal Layout collection](https://www.awwwards.com/awwwards_collections/collections/horizontal-layout-websites/) | Keep/refine the pinned **HorizontalStones** track as a "quarry-yard walk," one slab per panel. Remap to vertical on mobile; honor reduced-motion. |
| **Custom cursor as a tactile signature** (a "loupe") | A morphing cursor turns passive browsing into hands-on material inspection — a top interactive-studio hallmark. | [OHZI Interactive — Awwwards](https://www.awwwards.com/sites/ohzi-interactive) | Evolve the existing spring cursor into a **stone loupe** that magnifies grain on slab hover; chisel/arrow over CTAs. Desktop `pointer:fine` only; never hide focus rings. |
| **Real-time WebGL slab viewer** | Photoreal, rotatable 3D separates a *showcase* from a catalog; the technique luxury brands use for hero products. | [Solsea by Rossinavi — Awwwards](https://www.awwwards.com/sites/solsea) | Deepen the R3F **SlabViewer**: rotate a sample, toggle finish (polished/honed/leathered/flamed), see vein continuity under 2–3 lighting presets. **Lazy-load, code-split, static-image fallback.** |
| **GSAP scroll-triggered reveals + parallax depth** | Choreographed, physically-plausible motion is the signature separating award sites from templates. | [Awwwards — Best GSAP sites](https://www.awwwards.com/websites/gsap/) | Layered parallax on the process/story page (foreground slab · midground tools · background rockface). `transform`/`opacity` only — never animate layout; test on mid-range Android. |
| **Seamless page transitions** (View Transitions API) | Removing the white-flash reload makes a multi-page site feel like one continuous app. | [Stone Age — Awwwards Honorable Mention](https://www.awwwards.com/sites/stone-age) | Morph the tapped slab thumbnail into the next page's hero image between routes. Keep under ~400ms; never break back-button, deep-linking, or scroll restoration. |
| **Kinetic typography — hero-only** | A strong first-impression signature; 2026 practice confines it to hero/section dividers, never body copy. | [Awwwards — Typography collection](https://www.awwwards.com/awwwards/collections/typography-in-web-design/) | Keep "Stone, perfected." assembling letter-by-letter; optionally one "cut/fracture" reveal per section divider. No CLS; honor reduced-motion. |
| **Variable fonts** for expressive, lightweight type | One file replaces many weights; enables fluid optical-size/weight without payload bloat. | [WriterDock — UI trends 2026](https://writerdock.in/blog/bento-grids-and-beyond-7-ui-trends-dominating-web-design-2026) | Fraunces is already variable — exploit optical sizing + a subtle weight shift on large display headings. Audit that the variable file actually loads lighter than the static weights. |
| **Sectional dark "gallery-lit" bands** (not a full dark flip) | Dark grounds make saturated stone (black granite, gold veining, travertine) pop and read museum-lit. | [Endschema — Dark-mode premium, 2026](https://www.endschema.com/dark-mode-premium-ecommerce-design-2026/) | Keep the site's intentional **light** gallery scheme; use `--color-dark #3e3333` for 1–2 contrast bands (the 3D viewer backdrop, the story climax) so slabs glow. Verify **AA contrast** on dark. |

### 4B · Brand, content & commerce (the luxury-stone category vocabulary)

| Adopt | Why premium | Source | Granitopia application |
|---|---|---|---|
| **"Perfect imperfection" copy** — natural variation *as* the luxury | Reframes veining variability as couture vs. "mass-produced" engineered quartz. | [Antolini — Haute Nature](https://www.antolini.com/en/haute-nature) | Lead the About/philosophy with copy that celebrates asymmetry and one-of-a-kind veining, explicitly vs. uniform engineered surfaces. |
| **Curator-not-supplier / provenance storytelling** | "Sole access to the quarries," origin-as-rarity — provenance is the luxury signal. | [Antolini — Exclusive Collection](https://www.antolini.com/en/c3/exclusive-collection) · [Lapicida](https://www.lapicida.com) | Give each stone a short **origin story card** (where it's quarried, why it's rare) beside the spec sheet — the repo already stores `origin`. |
| **Branded, evocatively-named stones** (not SKUs) | Turns a commodity slab into a proprietary product line, like a fashion SKU. | [Antolini](https://www.antolini.com) · [Lapicida — Samarcanda/Silk Road](https://www.lapicida.com) | Keep names like *Crystallo Divine*, *Patagonia*, *Rainforest Green* front-and-center; give signature slabs a ® feel and a one-line story. |
| **Designer / maker credit per collection** | Attributing collections to a named designer imports design-world credibility. | [Salvatori](https://www.salvatoriofficial.com/) · [SapienStone](https://www.sapienstone.com) · [Serafini](https://www.serafini.com/) | Optionally attribute a "signature" collection to a named architect/designer partner + a short design story. Use only if real — never fabricate (see §9). |
| **Room / application-first entry** (alongside material browsing) | Sells a lifestyle outcome first, material second. | [Neolith](https://www.neolith.com) · [Lapicida — Shop by Room](https://www.lapicida.com) | Add an application lens (Kitchens · Bathrooms · Flooring · Façade · Monuments) as a secondary browse path over the existing category nav — the repo already stores `applications`. |
| **"See it in your space" tooling** (visualizer / AR / compare) | Concrete decision-support reads premium because it reduces buyer risk. | [Cosentino Visualizer](https://visualizer.cosentino.com/) · [Caesarstone](https://www.caesarstone.com) | Even a **lightweight** compare-up-to-3-slabs, or a swap-the-surface room mockup, as a headline feature — not buried. Progressive enhancement; works without it. |
| **Restrained neutral palette + one metallic accent** | Neutral UI + a single brass/copper pop signals "expensive" without shouting. | [Maison Valentina](https://www.maisonvalentina.net/en/) | Exactly the repo's model already: paper/ink neutral + **copper/gold** for CTAs and premium badges. Hold that line; don't add a second accent. |
| **Editorial / authority content stream** | "Design Stories," trend reports, a journal position the brand as an authority, not a vendor. | [Salvatori — Design Stories](https://www.salvatoriofficial.com/) · [Neolith](https://www.neolith.com) | Add a light **Journal / Stone Stories** section (2–4 editorial pieces) on material, craft, and application. |
| **Gallery-vs-factory duality** | Two entry points for two buyer mindsets: aspirational showroom vs. how-it's-made craft. | [Serafini — Milan gallery vs. Vicenza factory](https://www.serafini.com/) | Split content into an aspirational "showroom" experience and a craft/"from quarry to finish" process story (folds into the §4A material-narrative scroll). |
| **Physical showroom / dealer locator** | Signals a real, tangible business behind the pixels — a trust anchor. | [Lapicida](https://www.lapicida.com) · [Cosentino City](https://www.cosentino.com/usa/professional/cosentino-city/) | Add a minimal showroom/where-to-buy block on Contact/About. Use real addresses only — `TODO(legal):` placeholder until confirmed. |
| **Performance-first execution is the real premium bar** | Award visuals mean nothing slow; Vercel's showcase leads with hard perf numbers. | [Next.js Showcase](https://nextjs.org/showcase) | Non-negotiable: `next/image` for all slabs, ISR/prerender the catalog, keep WebGL route-isolated + code-split. **Core Web Vitals are a hard gate.** |

**Patterns to AVOID** (seen across the category, do not copy): heavy multi-tier mega-menus &
regional site-selectors (Cosentino/Caesarstone corporate sprawl); discount-forward language
in nav ("Special Prices") that undercuts luxury; celebrity/lifestyle case studies without
material specificity; and — per Granitopia's own history — **no full-page WebGL hero** (a 3D
hero broke production on a sibling build; keep 3D inside an isolated, lazy, fallback-guarded viewer).

---

## 5 · DESIGN SYSTEM (tech-agnostic)

**Typography formula** — one editorial serif + one clean sans + a tracked label face:
- **Display / headlines:** Fraunces (variable serif) — exploit optical sizing; italic used
  *sparingly* as a single accent phrase per headline, never a whole heading.
- **Body / UI:** Inter — comfortable measure (≈60–72ch), generous line-height.
- **Eyebrows / labels / specs:** uppercase, letter-spaced (~0.2–0.3em), small — mono or Inter.
- **Arabic:** IBM Plex Arabic for RTL body; verify the display serif has an acceptable Arabic
  fallback or swap to a suitable Arabic display face.
- Tighten large-heading tracking (~`-0.02em`), enable ligatures/`dlig`, `font-optical-sizing: auto`.

**Color formula** — light "gallery" scheme (keep it; let stone supply the color):
- Migrate the current hex tokens to **OKLCH** (perceptually uniform; the repo flags this as open).
  Keep the same identities: paper white, warm off-white `paper-2`, warm dark `#3e3333`, ink
  `#2c2c2c` / soft `#6a6a6a`, warm hairline `line`, and the **copper/gold** accent family.
- **One accent only** (copper→gold). No second hue. Metallic accent reserved for CTAs,
  active states, premium badges, hairline dividers.
- **Contrast-audit every pairing to WCAG AA** and record the ratio in a comment (the sibling
  builds do this — e.g. darken an accent until body text passes). Especially on the dark bands.

**Spacing & layout:**
- Generous whitespace is a luxury signal — err larger. Big top/bottom section padding.
- A consistent modular scale; align to a clear grid; wide gutters.
- **Bento grid** for the homepage "material index" (mixed-size tiles, one hero tile per
  collection) — must reflow to a single clean column on mobile without breaking reading order.
  Source: [Land-book — Architecture](https://land-book.com/?industry=architecture).

**Imagery treatment:**
- Full-bleed, high-resolution macro stone photography is the primary content. **Local, owned,
  hi-res** assets (replace the low-res thumbnails); AVIF/WebP via `next/image`; every hero
  image/video has a poster/LQIP so there's no flash.
- Consistent art direction: museum lighting, true-to-life stone color, minimal props.
- `prefers-reduced-motion` → any hero video swaps to its poster still.

---

## 6 · MOTION VOCABULARY (choreographed, restrained)

Define these once and reuse them everywhere — consistency *is* the polish.

- **One signature easing curve**, reused for essentially all entrances: the repo's
  `--ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1)` (or the equivalent luxury curve
  `[0.16, 1, 0.3, 1]`). One curve = one "hand."
- **One `<Reveal>` primitive:** fade + short rise (16–24px) + optional **blur-to-sharp**,
  triggered `whileInView` with `once: true`. Everything on-scroll uses it. Content is fully
  visible without JS.
- **Hero:** parallax (background scales/translates slower than foreground; foreground rises +
  fades; a darkening scrim layers on as you scroll out). Or a **Ken-Burns settle** (one-time
  `scale 1.08→1` over ~1.8s, *not* an infinite loop) for banner stills.
- **Momentum scroll (Lenis):** duration ~1.0–1.2 ("the luxury range"); **drive Lenis off the
  animation library's own rAF/frame loop** — never run two independent rAF loops (they fight
  and jank).
- **Micro-interactions (1–2 per page):** magnetic CTA (button pulls toward cursor, springs
  back); underline-grows-from-left link hover; copper scroll-progress bar (spring over scroll
  progress); optional **self-drawing SVG "seam" line** that traces down the page as you scroll
  (a stone-seam motif via `stroke-dashoffset`).
- **Counters** (Stats): count-up on view, but **initialize state at the real final value** so
  SSR / no-JS / failed hydration always show the correct number — the animation is pure enhancement.
- **Reduced-motion is total:** `prefers-reduced-motion: reduce` disables preloader, cursor,
  magnetic, marquee, counters, horizontal-scroll pinning, parallax — with full content parity.

---

## 7 · SECTION-BY-SECTION BLUEPRINT (elevate each surface)

For each, the instruction is *elevate the existing component to the bar in §4–§6* — not replace.

**Home** (`VideoHero → Stats → Marquee → SlabShowcase → StoryScroller → SignatureShowcase → QuoteCta`)
1. **VideoHero** — real muted looping quarry/slab footage with poster-first (no black flash) +
   parallax + the kinetic "Stone, perfected." headline + magnetic primary CTA ("Request a
   quote") and a quiet secondary ("Explore the collection"). Scroll cue at the base.
2. **Stats** — count-up on view, seeded at final value; "38+ countries," years, stones,
   projects. Copper accent numerals, restrained.
3. **Marquee** — infinite band of collections + "38+ countries," pause-on-hover; a credibility
   ribbon, not a toy. Reduced-motion → static.
4. **SlabShowcase (3D)** — the hero technical moment: a **dark gallery-lit band** with the R3F
   slab viewer (rotate, finish toggle, lighting presets). Lazy + code-split + static fallback.
5. **StoryScroller** — the **material narrative** (§4A): quarry block → cut → polished, one
   signature stone, real photography, parallax layers, a skip control.
6. **SignatureShowcase** — a **bento grid** of signature named stones (Crystallo Divine,
   Patagonia, Black Galaxy…), each tile a macro + name + one-line origin story; hover reveals
   a caption; click → page-transition into the stone page.
7. **QuoteCta** — full-bleed dark or macro-backed band; single strong magnetic CTA to `/contact`;
   the price stance is quote-based, never discount-y.

**`/collections`** — bento/editorial index of the six categories (granite, marble, exotics,
sandstone, monuments, tiles), each a large macro tile. Add a secondary **application lens**
(Kitchens/Bath/Flooring/Façade/Monuments).

**`/collections/[category]`** — full-bleed category hero + a refined grid of stones with
finish/thickness chips; consistent `StoneCard` with hover macro-zoom + copper caption slide-up.

**`/stones/[slug]`** — the money page: large-format macro hero → the **3D slab viewer** (finish
+ lighting) → **origin story card** (provenance) → spec block (finishes, thickness,
applications) → "pairs well with" related stones → quote CTA. Optional compare-up-to-3.

**`/about`** — lead with **"perfect imperfection"** philosophy (§4B) + the **gallery-vs-factory**
craft story + heritage/reach stat + real showroom locator (`TODO(legal):` addresses).

**`/contact`** — the Zod + react-hook-form quote form, elevated: clear fields, real inline
validation, WhatsApp/tel quick-contact, honest success state; wire the real endpoint (Formspree
ID). Never a fake "message sent" without a real submission.

**(New, optional) `/journal`** — a light editorial **Stone Stories** stream (2–4 pieces) for
authority content.

**Global chrome** — a refined sticky nav (transparent over hero → solid on scroll), locale
switcher (en/de/ar with correct RTL flip for Arabic), footer with the copper hairline system,
cookie consent + analytics gate already present.

---

## 8 · COPY & CONTENT DIRECTION

- **Voice:** spare, confident, editorial. Short lines. Let the stone and the whitespace breathe.
- **Reframe variation as luxury:** natural veining is one-of-a-kind, not a defect (Antolini's
  "perfect imperfection"). Contrast quietly with uniform engineered surfaces.
- **Provenance first:** name the quarry/region; tell the origin story; make rarity felt.
- **Name the stones like products,** not codes; give signature slabs a one-line story.
- **Honesty (hard rule):** no invented testimonials, client logos, numbers, awards, or designer
  credits. No discount theatre (no strikethroughs, %-off, countdowns, "Most Popular"). The
  quote is the quote. If a fact isn't confirmed (address, VAT, a real partnership), leave a
  `TODO(legal):` / `TODO(content):` sentinel — do not fabricate.
- **All three locales** (en/de/ar) get real copy; flag machine-translated DE/AR for human review.

---

## 9 · NON-NEGOTIABLE GUARDRAILS

These are gates, not preferences. The build is not "done" until all pass.

1. **Reduced-motion parity** — `prefers-reduced-motion: reduce` disables *all* motion (preloader,
   cursor, magnetic, marquee, counters, horizontal pinning, parallax, video) with full content parity.
2. **Works without JS** — content is server-rendered and visible; motion/3D are enhancement only.
3. **Accessibility — WCAG 2.1 AA** — semantic landmarks; visible focus rings (never hidden by the
   custom cursor); keyboard-operable nav, gallery, and viewer; alt text on every stone image;
   AA contrast on light *and* the dark bands; `lang`/`dir` correct per locale.
4. **Performance — hard gate** — `next/image` (AVIF/WebP) for all photography; ISR/prerender the
   catalog; WebGL route-isolated + code-split + lazy; target **Lighthouse mobile ≥ 90** and healthy
   **LCP/INP/CLS**. Motion must never cost CWV.
5. **i18n correctness** — en/de/ar; Arabic **RTL** verified (layout mirrors, not just text);
   no hard-coded strings.
6. **Honesty & legal** — no fabricated proof or legal facts; `TODO(legal):` for Impressum/privacy/
   address/VAT; GDPR (EU audience) + DPDP (India) considerations noted for the compliance pass.
7. **WebGL safety** — never a full-page WebGL hero; the 3D viewer is always isolated, lazy, and
   falls back to a static image.
8. **No regressions** — existing routes, tests (Vitest/Playwright smoke), i18n, and the 3D
   canvases must still build and pass. `npm run build` must stay green.

---

## 10 · ELEVATE-NOT-REBUILD CONSTRAINTS (recap)

- Keep the stack in §3 exactly. Do not swap frameworks, add a DB, or introduce a new UI kit.
- Refine existing components in place; add new ones only where §7 calls for them (journal,
  compare, application lens).
- Reuse the existing token names, the `Reveal` primitive, the motion helpers
  (`useReducedMotion`), and the R3F viewer — extend, don't fork.
- Every change ships behind the deploy discipline: **build green → localhost preview → Pranav
  approves → Vercel preview → approval → prod.** Never straight to production.

---

## 11 · ACCEPTANCE BAR ("best-ever" done-checklist — self-verify)

The target model should confirm each before declaring done:

- [ ] A juror could plausibly score this **Awwwards SOTD** on Design, Creativity, Content, Usability.
- [ ] The **stone is the hero** on every page (macro photography + whitespace lead; effects are 1–2/page).
- [ ] One consistent **easing + `Reveal`** vocabulary throughout; Lenis on a single rAF loop.
- [ ] The **3D slab viewer** rotates, toggles finish + lighting, lazy-loads, and has a static fallback.
- [ ] **Material-narrative** scroll + **bento** signature grid + **horizontal** gallery each present, each restrained.
- [ ] **Provenance/origin story** + **named stones** + **perfect-imperfection** copy are live.
- [ ] **OKLCH** tokens; **one** accent; **AA contrast** verified (light + dark bands).
- [ ] **Reduced-motion** disables everything; site works with **JS off**; keyboard + screen-reader pass.
- [ ] **Lighthouse mobile ≥ 90**; all slabs via `next/image`; catalog prerendered; WebGL isolated.
- [ ] **en/de/ar** all real; **Arabic RTL** mirrors correctly.
- [ ] **No fabricated** proof/legal facts; `TODO(legal):` sentinels where unknown.
- [ ] `npm run build` green; existing tests pass; **no deploy without approval.**

---

## 12 · SOURCES (verified 2026-07-03)

**Award galleries & technical bar**
- The Quarry House — Awwwards SOTD: https://www.awwwards.com/sites/the-quarry-house-1
- Marvell Tile & Stone — Awwwards SOTD: https://www.awwwards.com/sites/marvell-tile-stone
- Stone Age — Awwwards Honorable Mention: https://www.awwwards.com/sites/stone-age
- Solsea by Rossinavi — Awwwards: https://www.awwwards.com/sites/solsea
- OHZI Interactive — Awwwards: https://www.awwwards.com/sites/ohzi-interactive
- Awwwards — Horizontal Layout collection: https://www.awwwards.com/awwwards_collections/collections/horizontal-layout-websites/
- Awwwards — Typography collection: https://www.awwwards.com/awwwards/collections/typography-in-web-design/
- Awwwards — Best GSAP sites: https://www.awwwards.com/websites/gsap/
- Land-book — Architecture: https://land-book.com/?industry=architecture
- Next.js Showcase: https://nextjs.org/showcase
- WriterDock — UI trends 2026: https://writerdock.in/blog/bento-grids-and-beyond-7-ui-trends-dominating-web-design-2026
- Endschema — Dark-mode premium 2026: https://www.endschema.com/dark-mode-premium-ecommerce-design-2026/

**Luxury stone / surface brands**
- Antolini — Haute Nature: https://www.antolini.com/en/haute-nature · Exclusive Collection: https://www.antolini.com/en/c3/exclusive-collection
- Salvatori: https://www.salvatoriofficial.com/
- Cosentino Visualizer: https://visualizer.cosentino.com/ · Cosentino City: https://www.cosentino.com/usa/professional/cosentino-city/
- Neolith: https://www.neolith.com
- Caesarstone: https://www.caesarstone.com
- SapienStone: https://www.sapienstone.com
- Lapicida: https://www.lapicida.com
- Serafini (Marmi Serafini): https://www.serafini.com/
- Maison Valentina: https://www.maisonvalentina.net/en/

---

*End of master prompt. Deliverable = this brief only; the site is not built or deployed here.*
