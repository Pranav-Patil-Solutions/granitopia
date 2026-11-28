"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getStone, type Finish, type Stone } from "@/data/stones";
import { HERO_CHIP_FINISHES, heroFinishSrc } from "@/data/heroFinishes";
import { WHATSAPP_URL } from "@/lib/contact";
import { useReducedMotion } from "@/lib/motion";
import { useHeroStage } from "@/components/hero/useHeroStage";

/** Rich slabs only. Absolute Black is a flat field and stays out of this reel. */
const HERO_SLUGS = [
  "rainforest-green",
  "patagonia",
  "fusion-gold",
  "alaska-gold",
  "brown-fantasy",
] as const;

const SLIDES = HERO_SLUGS.map((slug) => getStone(slug)!);
const INTERVAL = 6500;

function finishChips(stone: Stone) {
  return HERO_CHIP_FINISHES.flatMap((finish) => {
    if (!stone.finishes.includes(finish)) return [];
    const src = heroFinishSrc(stone.slug, finish);
    return src ? [{ finish, src }] : [];
  });
}

/**
 * Full-bleed stone hero.
 * Entrance waits for the preloader curtain, then reveals the headline with a
 * clip. Slides crossfade and Ken-Burns unless reduced motion is on.
 * Pointer tilt, the sheen, and finish chips are transform/opacity only.
 */
