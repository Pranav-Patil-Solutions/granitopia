"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_URL } from "@/lib/contact";
import { useReducedMotion } from "@/lib/motion";

/**
 * Photographic hero. Phones and reduced-motion get the still; the film only
 * mounts on a wide, fine-pointer screen so mobile does not download it.
 */
export function VideoHero() {
  const t = useTranslations("Hero");
  const nav = useTranslations("Nav");
  const reduced = useReducedMotion();
  const [playFilm, setPlayFilm] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => {
      setPlayFilm(wide.matches && fine.matches && !reduced);
    };
    update();
    wide.addEventListener("change", update);
    fine.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      fine.removeEventListener("change", update);
    };
  }, [reduced]);

  return (
    <section
      id="top"
      className="relative flex min-h-[88svh] items-end overflow-hidden lg:min-h-[92svh]"
    >
      {playFilm ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/banners/banner.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/media/banners/banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />

      <div className="relative z-10 w-full px-5 pb-12 pt-16 sm:px-8 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.32em] text-copper-bright">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[2.75rem] leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">
            {t("titleLine1")}{" "}
            <span className="italic text-copper-bright">{t("titleAccent")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-copper-deep px-7 text-sm font-medium uppercase tracking-widest text-white"
            >
              {nav("quote")}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 text-sm uppercase tracking-widest text-white"
            >
              {nav("whatsapp")}
            </a>
            <Link
              href="/collections"
              className="inline-flex min-h-12 items-center justify-center px-2 text-sm uppercase tracking-widest text-white/80 sm:px-4"
            >
              {nav("collections")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
