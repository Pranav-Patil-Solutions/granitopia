"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RevealImage } from "@/components/ui/RevealImage";
import {
  categoryImage,
  stonesInCategory,
  type StoneCategory,
} from "@/data/stones";

/**
 * Browse card for one of the six ranges. A real, on-brand stone photograph
 * (self-hosted under /public/images/categories) fills the frame with a dark
 * gradient so the name/blurb/CTA stay legible; a stone-count badge hints at the
 * depth of the range. Renders fully without JS — hover zoom is enhancement.
 */
export function CategoryCard({
  category,
  index = 0,
}: {
  category: StoneCategory;
  index?: number;
}) {
  const t = useTranslations("Featured");
  const c = useTranslations("Collections");
  const count = stonesInCategory(category).length;

  return (
    <RevealImage delay={(index % 3) * 0.08}>
      <Link
        href={`/collections/${category}`}
        className="group relative block aspect-[4/3] overflow-hidden rounded-sm border border-line"
      >
        <Image
          src={categoryImage(category)}
          alt={c(`categoryAlt.${category}`)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

        {/* Depth-of-range hint */}
        <span className="absolute end-4 top-4 rounded-full bg-black/30 px-3 py-1 text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-sm">
          {c("pieces", { count })}
        </span>

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="font-display text-2xl text-white md:text-3xl">
            {t(`categories.${category}`)}
          </h3>
          <p className="mt-1.5 max-w-xs text-sm text-white/75">
            {c(`categoryBlurbs.${category}`)}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-copper-bright">
            {c("viewCollection")}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </RevealImage>
  );
}
