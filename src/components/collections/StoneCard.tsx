"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RevealImage } from "@/components/ui/RevealImage";
import { MarbleTexture } from "@/components/visual/MarbleTexture";
import type { Stone } from "@/data/stones";

/**
 * Grid card for one stone. The surface is rendered from the stone's authentic
 * hero/vein colours via MarbleTexture — an honest, consistent stand-in until
 * licensed photography of each named commercial stone is shot (a generic stock
 * "black granite" would misrepresent a specific product like Black Galaxy).
 * Since the card lives inside its category, the eyebrow shows the stone's
 * origin rather than repeating the category.
 */
export function StoneCard({ stone, index = 0 }: { stone: Stone; index?: number }) {
  const st = useTranslations("Stones");
  const origin = st(`origins.${stone.origin}`);

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
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-copper-bright">
              {origin}
            </p>
            <p className="mt-1 font-display text-xl text-white">{stone.name}</p>
          </div>
          <span className="inline-block text-white/70 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
            →
          </span>
        </div>
      </Link>
    </RevealImage>
  );
}