export function HeroSlider() {
  const t = useTranslations("Hero");
  const nav = useTranslations("Nav");
  const stats = useTranslations("Stats");
  const feat = useTranslations("Featured");
  const stonesT = useTranslations("Stones");
  const detail = useTranslations("StoneDetail");
  const slab = useTranslations("Slab");
  const locale = useLocale();
  const rtl = locale === "ar";
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [finish, setFinish] = useState<Finish | null>(null);
  const indexRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;
  const stone = SLIDES[index];
  const chips = finishChips(stone);
  const finishSrc = finish ? heroFinishSrc(stone.slug, finish) : undefined;

  useHeroStage(sectionRef, stageRef, !reduced);

  const go = useCallback((dir: number) => {
    const next = (indexRef.current + dir + total) % total;
    setLeaving(indexRef.current);
    indexRef.current = next;
    setIndex(next);
    setFinish(null);
  }, [total]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => go(1), INTERVAL);
    return () => window.clearInterval(id);
  }, [reduced, paused, go, index]);

  function onKey(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") go(rtl ? -1 : 1);
    if (event.key === "ArrowLeft") go(rtl ? 1 : -1);
  }

  const facts = [
    { value: stats("countries"), label: stats("countriesLabel") },
    { value: stats("containers"), label: stats("containersLabel") },
    { value: stats("units"), label: stats("unitsLabel") },
    { value: t("exportPlace"), label: t("exportFrom") },
  ];

  const specRows = [
    { label: detail("originLabel"), value: stonesT(`origins.${stone.origin}`) },
    {
      label: detail("finishesLabel"),
      value: stone.finishes.map((item) => slab(`finishes.${item}`)).join(", "),
    },
    { label: detail("thicknessLabel"), value: stone.thickness },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-white md:min-h-[calc(100svh-4.5rem)]"
      aria-roledescription="carousel"
      aria-label={t("eyebrow")}
      data-finish-chips={chips.length}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div ref={stageRef} className="absolute -inset-[5%] will-change-transform">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          const upcoming = (index + 1) % total;
          const keep = active || i === leaving || i === upcoming;
          if (!keep) return null;
          return (
            <div
              key={slide.slug}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active ? "opacity-100" : "opacity-0"
              } ${active && !reduced ? "hero-ken" : ""}`}
              aria-hidden={!active}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                quality={72}
                sizes="100vw"
                className="object-cover"
                style={{ backgroundColor: slide.heroColor }}
              />
              {active && finishSrc && (
                <Image
                  key={finishSrc}
                  src={finishSrc}
                  alt=""
                  fill
                  quality={72}
                  sizes="100vw"
                  className="hero-finish-in object-cover"
                />
              )}
            </div>
          );
        })}
        <div key={index} aria-hidden className="hero-sheen" />
      </div>

      {/* Bottom scrim carries the type on every slide. A left wash (right in RTL)
          keeps the small caps off the busiest part of a bright slab. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,7,5,0.45)_0%,rgba(8,7,5,0.18)_42%,rgba(8,7,5,0.08)_100%)]" />

      <div className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-28 pt-8 sm:px-8 md:min-h-[calc(100svh-4.5rem)] md:px-10 md:pb-14 lg:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 start-0 top-0 z-0 w-full md:top-[12%] md:w-[68%]"
          style={{
            background:
              "linear-gradient(to top, rgba(8,7,5,0.92) 0%, rgba(8,7,5,0.86) 55%, rgba(8,7,5,0.74) 100%)",
          }}
        />
        <div className="relative z-10 md:pe-80">
          <p className="sr-only" aria-live="polite">
            {stone.name}
            {finish ? `, ${slab(`finishes.${finish}`)}` : ""}
          </p>
          <p className="hero-line hero-d1 hero-ink text-[13px] font-medium uppercase tracking-[0.18em]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-5xl font-display text-[3.1rem] font-medium leading-[0.9] tracking-tight text-white sm:text-7xl md:max-w-[calc(100%-19rem)] lg:text-8xl">
            <span className="hero-line hero-d2 block">{t("titleLine1")}</span>
            <span className="hero-line hero-d3 hero-ink block italic">{t("titleAccent")}</span>
          </h1>

          <div className="mt-4 w-full max-w-sm md:absolute md:end-0 md:top-0 md:mt-0 md:w-80">
          <aside
            key={stone.slug}
            className="hero-spec border border-white/40 bg-[rgba(230,227,222,0.94)] p-3 text-ink shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-4"
          >
            <p className="font-display text-lg leading-none md:text-2xl">{stone.name}</p>
            <dl className="mt-2 space-y-1 md:mt-3 md:space-y-2">
              {specRows.map((row) => (
                <div key={row.label} className="border-t border-line/80 pt-1 md:pt-2">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft md:text-[11px]">{row.label}</dt>
                  <dd className="text-[13px] leading-snug text-ink md:text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/stones/${stone.slug}`}
              className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-ink link-draw md:mt-3"
            >
              {slab("viewStone")}
            </Link>
          </aside>
          </div>

          <p className="hero-line hero-d4 hero-ink mt-3 max-w-xl text-[15px] font-medium leading-snug sm:mt-4 sm:text-lg sm:leading-relaxed">
            {t("subtitle")}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-x-8">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="hero-ink text-xs font-medium uppercase tracking-[0.14em]">{fact.label}</dt>
                <dd className="hero-ink mt-1 font-display text-xl sm:text-2xl">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {/* CERTIFICATION SLOT: render CE / ISO badges here only after the
              mark exists in site content. Nothing is shown until then. */}

          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={slab("finishLabel")}>
              {chips.map((chip) => {
                const selected = finish === chip.finish;
                return (
                  <button
                    key={chip.finish}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFinish(selected ? null : chip.finish)}
                    className={`inline-flex min-h-11 items-center px-4 text-xs font-medium uppercase tracking-[0.14em] ${
                      selected
                        ? "bg-white text-ink"
                        : "border border-white/80 bg-black/45 text-white"
                    }`}
                  >
                    {slab(`finishes.${chip.finish}`)}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href={{ pathname: "/contact", query: { stone: stone.slug } }}
              className="inline-flex min-h-12 items-center justify-center bg-white px-3 text-center text-[11px] font-medium uppercase leading-tight tracking-[0.12em] text-ink transition-colors duration-300 hover:bg-copper-bright sm:px-7 sm:text-xs sm:tracking-[0.16em]"
            >
              {t("quote24h")}
            </Link>
            <Link
              href="/collections"
              className="inline-flex min-h-12 items-center justify-center border border-white/80 bg-black/45 px-3 text-center text-[11px] font-medium uppercase leading-tight tracking-[0.12em] text-white transition-colors duration-300 hover:bg-white hover:text-ink sm:px-7 sm:text-xs sm:tracking-[0.16em]"
            >
              {t("catalogue")}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 hidden min-h-11 items-center justify-center text-[11px] font-medium uppercase tracking-[0.14em] text-white sm:col-auto sm:inline-flex sm:min-h-12 sm:px-2 sm:text-xs"
            >
              {nav("whatsapp")}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="hero-ink text-xs font-medium uppercase tracking-[0.16em]">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              <span className="mx-3 text-white/40">·</span>
              {stonesT(`origins.${stone.origin}`)}
            </p>
            <div className="h-px w-24 overflow-hidden bg-white/25" aria-hidden>
              <div key={`${index}-${paused}`} className={reduced || paused ? "h-full w-full bg-copper-bright" : "hero-progress h-full w-full bg-copper-bright"} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label={t("prev")} className="inline-flex h-11 w-11 items-center justify-center border border-white/50 text-lg text-white hover:bg-white hover:text-ink">
                <span className={rtl ? "inline-block rotate-180" : ""}>‹</span>
              </button>
              <button type="button" onClick={() => go(1)} aria-label={t("next")} className="inline-flex h-11 w-11 items-center justify-center border border-white/50 text-lg text-white hover:bg-white hover:text-ink">
                <span className={rtl ? "inline-block rotate-180" : ""}>›</span>
              </button>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  aria-pressed={paused}
                  className="inline-flex h-11 items-center border border-white/50 px-4 text-[11px] uppercase tracking-[0.18em] text-white hover:bg-white hover:text-ink"
                >
                  {paused ? t("play") : t("pause")}
                </button>
              )}
            </div>
            <a href="#featured" className="hero-ink ms-auto hidden items-center gap-3 bg-[rgba(8,7,5,0.72)] px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] md:inline-flex md:me-28">
              <span className="hero-cue block h-8 w-px bg-white/70" />
              {t("scrollCue")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
