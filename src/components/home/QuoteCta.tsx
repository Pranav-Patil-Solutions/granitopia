"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import { getStone } from "@/data/stones";
import { WHATSAPP_URL } from "@/lib/contact";

export function QuoteCta() {
  const t = useTranslations("Cta");
  const stone = getStone("brown-fantasy");

  return (
    <section
      id="quote"
      className="relative overflow-hidden border-t border-line px-5 py-20 sm:px-8 md:py-32"
    >
      {stone && (
        <Image
          src={stone.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 38%, rgba(182,112,42,0.18), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-copper-bright">
            {t("eyebrow")}
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-white md:text-7xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/70 md:text-lg">
            {t("body")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-copper-deep px-8 text-sm font-medium uppercase tracking-widest text-white sm:w-auto"
              >
                {t("button")}
              </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/40 px-8 text-sm uppercase tracking-widest text-white sm:w-auto"
            >
              {t("whatsapp")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
