import { setRequestLocale, getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { HeroSlider } from "@/components/hero/HeroSlider";
import { Stats } from "@/components/home/Stats";
import { Prestige } from "@/components/home/Prestige";
import { Marquee } from "@/components/fx/Marquee";
import { StoneGallery } from "@/components/home/StoneGallery";
import { StoryScroller } from "@/components/scroll/StoryScroller";
import { SignatureShowcase } from "@/components/home/SignatureShowcase";
import { QuoteCta } from "@/components/home/QuoteCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return pageMetadata({
    locale,
    href: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const feat = await getTranslations("Featured");
  const stats = await getTranslations("Stats");
  const marqueeItems = [
    feat("categories.granite"),
    feat("categories.marble"),
    feat("categories.exotics"),
    feat("categories.sandstone"),
    feat("categories.tiles"),
    `${stats("countries")} ${stats("countriesLabel")}`,
  ];

  return (
    <main>
      <HeroSlider />
      <Stats />
      <Prestige />
      <Marquee items={marqueeItems} />
      <StoneGallery />
      <StoryScroller />
      <SignatureShowcase />
      <QuoteCta />
    </main>
  );
}
