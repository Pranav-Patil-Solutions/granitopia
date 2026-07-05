import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getStone, stones, stonesInCategory } from "@/data/stones";
import { StoneViewer } from "@/components/stone/StoneViewer";
import { StoneCard } from "@/components/collections/StoneCard";
import { MarbleTexture } from "@/components/visual/MarbleTexture";
import { WHATSAPP_URL } from "@/lib/contact";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    stones.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const stone = getStone(slug);
  return { title: stone ? `${stone.name} — Granitopia` : "Granitopia" };
}

export default async function StonePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const stone = getStone(slug);
  if (!stone) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("StoneDetail");
  const cat = await getTranslations("Featured");
  const slab = await getTranslations("Slab");
  const nav = await getTranslations("Nav");
  const st = await getTranslations("Stones");
  const related = stonesInCategory(stone.category).filter(
    (s) => s.slug !== stone.slug,
  );

  const specs = [
    { label: t("originLabel"), value: st(`origins.${stone.origin}`) },
    { label: t("thicknessLabel"), value: stone.thickness },
    {
      label: t("finishesLabel"),
      value: stone.finishes.map((f) => slab(`finishes.${f}`)).join(", "),
    },
  ];

  return (
    <main className="pt-28">
      {/* Breadcrumb — keeps the top light so the (transparent) nav stays legible */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-ink-soft">
          <li>
            <Link href="/collections" className="transition-colors hover:text-copper">
              {nav("collections")}
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li>
            <Link
              href={`/collections/${stone.category}`}
              className="transition-colors hover:text-copper"
            >
              {cat(`categories.${stone.category}`)}
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li className="text-ink">{stone.name}</li>
        </ol>
      </nav>

      {/* Viewer + details */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <StoneViewer stone={stone} />

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">
              {cat(`categories.${stone.category}`)}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink md:text-6xl">
              {stone.name}
            </h1>
            <p className="mt-5 max-w-md text-ink-soft md:text-lg">
              {stone.bespoke
                ? st(`blurbs.${stone.slug}`)
                : st("blurbTemplate", { name: stone.name })}
            </p>

            {/* Primary path to a quote — surfaced high */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={{ pathname: "/contact", query: { stone: stone.slug } }}
                className="inline-block rounded-full bg-copper-deep px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition-transform hover:scale-105"
              >
                {t("requestThis")}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-copper px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-copper-deep transition-colors hover:bg-copper-deep hover:text-white"
              >
                {nav("whatsapp")}
              </a>
            </div>
            <p className="mt-3 text-xs text-ink-soft">{t("requestSub")}</p>

            {/* Specifications */}
            <div className="mt-10 border-t border-line pt-8">
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                {t("specsTitle")}
              </p>
              <dl className="mt-4 divide-y divide-line">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-baseline justify-between gap-6 py-3"
                  >
                    <dt className="text-xs uppercase tracking-widest text-ink-soft">
                      {s.label}
                    </dt>
                    <dd className="text-end text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Applications */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-ink-soft">
                {t("applicationsLabel")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {stone.applications.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink"
                  >
                    {t(`applications.${a}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-bleed macro surface — a large, tactile look at the stone */}
      <section className="relative h-[360px] overflow-hidden border-y border-line md:h-[480px]">
        <MarbleTexture hero={stone.heroColor} vein={stone.veinColor} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-copper-bright">
            {t("macroEyebrow")}
          </p>
          <p className="mt-2 font-display text-3xl text-white md:text-4xl">
            {stone.name}
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2 px-6 py-24 md:py-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 font-display text-2xl text-ink md:text-3xl">
              {t("relatedTitle")}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {related.map((s, i) => (
                <StoneCard key={s.slug} stone={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
