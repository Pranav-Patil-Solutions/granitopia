"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { featuredStones } from "@/data/stones";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Static, responsive gallery of featured stones on a dark museum-stage
 * background. Replaces the former interactive 3D SlabShowcase — same section
 * framing (eyebrow / title, copper spotlight) with zero WebGL cost.
 */
export function StoneGallery() {
  const t = useTranslations("Gallery");

  return (
    <section
      id="gallery"
      className="relative overflow-hidden border-t border-white/10 px-5 py-16 sm:px-8 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, #241d1a 0%, #1a1512 58%, #141010 100%)",
      }}
    >
      {/* Soft museum spotlight behind the grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 30% 30%, rgba(182,112,42,0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-copper-bright">
                {t("eyebrow")}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
                {t("title")}
              </h2>
              <p className="mt-5 max-w-md text-white/70">{t("subtitle")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/collections"
              className="inline-block border-b border-copper-bright pb-1 text-sm uppercase tracking-widest text-copper-bright transition-opacity hover:opacity-70"
            >
              {t("viewAll")}
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredStones.map((stone, i) => (
            <Reveal key={stone.slug} delay={(i % 3) * 0.08}>
              <Link
                href={`/stones/${stone.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-white/10 bg-[#17120f]"
              >
                <Image
                  src={stone.image}
                  alt={stone.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-copper-bright">
                      {stone.origin}
                    </p>
                    <p className="mt-1 font-display text-xl text-white">
                      {stone.name}
                    </p>
                  </div>
                  <span className="text-white/70 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
