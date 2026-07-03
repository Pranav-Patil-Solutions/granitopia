import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "ar"],
  defaultLocale: "en",
  // Always keep the locale prefix (/en, /de, /ar) for clean SEO + hreflang.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

/** Right-to-left locales. Arabic is RTL; English and German are LTR. */
export function isRtl(locale: string): boolean {
  return locale === "ar";
}
