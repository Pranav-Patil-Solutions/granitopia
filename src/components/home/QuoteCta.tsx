"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/fx/Magnetic";
import { MarbleTexture } from "@/components/visual/MarbleTexture";
import { getStone } from "@/data/stones";
import { WHATSAPP_URL } from "@/lib/contact";

export function QuoteCta() {
  const t = useTranslations("Cta");
  const stone = getStone("brown-fantasy");

  return (
    <section
      id="quote"
      className="relative overflow-hidden border-t border-white/10 px-6 py-28 md:py-40"
    >
      {/* Full-bleed macro stone backdrop + dark scrim */}
      {stone && <MarbleTexture hero={stone.heroColor} vein={stone.veinColor} />}
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
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-copper-deep px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition-transform hover:scale-105"
              >
                {t("button")}
              </Link>
            </Magnetic>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 px-8 py-3.5 text-sm uppercase tracking-widest text-white/80 transition-colors hover:border-copper-bright hover:text-copper-bright"
            >
              {t("whatsapp")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
