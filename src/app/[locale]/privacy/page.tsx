import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalContent } from "@/components/layout/LegalContent";
import { brandedTitle, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return pageMetadata({
    locale,
    href: "/privacy",
    title: brandedTitle(t("privacy.title")),
    description: t("privacy.intro"),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalContent locale={locale} doc="privacy" />;
}
