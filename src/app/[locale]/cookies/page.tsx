import { setRequestLocale, getTranslations } from "next-intl/server";
import { LegalContent } from "@/components/layout/LegalContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return { title: `${t("cookies.title")} — Granitopia` };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalContent locale={locale} doc="cookies" />;
}
