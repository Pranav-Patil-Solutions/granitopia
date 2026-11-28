import type { Finish } from "./stones";

/**
 * Finish photos for the hero chips.
 *
 * Loop: for each hero stone and each of polished / leathered / flamed, a chip
 * is shown only when this map has a file. The catalog ships one photo per
 * stone (`/images/stones/<slug>.jpg`), never `<slug>-<finish>.jpg`, so the
 * map stays empty and every chip stays hidden. Add a key when a real finish
 * photo lands — do not point a chip at the shared slab photo.
 */
export const heroFinishImages: Record<string, Partial<Record<Finish, string>>> = {};

export const HERO_CHIP_FINISHES = ["polished", "leathered", "flamed"] as const;

export type HeroChipFinish = (typeof HERO_CHIP_FINISHES)[number];

export function heroFinishSrc(slug: string, finish: Finish): string | undefined {
  return heroFinishImages[slug]?.[finish];
}
