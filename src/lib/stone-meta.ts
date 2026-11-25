import { getTranslations } from "next-intl/server";
import type { Stone } from "@/data/stones";
import { absoluteUrl, brandedTitle } from "@/lib/seo";

/**
 * Stone page copy, looped over every stone via this one function.
 * Bespoke stones use Stones.blurbs.<slug>; the rest use blurbTemplate.
 * Origin and thickness come from the stone record, with translated labels.
 */
export async function stoneMeta(locale: string, stone: Stone) {
  const stonesT = await getTranslations({ locale, namespace: "Stones" });
  const detail = await getTranslations({ locale, namespace: "StoneDetail" });
  const featured = await getTranslations({ locale, namespace: "Featured" });
  const slab = await getTranslations({ locale, namespace: "Slab" });

  const blurb = stone.bespoke
    ? stonesT(`blurbs.${stone.slug}`)
    : stonesT("blurbTemplate", { name: stone.name });
  const origin = stonesT(`origins.${stone.origin}`);
  const category = featured(`categories.${stone.category}`);
  const finishes = stone.finishes.map((finish) => slab(`finishes.${finish}`)).join(", ");
  const description = `${blurb} ${detail("originLabel")}: ${origin}. ${detail("thicknessLabel")}: ${stone.thickness}.`;

  return {
    title: brandedTitle(stone.name),
    description,
    blurb,
    origin,
    category,
    finishes,
    originLabel: detail("originLabel"),
    thicknessLabel: detail("thicknessLabel"),
    finishesLabel: detail("finishesLabel"),
    url: absoluteUrl(locale, `/stones/${stone.slug}`),
  };
}
