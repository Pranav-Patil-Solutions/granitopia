# Reference map

Observed in Chromium on 26 November 2026. Desktop viewport 1440×900, mobile 390×844. Screenshots live in `/opt/cursor/artifacts/reference/`. This is an inventory of patterns, not a copy of anyone’s words, pictures, or code.

Sites:

- MCM Stone Tailors — https://mcmstonetailors.com/en/
- BAS Stone — https://basstonenyc.com
- Stone and Style — https://stonestyle.co.th

## Palette measured

### BAS Stone (the field we are borrowing the feeling of)

Computed from their CSS variables and the Inquire button:

| Token | Value |
| --- | --- |
| Page | `#E5E5E2` |
| Ink | `rgb(22, 22, 1)` → `#161601` |
| Ink 50% | `rgba(22,22,1,.5)` |
| Ink 20% | `rgba(22,22,1,.2)` |
| Ink 10% | `rgba(22,22,1,.1)` |
| Raised grey | `#D3D3CF` |
| Raised 40% / 70% | `rgba(211,211,207,.4)` / `.7` |
| Inquire fill | `#161601` on `#E5E5E2` text |
| Button radius | `0` |
| Button transition | `background-color 0.25s, color 0.25s` |

No accent hue. The stone photograph is the only color.

### MCM Stone Tailors

| Role | Value |
| --- | --- |
| Home field | white (`#FFFFFF` in the cleared hero) |
| Stones chapter | black field, white type |
| Ink | `#000000` |
| Type on dark | `#FFFFFF` |
| Menu overlay | light grey veil; giant pale word |
| Cookie panel | black card, white “Accept all”, outlined “Decline all” |
| Logo | black square hairline, lowercase wordmark |
| Burger | two hairlines, top right; becomes an × |

### Stone and Style

| Role | Value |
| --- | --- |
| Intro | full black, white italic counter (`100`) and a thin vertical rule |
| After load | white field, black type, one black rectangle behind a cut-out stone |
| Scroll cue | solid black circle with a chevron |
| Nav | small black wordmark left, text links right |

## Type

| Site | Display | Body | Scale notes |
| --- | --- | --- | --- |
| BAS | Beautique Display Condensed, weight 300, tracking ~2.5px on the 127px hero | Jost, weight 300, 14px nav / buttons | Hero is one line, almost the full width. Product title ~37px, weight 300, tracking ~0.75px. |
| MCM | Roboto in the accessibility tree; the visible hero is a high-contrast modern serif, ~76px / 700, line ~87px. Section titles 80px weight 100, uppercase. Project names 40px / 300, uppercase. | Roboto 16px | Enormous stacked lines (“WE ARE” / “STONE TAILORS”). Tiny centered eyebrow “ESTABLISHED in 1982”. |
| Stone and Style | Oversized black serif cropped by the viewport (“BE TH…”) | Small sans for “Stone and Style” and the two-line tagline | Nav links are small, regular case, widely spaced. |

Granitopia equivalents already in the repo: Fraunces for the serif, Inter for the grotesque. No new webfont family is added, so phones do not download Beautique, Jost, Cormorant, or Roboto.

## Page structure

### BAS home

1. Thin top bar: wordmark, primary links, Visit / Contact / Favorites count.
2. Hero object: one stone photograph floating on the grey field, display headline behind it, italic “by BAS”, carousel arrows, `1 / 8`, material name, a short paragraph, underlined “Explore”.
3. Vertical “Scroll” label on the right edge.
4. Cookie card, bottom right, one dark button.

### BAS product (Allure)

1. Same bar.
2. Large square slab on the left with corner arrows.
3. Name, hairline spec rows (Type, Color), full-width Inquire, bookmark.
4. More images continue below the fold.

### MCM home

1. Fixed bar, logo left, hamburger right. No inline links.
2. Full-viewport type hero, then a vertical rule that implies scroll.
3. Later chapters: project list, stone categories on dark, contact paths.
4. Fullscreen menu: huge words (LEGACY and the rest), close ×, language pair EN/PT.

### MCM stones

Black chapter title “THE STONES” with a small centered kicker, then the catalog.

### Stone and Style

1. Black counted intro.
2. White page, logo and links, stone cut-out on a black block, giant cropped headline, round scroll button.

## Interaction inventory

