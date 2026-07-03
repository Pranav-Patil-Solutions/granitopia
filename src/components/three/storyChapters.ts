/**
 * The five chapters of the Journey — the SINGLE place to edit the story.
 *
 * Each chapter pairs a copy key (→ messages `Story.chapters.<key>`) with a
 * camera keyframe and a full "mood" (background, fog, lighting, the stone's own
 * emissive glow, exposure, and how block-like vs slab-like it is). The 3D scene
 * interpolates between these as the user scrolls; the overlay reads the copy by
 * the same key. Reorder / retune here and both the film and the text follow.
 *
 * Camera x is mirrored in RTL (Arabic); the stone itself is never mirrored.
 */

export type ChapterMood = {
  key: string;
  /** camera position at this chapter's beat */
  cam: [number, number, number];
  /** scene background colour */
  bg: string;
  /** atmospheric depth (deep-earth murk → clear) */
  fog: { color: string; near: number; far: number };
  ambient: { color: string; intensity: number };
  light: { pos: [number, number, number]; color: string; intensity: number };
  /** the stone glowing from within (chapter 1) */
  emissive: { color: string; intensity: number };
  exposure: number;
  /** reflection strength of the baked studio env */
  env: number;
  /** mesh Z scale: ~7 = raw block, 1 = cut slab */
  depth: number;
  roughness: number;
  clearcoat: number;
  /** floating dust density 0..1 (peaks at the quarry) */
  dust: number;
};

export const STORY_STONE_SLUG = "brown-fantasy";

export const CHAPTERS: ChapterMood[] = [
  {
    // 1 · BORN OF THE EARTH — deep, geological, glowing from within
    key: "earth",
    cam: [-2.0, 0.6, 4.6],
    bg: "#0a0708",
    fog: { color: "#0a0708", near: 5, far: 15 },
    ambient: { color: "#2a1810", intensity: 0.14 },
    light: { pos: [3, 2, 4], color: "#ff7a2e", intensity: 0.55 },
    emissive: { color: "#ff5a12", intensity: 1.5 },
    exposure: 1.0,
    env: 0.28,
    depth: 7,
    roughness: 0.95,
    clearcoat: 0,
    dust: 0.15,
  },
  {
    // 2 · UNEARTHED — the quarry, first daylight, dust + scale
    key: "unearthed",
    cam: [-3.3, 2.4, 6.1],
    bg: "#39414c",
    fog: { color: "#39414c", near: 12, far: 34 },
    ambient: { color: "#b4c0cf", intensity: 0.6 },
    light: { pos: [5, 7, 4], color: "#fff2e0", intensity: 2.2 },
    emissive: { color: "#ff5a12", intensity: 0.08 },
    exposure: 1.05,
    env: 0.7,
    depth: 6,
    roughness: 0.9,
    clearcoat: 0,
    dust: 1.0,
  },
  {
    // 3 · THE CUT — sawn open, veining revealed, neutral studio
    key: "cut",
    cam: [2.7, 0.8, 5.0],
    bg: "#1b1a1e",
    fog: { color: "#1b1a1e", near: 20, far: 60 },
    ambient: { color: "#cccdd2", intensity: 0.5 },
    light: { pos: [3, 5, 6], color: "#ffffff", intensity: 2.4 },
    emissive: { color: "#000000", intensity: 0 },
    exposure: 1.1,
    env: 1.0,
    depth: 1,
    roughness: 0.5,
    clearcoat: 0.12,
    dust: 0.25,
  },
  {
    // 4 · THE CRAFT — human hands, warm studio, raw → mirror polish
    key: "craft",
    cam: [1.0, 0.25, 4.2],
    bg: "#17110d",
    fog: { color: "#17110d", near: 24, far: 70 },
    ambient: { color: "#dcc09a", intensity: 0.5 },
    light: { pos: [4, 4, 5], color: "#ffdca6", intensity: 2.2 },
    emissive: { color: "#000000", intensity: 0 },
    exposure: 1.08,
    env: 1.3,
    depth: 1,
    roughness: 0.12,
    clearcoat: 1,
    dust: 0.1,
  },
  {
    // 5 · THE HOME — warm, bright, resolved, at rest
    key: "home",
    cam: [0.0, 0.1, 4.0],
    bg: "#241a12",
    fog: { color: "#241a12", near: 30, far: 90 },
    ambient: { color: "#ffe6c4", intensity: 0.9 },
    light: { pos: [2, 3, 5], color: "#fff0d8", intensity: 2.0 },
    emissive: { color: "#000000", intensity: 0 },
    exposure: 1.12,
    env: 1.45,
    depth: 1,
    roughness: 0.08,
    clearcoat: 1,
    dust: 0,
  },
];

/** Copy keys in chapter order — used by the overlay + progress rail. */
export const CHAPTER_KEYS = CHAPTERS.map((c) => c.key);
