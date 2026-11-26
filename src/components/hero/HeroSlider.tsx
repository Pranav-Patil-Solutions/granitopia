"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { featuredStones } from "@/data/stones";
import { WHATSAPP_URL } from "@/lib/contact";
import { useReducedMotion } from "@/lib/motion";

/**
 * Floating-slab hero. One featured stone at a time, with arrows and a counter.
 * The pattern is the BAS object-on-field hero; the stones and words are ours.
 */
export function HeroSlider() {
  const t = useTranslations("Hero");
  const nav = useTranslations("Nav");
  const feat = useTranslations("Featured");
  const stonesT = useTranslations("Stones");
  const slab = useTranslations("Slab");
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const total = featuredStones.length;
  const stone = featuredStones[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  function step(dir: number) {
    setIndex((i) => (i + dir + total) % total);
  }

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-[1600px] items-end gap-6 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20 lg:pt-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-ink-soft">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[2.6rem] font-medium leading-[0.92] tracking-tight text-ink sm:text-6xl lg:text-8xl">
            {t("titleLine1")}{" "}
            <span className="italic">{t("titleAccent")}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={{ pathname: "/contact", query: { stone: stone.slug } }}
              className="inline-flex min-h-12 items-center justify-center bg-ink px-7 text-xs uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-copper-deep"
            >
              {nav("quote")}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center border border-ink px-7 text-xs uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              {nav("whatsapp")}
            </a>
          </div>
        </div>

        <div className="relative">
          <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-ink-soft">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <Link
            href={`/stones/${stone.slug}`}
            className="group relative block aspect-[5/4] overflow-hidden bg-paper-2"
          >
            <Image
              key={stone.slug}
              src={stone.image}
              alt={stone.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className={`object-cover ${reduced ? "" : "transition-transform duration-700 group-hover:scale-[1.04]"}`}
              style={{ backgroundColor: stone.heroColor }}
            />
          </Link>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-copper">
                {feat(`categories.${stone.category}`)}
              </p>
              <p className="mt-1 font-display text-3xl text-ink">{stone.name}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {stonesT(`origins.${stone.origin}`)}
              </p>
            </div>
            <Link href={`/stones/${stone.slug}`} className="link-draw text-sm text-ink">
              {slab("viewStone")}
            </Link>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t("scrollCue")}
              className="inline-flex h-11 w-11 items-center justify-center border border-line text-lg transition-colors hover:border-ink"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t("scrollCue")}
              className="inline-flex h-11 w-11 items-center justify-center border border-line text-lg transition-colors hover:border-ink"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
