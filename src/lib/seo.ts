import type { Metadata } from "next";
import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { categoryOrder, stones } from "@/data/stones";
import { EMAIL, PHONE_TEL } from "@/lib/contact";

/**
 * SEO brief, looped over every indexable route (home, collections, each
 * category, each stone, about, careers, contact, privacy, impressum, cookies)
 * and every locale (en, de, ar):
 *
 *   - Canonical and hreflang URLs live on https://www.granitopia.com with the
 *     locale prefix always present (/en, /de, /ar). x-default is English.
 *   - Title names the page, then " — Granitopia", except the homepage, which
 *     leads with the brand.
 *   - Description is unique to that page and locale. Stone pages are NOT
 *     hand-written: they are "{localized blurb} {origin label}: {origin}.
 *     {thickness label}: {thickness}." from the stone record.
 *   - Open Graph and Twitter repeat that title and description. Pages without
 *     their own image inherit the locale opengraph-image / twitter-image.
 *     Stone pages pass the catalog photo.
 *   - JSON-LD states only published facts. No price, rating, review, or
 *     street address — the public office line is a city, not a postal address.
 */

export const SITE_URL = "https://www.granitopia.com";
export const SITE_NAME = "Granitopia";
export const ORG_LEGAL_NAME = "Granitopia Stones International LLP";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
  ar: "ar_AR",
};

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

/** Path with the locale prefix. Matches next-intl `localePrefix: "always"`. */
export function localizedPath(locale: string, href: string): string {
  const hashAt = href.indexOf("#");
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  const bare = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const path = bare.startsWith("/") ? bare : `/${bare}`;
  const prefix = `/${locale}`;
  const pathname = path === "/" ? prefix : `${prefix}${path}`;
  return `${pathname}${hash}`;
}

export function absoluteUrl(locale: string, href: string): string {
  return new URL(localizedPath(locale, href), SITE_URL).href;
}

export function languageAlternates(href: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, href);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, href);
  return languages;
}

export function ogLocale(locale: string): string {
  return isLocale(locale) ? OG_LOCALE[locale] : OG_LOCALE.en;
}

export function brandedTitle(page: string): string {
  return `${page} — ${SITE_NAME}`;
}

export function pageMetadata({
  locale,
  href,
  title,
  description,
  image,
  imageAlt,
}: {
  locale: string;
  href: string;
  title: string;
  description: string;
  /** Relative or absolute image. Omit to keep the file-based OG/Twitter image. */
  image?: string;
  imageAlt?: string;
}): Metadata {
  const canonical = absoluteUrl(locale, href);
  // The [locale] opengraph-image file is picked up by the homepage (same
  // segment). Nested routes that set openGraph do not inherit it, so they
  // name an image here: the stone photo, or the brand card otherwise.
  const brandCard =
    href === "/"
      ? undefined
      : [
          {
            url: `/${locale}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: "Granitopia — Utopia of Natural Stones",
          },
        ];
  const twitterCard =
    href === "/"
      ? undefined
      : [
          {
            url: `/${locale}/twitter-image`,
            width: 1200,
            height: 630,
            alt: "Granitopia — Utopia of Natural Stones",
          },
        ];
  const images = image ? [{ url: image, alt: imageAlt ?? title }] : brandCard;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: languageAlternates(href),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image
        ? { images: [image] }
        : twitterCard
          ? { images: twitterCard }
          : {}),
    },
  };
}

/** Static routes plus every category and every stone. No query-string variants. */
export function indexableHrefs(): string[] {
  return [
    "/",
    "/collections",
    ...categoryOrder.map((category) => `/collections/${category}`),
    ...stones.map((stone) => `/stones/${stone.slug}`),
    "/about",
    "/careers",
    "/contact",
    "/privacy",
    "/impressum",
    "/cookies",
  ];
}

export function buildSitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    indexableHrefs().map((href) => {
      const stoneSlug = href.startsWith("/stones/")
        ? href.slice("/stones/".length)
        : undefined;
      const stone = stoneSlug
        ? stones.find((item) => item.slug === stoneSlug)
        : undefined;
      return {
        url: absoluteUrl(locale, href),
        alternates: { languages: languageAlternates(href) },
        images: stone ? [`${SITE_URL}${stone.image}`] : undefined,
      };
    }),
  );
}

export function organizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG_LEGAL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/logo.png`,
    email: EMAIL,
    telephone: PHONE_TEL,
    description,
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  image: string;
  url: string;
  category: string;
  originLabel: string;
  origin: string;
  thicknessLabel: string;
  thickness: string;
  finishesLabel: string;
  finishes: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.image.startsWith("http")
      ? input.image
      : `${SITE_URL}${input.image}`,
    url: input.url,
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    category: input.category,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: input.originLabel,
        value: input.origin,
      },
      {
        "@type": "PropertyValue",
        name: input.thicknessLabel,
        value: input.thickness,
      },
      {
        "@type": "PropertyValue",
        name: input.finishesLabel,
        value: input.finishes,
      },
    ],
  };
}