| Element | Where it showed up | What it did |
| --- | --- | --- |
| Sticky / fixed header | MCM `position: fixed`, height ~113px, transparent. BAS bar stays at the top of the document. | MCM overlays the hero. BAS is in normal flow, hairline quiet. |
| Hide on scroll | Not clearly active in the first screen of any of the three. | Granitopia adds a hide-on-scroll-down / show-on-scroll-up bar so the photo can be full-bleed without losing the menu. |
| Fullscreen menu | MCM hamburger → grey overlay, giant nav words, ×. | Transform on the button `0.6s`. |
| Language switcher | MCM EN/PT in the menu and footer. Granitopia already has EN/DE/AR. | Text, not flags. |
| Mobile menu | MCM keeps the same overlay. BAS collapses to a compact bar (mobile shot: `reference/bass-mobile-top.png`). | Large type, full viewport, no tiny dropdown. |
| Preloader / intro | Stone and Style: black screen, counter to 100, vertical rule, then the page. | One shot per session. |
| Cursor | No custom cursor was required to use BAS or Stone and Style. MCM button uses a transform. | Granitopia keeps a fine-pointer dot and leaves touch devices on the system cursor. |
| Buttons | BAS Inquire: square, ink fill, stone-grey type, 0.25s color. MCM cookie: square, black/white. | No pills on the references. Granitopia moves primary actions to square ink buttons. |
| Link underlines | BAS “Explore” is an underline. Nav links are small caps-like tracking, no fill. | Underline grows on hover. |
| Image hover | Catalog and project cards zoom slightly. BAS product image is a slider, not a zoom-only card. | `scale(1.04)` over ~700ms, disabled when motion is reduced. |
| Image reveal | MCM and Stone and Style reveal type and image as you arrive. Stone and Style masks the stone on a black block. | Cards fade/rise once. Lightbox opens the same photograph larger. |
| Slider | BAS hero `1 / 8` with side arrows. Product page has corner arrows on the slab. MCM loads Swiper (`--swiper-theme-color`, nav size 44px). | Arrows at least 44px. Counter `n / total`. |
| Marquee | Not on the first screens. | Granitopia already has a category ticker; it stays, paused for reduced motion. |
| Accordion | Not primary on these homes. Specs on BAS are always-open rows. | Mission and vision on About use disclosure rows so the same content can collapse on a phone. |
| Tabs | BAS product is one surface with arrows, not tabs. | Finish list on a stone is a set of pressed chips (the finishes that stone actually has). |
| Filters | MCM stones are grouped (Natural, Precious, Terrazzo, Ceramics, Engineered). BAS collection is one material at a time. | Granitopia keeps search plus material and finish chips. |
| Search | Not in the first BAS/MCM heroes. | Name search stays on the catalog. |
| Pagination | BAS moves stone to stone inside the hero (`1 / 8`) rather than a numbered page list. | Catalog shows 12, then “Load more”. |
| Product card | MCM project cards: huge name, place, “about the project”. BAS: the slab is the card. | Photo, name, origin, quick view, and the detail link. |
| Quick view | BAS favorites is a save action, not a modal. | A dialog with the photo, name, origin, detail link, and quote. Esc and a close button. |
| Gallery / lightbox | BAS arrows swap the slab. | Clicking the stone photograph opens a dialog lightbox. |
| Sticky CTA | BAS Inquire is in the product column. | A quote bar sits in the thumb zone on viewports under 768px. |
| WhatsApp | Not on these three (they use Visit / Contact / Inquire). | Granitopia’s existing WhatsApp number stays as a round button and in the nav, hero, and form. |
| Forms | MCM cookie checkboxes. BAS cookie is one sentence and one button. | Quote form keeps labels, errors, focus, and server validation. Success is a status message. |
| Toast | Not seen. | The quote success status is a live region; it is the confirmation, not a second popup. |
| Modal | MCM cookie is a modal card. BAS cookie is a corner card. | Quick view and lightbox are dialogs. Cookie stays a corner card. |
| Breadcrumbs | Not on the BAS product hero. | Stone pages keep Collections / material / name. |
| Scroll progress | A thin vertical rule on MCM. “Scroll” written vertically on BAS. A round chevron on Stone and Style. | Existing top progress bar, plus a back-to-top control after you leave the hero. |
| Footer | MCM lists The Legacy, Expertise, Stones, Projects, News, Contacts, and languages. | Granitopia footer routes stay the ones from the earlier fix (home hashes, other pages go to real routes, Handelos link). |
| 404 | Not exercised on the references. | A locale 404 with links to collections and contact. |
| Empty state | A filter with no matches. | “No stones match” plus clear. |
| Loading | Stone and Style counter. Next/image blur on Granitopia photos. | Short counted intro once per session. |
| Page transition | Their sites are multi-page; motion is mostly in-page. | The App Router template fades the next page in 0.45s unless reduced motion is on. |
| Hover, touch | Arrows, Inquire, nav, and cards all have a hover color or zoom. | The same controls are 44px tall and do not depend on hover. Touch uses the click. |
| Keyboard | Buttons and links are real controls. | Dialogs close on Escape. Focus styles use a 2px ink outline. |

## Flows

- Browse → stone → quote: catalog card or quick view → stone page → “Request this stone” (stone name is already passed as a query) or WhatsApp.
- Thumb zone: on a phone the quote bar and WhatsApp sit at the bottom, above the cookie card. Filters are a horizontal scroller so the page itself does not scroll sideways.
- Focus order: skip to content is the header logo, then links, then the page. Menu traps attention by covering the page until it is closed.

## What Granitopia takes

The light stone field and the floating-slab hero come from BAS. The giant type, fullscreen menu, and black chapter come from MCM. The counted intro and the stone-on-a-dark-block come from Stone and Style. The bronze is Granitopia’s, because none of the three use a hue — buyers still need a single recognizable action color.
