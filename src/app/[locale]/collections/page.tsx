import { setRequestLocale, getTranslations } from "next-intl/server";
import { brandedTitle, pageMetadata } from "@/lib/seo";
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
  return pageMetadata({
    locale,
    href: "/collections",
    title: brandedTitle(t("title")),
    description: t("metaDescription"),
  });
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
      <section className="bg-paper px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {categoryOrder.map((c, i) => (
              <CategoryCard key={c} category={c} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
