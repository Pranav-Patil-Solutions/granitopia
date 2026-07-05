import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  categoryImage,
  categoryOrder,
  stonesInCategory,
  type StoneCategory,
} from "@/data/stones";
import { StoneCard } from "@/components/collections/StoneCard";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    categoryOrder.map((category) => ({ locale, category })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "Featured" });
  if (!categoryOrder.includes(category as StoneCategory)) return {};
  return { title: `${t(`categories.${category}`)} — Granitopia` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!categoryOrder.includes(category as StoneCategory)) notFound();
  setRequestLocale(locale);
  const cat = category as StoneCategory;

  const t = await getTranslations("Featured");
  const c = await getTranslations("Collections");
  const cta = await getTranslations("Category");
  const items = stonesInCategory(cat);

  return (
    <main>
      {/* Category hero — an on-brand photograph of the range emerging from the
          paper. A strong top-down paper scrim keeps the (global, dark-on-light)
          nav and the editorial heading readable over any category image, light
          or dark, while the photo breathes toward the bottom. */}
      <section className="relative flex min-h-[56vh] flex-col overflow-hidden">
        <Image
          src={categoryImage(cat)}
          alt={c(`categoryAlt.${cat}`)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper/85 to-paper/20" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-36">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-copper transition-opacity hover:opacity-70"
          >
            <span className="inline-block rtl:-scale-x-100">←</span>
            {cta("back")}
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-copper">
            {cta("inThisCollection")}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-ink md:text-7xl">
            {t(`categories.${cat}`)}
          </h1>
          <p className="mt-5 max-w-xl text-ink-soft md:text-lg">
            {c(`categoryBlurbs.${cat}`)}
          </p>
          <p className="mt-4 text-sm uppercase tracking-widest text-ink-soft">
            {c("pieces", { count: items.length })}
          </p>
        </div>
      </section>

      {/* Stones in this range */}
      <section className="bg-paper px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {items.map((s, i) => (
              <StoneCard key={s.slug} stone={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
