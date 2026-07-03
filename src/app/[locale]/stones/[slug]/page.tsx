import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getStone, stones, stonesInCategory } from "@/data/stones";
import { StoneViewer } from "@/components/stone/StoneViewer";
import { StoneCard } from "@/components/collections/StoneCard";

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
  const related = stonesInCategory(stone.category).filter(
    (s) => s.slug !== stone.slug,
  );

  const specs = [
    { label: t("originLabel"), value: stone.origin },
    { label: t("thicknessLabel"), value: stone.thickness },
    {
      label: t("finishesLabel"),
      value: stone.finishes.map((f) => slab(`finishes.${f}`)).join(", "),
    },
  ];

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/collections"
          className="mb-8 inline-block text-sm uppercase tracking-widest text-copper transition-opacity hover:opacity-70"
        >
          ← {t("back")}
        </Link>
        <div className="grid gap-12 md:grid-cols-2">
          <StoneViewer stone={stone} />

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-copper">
              {cat(`categories.${stone.category}`)}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
              {stone.name}
            </h1>
            <p className="mt-5 max-w-md text-ink-soft">{stone.blurb}</p>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
              {specs.map((s) => (
                <div key={s.label}>
                  <p className="text-xs uppercase tracking-widest text-ink-soft">
                    {s.label}
                  </p>
                  <p className="mt-1 text-ink">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-ink-soft">
                {t("applicationsLabel")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {stone.applications.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={{ pathname: "/contact", query: { stone: stone.slug } }}
              className="mt-8 inline-block rounded-full bg-copper px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition-transform hover:scale-105"
            >
              {t("requestThis")}
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 font-display text-2xl text-ink">
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
