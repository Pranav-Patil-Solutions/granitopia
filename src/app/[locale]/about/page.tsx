import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stats } from "@/components/home/Stats";
import { QuoteCta } from "@/components/home/QuoteCta";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: `${t("eyebrow")} — Granitopia` };
}

/**
 * The quarry-to-container journey — the SINGLE place to edit the three scale
 * beats. Each step pairs an existing About copy paragraph (p1/p2/p3) with one
 * on-brand photograph documenting real scale, and localized label/title/alt.
 *
 * ── Engineered image brief (looped over every step) ─────────────────────────
 *   "A grand, tactile 4K photograph for the '<step>' beat of a premium natural-
 *    stone exporter's story: <subject>. Real industrial scale, natural palette
 *    (stone whites/greys/warm browns) with warm light; no text/logos baked in."
 *
 * Assets self-hosted under /public/images/about (license-free Pexels stock,
 * 2880px, q≈82). Swap for commissioned quarry/factory shots before go-live —
 * same slugs, same crop behaviour (object-cover), nothing else changes.
 */
const STEPS = [
  { key: "quarry", body: "p1", image: "/images/about/quarry.jpg" },
  { key: "manufacturing", body: "p2", image: "/images/about/manufacturing.jpg" },
  { key: "export", body: "p3", image: "/images/about/export.jpg" },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Lead statement */}
      <section className="bg-paper px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-display text-2xl leading-relaxed text-ink md:text-3xl">
              {t("lead")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Quarry-to-container journey — alternating image/text rows */}
      <section className="border-t border-line bg-paper-2 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">
              {t("journey.eyebrow")}
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-ink md:text-6xl">
              {t("journey.title")}
            </h2>
          </Reveal>

          <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
            {STEPS.map((step, i) => {
              const flip = i % 2 === 1; // alternate the image side on desktop
              return (
                <div
                  key={step.key}
                  className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
                >
                  <RevealImage className={flip ? "md:order-2" : undefined}>
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
                      <Image
                        src={step.image}
                        alt={t(`steps.${step.key}.alt`)}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>
                  </RevealImage>
                  <Reveal delay={0.05}>
                    <p className="text-xs uppercase tracking-[0.3em] text-copper">
                      {t(`steps.${step.key}.label`)}
                    </p>
                    <h3 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
                      {t(`steps.${step.key}.title`)}
                    </h3>
                    <p className="mt-5 max-w-md text-ink-soft">
                      {t(step.body)}
                    </p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="border-t border-line bg-paper px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="border-t-2 border-copper pt-6">
              <h2 className="text-xs uppercase tracking-[0.3em] text-copper">
                {t("missionTitle")}
              </h2>
              <p className="mt-4 font-display text-xl leading-relaxed text-ink md:text-2xl">
                {t("missionBody")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="border-t-2 border-copper pt-6">
              <h2 className="text-xs uppercase tracking-[0.3em] text-copper">
                {t("visionTitle")}
              </h2>
              <p className="mt-4 font-display text-xl leading-relaxed text-ink md:text-2xl">
                {t("visionBody")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Stats />
      <QuoteCta />
    </main>
  );
}
