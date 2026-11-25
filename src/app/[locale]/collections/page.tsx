import { setRequestLocale, getTranslations } from "next-intl/server";
import { brandedTitle, pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { StoneCatalog } from "@/components/collections/StoneCatalog";

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
      <section className="bg-paper px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <StoneCatalog />
        </div>
      </section>
    </main>
  );
}
