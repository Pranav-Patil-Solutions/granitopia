"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RevealImage } from "@/components/ui/RevealImage";
import type { Stone } from "@/data/stones";

/**
 * Grid card for one stone — its real product photo (imported from granitopia.com,
 * self-hosted under /public/images/stones) over a dark gradient so the name/
 * origin stay legible. The card sits inside its category, so the eyebrow shows
 * the stone's origin rather than repeating the category. The heroColor backs the
 * frame as a loading tint. (The large full-bleed macro band on the detail page
 * still uses the resolution-independent MarbleTexture — the ~380px source photo
 * only holds up at card scale.)
 */
export function StoneCard({ stone, index = 0 }: { stone: Stone; index?: number }) {
  const st = useTranslations("Stones");
  const origin = st(`origins.${stone.origin}`);

  return (
    <RevealImage delay={(index % 3) * 0.08}>
      <Link
        href={`/stones/${stone.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-line"
        style={{ backgroundColor: stone.heroColor }}
      >
        <Image
          src={stone.image}
          alt={stone.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
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
