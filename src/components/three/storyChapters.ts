/**
 * The five chapters of the Journey — the SINGLE place to edit the story.
 *
 * Each chapter pairs a copy key (→ messages `Story.chapters.<key>`) with a 4K
 * photograph. The scroll-driven film cross-fades these shots; the overlay reads
 * the matching copy by the same key. Reorder here and both follow.
 *
 * (Previously this drove an interactive 3D slab; that was replaced with grand,
 * "relatable" real photography — see STORY_IMAGES below.)
 */

/** Copy keys in chapter order — used by the overlay + progress rail. */
export const CHAPTER_KEYS = ["earth", "unearthed", "cut", "craft", "home"];

/**
 * Per-chapter 4K photography for the Journey.
 *
 * ── Engineered image brief (looped over every chapter) ──────────────────────
 *   "A cinematic, ultra-detailed 4K photograph for the '<kicker>' beat of a
 *    luxury natural-stone brand's origin story: <subject>. Grand, exotic and
 *    tactile; <mood> lighting that suits a dark, full-bleed gallery stage;
 *    rich texture, shallow depth, no text or logos. Subject must read as NATURAL
 *    STONE — reject any candidate showing metalwork, welding or grinding sparks."
 *
 * Verify each looped pick by eye before wiring it in: the 'craft' beat first
 * pulled a metal-cutting shot because the subject said 'sparks' — stone is
 * worked wet and dusty, so the brief now names dust, not sparks.
 *
 * Assets are self-hosted under /public/images/story (sourced as license-free
 * Pexels stock, ~2880px, q≈82). Swap for commissioned studio/quarry shots before
 * go-live — same slugs, same crop behaviour (object-cover), nothing else changes.
 */
// Alt text lives in messages `Story.chapters.<key>.alt` (translated per locale),
// not here — the comments below just record each shot's intended subject.
export type StoryImage = { src: string };

export const STORY_IMAGES: Record<string, StoryImage> = {
  // BORN OF THE EARTH — molten rock glowing from within (heat, pressure, origin)
  earth: { src: "/images/story/earth.jpg" },
  // UNEARTHED — a working marble quarry, first daylight, sheer scale
  unearthed: { src: "/images/story/unearthed.jpg" },
  // THE CUT — the block sawn open, veining revealed for the first time
  cut: { src: "/images/story/cut.jpg" },
  // THE CRAFT — brought to life by hand; a mason's dusty hand guiding the chisel
  // (stone is worked wet/dust, not sparks — a "sparks" brief pulls metalwork shots)
  craft: { src: "/images/story/craft.jpg" },
  // THE HOME — where it finally belongs, a grand marble interior at rest
  home: { src: "/images/story/home.jpg" },
};
