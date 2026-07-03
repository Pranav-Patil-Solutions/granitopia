import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  categoryOrder,
  stonesInCategory,
  type StoneCategory,
} from "@/data/stones";
import { PageHeader } from "@/components/layout/PageHeader";
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
      <PageHeader
        eyebrow={cta("inThisCollection")}
        title={t(`categories.${cat}`)}
        subtitle={c(`categoryBlurbs.${cat}`)}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Link
          href="/collections"
          className="mb-10 inline-block text-sm uppercase tracking-widest text-copper transition-opacity hover:opacity-70"
        >
          ← {cta("back")}
        </Link>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {items.map((s, i) => (
            <StoneCard key={s.slug} stone={s} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
