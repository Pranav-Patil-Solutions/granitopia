"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Stone } from "@/data/stones";

/** Gallery card: the real slab photo, then the name and origin beneath it. */
export function StoneCard({
  stone,
  index = 0,
}: {
  stone: Stone;
  index?: number;
}) {
  const st = useTranslations("Stones");
  const origin = st(`origins.${stone.origin}`);

  return (
    <Link href={`/stones/${stone.slug}`} className="group block min-w-0">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-paper-2"
        style={{ backgroundColor: stone.heroColor }}
      >
        <Image
          src={stone.image}
          alt={stone.name}
          fill
          priority={index < 4}
          quality={72}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="font-display text-xl leading-tight text-ink sm:text-2xl">
          {stone.name}
        </p>
        <span
          aria-hidden
          className="text-ink-soft transition-transform duration-300 motion-safe:group-hover:translate-x-1 rtl:-scale-x-100"
        >
          →
        </span>
      </div>
      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-soft">
        {origin}
      </p>
    </Link>
  );
}
