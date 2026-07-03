"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RevealImage } from "@/components/ui/RevealImage";
import { MarbleTexture } from "@/components/visual/MarbleTexture";
import {
  categoryHeroColor,
  categoryVeinColor,
  type StoneCategory,
} from "@/data/stones";

export function CategoryCard({
  category,
  index = 0,
}: {
  category: StoneCategory;
  index?: number;
}) {
  const t = useTranslations("Featured");
  const c = useTranslations("Collections");

  return (
    <RevealImage delay={(index % 3) * 0.08}>
      <Link
        href={`/collections/${category}`}
        className="group relative block aspect-[4/3] overflow-hidden rounded-sm border border-line"
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          <MarbleTexture
            hero={categoryHeroColor(category)}
            vein={categoryVeinColor(category)}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="font-display text-2xl text-white">
            {t(`categories.${category}`)}
          </h3>
          <p className="mt-1 max-w-xs text-sm text-white/75">
            {c(`categoryBlurbs.${category}`)}
          </p>
          <span className="mt-3 text-xs uppercase tracking-widest text-copper">
            {c("viewCollection")} →
          </span>
        </div>
      </Link>
    </RevealImage>
  );
}
