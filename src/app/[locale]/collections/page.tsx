import { setRequestLocale, getTranslations } from "next-intl/server";
import { categoryOrder } from "@/data/stones";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryCard } from "@/components/collections/CategoryCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Collections" });
  return { title: `${t("title")} — Granitopia` };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Collections");

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryOrder.map((c, i) => (
            <CategoryCard key={c} category={c} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
