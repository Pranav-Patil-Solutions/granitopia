"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { featuredStones } from "@/data/stones";
import { Reveal } from "@/components/ui/Reveal";
import { StoneCard } from "@/components/collections/StoneCard";

export function FeaturedStones() {
  const t = useTranslations("Featured");

  return (
    <section id="featured" className="border-t border-line bg-paper px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                {t("eyebrow")}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-6xl">
                {t("title")}
              </h2>
              <p className="mt-4 max-w-md text-ink-soft">{t("subtitle")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/collections"
              className="inline-block border-b border-copper pb-1 text-sm uppercase tracking-widest text-copper transition-opacity hover:opacity-70"
            >
              {t("viewAll")}
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {featuredStones.map((stone, i) => (
            <StoneCard key={stone.slug} stone={stone} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
