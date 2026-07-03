"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RevealImage } from "@/components/ui/RevealImage";
import { MarbleTexture } from "@/components/visual/MarbleTexture";
import type { Stone } from "@/data/stones";

export function StoneCard({ stone, index = 0 }: { stone: Stone; index?: number }) {
  const t = useTranslations("Featured");

  return (
    <RevealImage delay={(index % 3) * 0.08}>
      <Link
        href={`/stones/${stone.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-line"
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
          <MarbleTexture hero={stone.heroColor} vein={stone.veinColor} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-copper">
              {t(`categories.${stone.category}`)}
            </p>
            <p className="mt-1 font-display text-xl text-white">{stone.name}</p>
          </div>
          <span className="text-white/70 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </RevealImage>
  );
}
