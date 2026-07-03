"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { featuredStones } from "@/data/stones";
import { MarbleTexture } from "@/components/visual/MarbleTexture";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Bento grid of signature stones — mixed-size tiles, one hero tile, macro
 * veining, name + one-line provenance, and a hover/focus caption. Each tile
 * links to its stone page. Renders fully without JS; hover/zoom are enhancement
 * and gated behind motion-safe.
 */
const SPANS = [
  "col-span-2 row-span-2", // 0 — hero tile (2×2)
  "col-span-2", // 1
  "col-span-1", // 2
  "col-span-1", // 3
  "col-span-2", // 4
  "col-span-2", // 5
];

export function SignatureShowcase() {
  const t = useTranslations("Featured");
  const slab = useTranslations("Slab");
  const stones = featuredStones;

  return (
    <section
      id="featured"
      className="border-t border-line bg-paper px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                {t("eyebrow")}
              </p>
              <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight text-ink md:text-6xl">
                {t("title")}
              </h2>
              <p className="mt-4 max-w-md text-ink-soft">{t("subtitle")}</p>
            </div>
            <Link
              href="/collections"
              className="shrink-0 border-b border-copper pb-1 text-sm uppercase tracking-widest text-copper transition-opacity hover:opacity-70"
            >
              {t("viewAll")} →
            </Link>
          </div>
        </Reveal>

        {/* Bento grid */}
        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-3 md:mt-16 md:auto-rows-[210px] md:grid-cols-4 md:gap-4">
          {stones.map((s, i) => {
            const origin = s.origin === "Imported" ? t("imported") : s.origin;
            return (
              <Reveal
                key={s.slug}
                delay={(i % 3) * 0.06}
                className={SPANS[i] ?? "col-span-2"}
              >
                <Link
                  href={`/stones/${s.slug}`}
                  className="group relative flex h-full flex-col justify-end overflow-hidden rounded-sm border border-line focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper-bright"
                >
                  {/* Macro veining (zooms on hover, motion-safe only) */}
                  <div className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-105">
                    <MarbleTexture hero={s.heroColor} vein={s.veinColor} />
                  </div>
                  {/* Legibility scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  {/* Content */}
                  <div className="relative z-10 p-5 md:p-6">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-copper-bright">
                      {t(`categories.${s.category}`)}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl leading-tight text-white md:text-3xl">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
                      {origin}
                    </p>
                    {/* Hover / focus caption */}
                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100">
                      <span className="overflow-hidden">
                        <span className="mt-3 inline-flex items-center gap-2 border-b border-copper-bright pb-0.5 text-[11px] uppercase tracking-widest text-copper-bright">
                          {slab("viewStone")} →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
