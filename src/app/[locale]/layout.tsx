import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  setRequestLocale,
  getTranslations,
  getMessages,
} from "next-intl/server";
import { Fraunces, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import { routing, isRtl } from "@/i18n/routing";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { AnalyticsGate } from "@/components/analytics/AnalyticsGate";
import { Preloader } from "@/components/fx/Preloader";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${inter.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <NextIntlClientProvider messages={messages}>
          <Preloader />
          <CustomCursor />
          <ScrollProgress />
          <SmoothScroll />
          <Nav />
          {children}
          <Footer />
          <CookieBanner />
          <AnalyticsGate />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
