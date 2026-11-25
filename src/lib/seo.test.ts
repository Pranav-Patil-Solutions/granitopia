import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { stones } from "@/data/stones";
import {
  absoluteUrl,
  buildSitemap,
  indexableHrefs,
  languageAlternates,
  organizationJsonLd,
  productJsonLd,
} from "./seo";

const LOCALES = ["en", "de", "ar"] as const;

describe("canonical urls", () => {
  it("keeps the locale prefix on www.granitopia.com", () => {
    expect(absoluteUrl("en", "/")).toBe("https://www.granitopia.com/en");
    expect(absoluteUrl("de", "/about")).toBe(
      "https://www.granitopia.com/de/about",
    );
    expect(absoluteUrl("ar", "/stones/millennium-cream")).toBe(
      "https://www.granitopia.com/ar/stones/millennium-cream",
    );
  });

  it("lists every locale plus x-default", () => {
    expect(languageAlternates("/contact")).toEqual({
      en: "https://www.granitopia.com/en/contact",
      de: "https://www.granitopia.com/de/contact",
      ar: "https://www.granitopia.com/ar/contact",
      "x-default": "https://www.granitopia.com/en/contact",
    });
  });
});

describe("sitemap", () => {
  it("covers every locale and every stone, and not the old cream slug", () => {
    const hrefs = indexableHrefs();
    expect(hrefs).toContain("/stones/millennium-cream");
    expect(hrefs).not.toContain("/stones/millenium-cream");
    for (const stone of stones) {
      expect(hrefs).toContain(`/stones/${stone.slug}`);
    }

    const urls = buildSitemap().map((entry) => entry.url);
    expect(urls).toHaveLength(hrefs.length * LOCALES.length);
    for (const locale of LOCALES) {
      expect(urls).toContain(
        `https://www.granitopia.com/${locale}/stones/absolute-black`,
      );
    }
    expect(urls.some((url) => url.includes("millenium-cream"))).toBe(false);
  });
});

describe("json-ld", () => {
  it("does not invent an address, price, or rating", () => {
    const org = JSON.stringify(organizationJsonLd("Exporter of natural stone."));
    const product = JSON.stringify(
      productJsonLd({
        name: "Millennium Cream",
        description: "A cream granite.",
        image: "/images/stones/millennium-cream.jpg",
        url: "https://www.granitopia.com/en/stones/millennium-cream",
        category: "Granite",
        originLabel: "Origin",
        origin: "India",
        thicknessLabel: "Thickness",
        thickness: "18mm / 20mm / 30mm",
        finishesLabel: "Available finishes",
        finishes: "Polished",
      }),
    );
    for (const json of [org, product]) {
      expect(json).not.toMatch(/streetAddress|postalCode|aggregateRating|"offers"|"price"/);
    }
    expect(org).toContain("sales@granitopia.com");
    expect(org).not.toContain("Bengaluru");
    expect(product).toContain("Millennium Cream");
    expect(product).toContain("https://www.granitopia.com/images/stones/millennium-cream.jpg");
  });
});

describe("message catalogs", () => {
  const required = [
    "Footer.newTab",
    "Collections.metaDescription",
    "Careers.metaDescription",
    "Contact.form.role",
    "Contact.form.rolePrefill",
    "Contact.form.tooLong",
    "Contact.form.tooShort",
    "Contact.form.invalidPhone",
    "Contact.form.errorSummary",
  ];

  it.each(["en", "de", "ar"])("%s has every new string", (locale) => {
    const messages = JSON.parse(
      readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), "utf8"),
    ) as Record<string, unknown>;
    for (const path of required) {
      const value = path.split(".").reduce<unknown>((node, key) => {
        if (node && typeof node === "object") {
          return (node as Record<string, unknown>)[key];
        }
        return undefined;
      }, messages);
      expect(typeof value, path).toBe("string");
      expect(String(value).length).toBeGreaterThan(0);
    }
  });
});
