import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";

/*
 * GRN-123 — prestige credentials strip.
 *
 * Loop-engineered chip spec (looped over CREDENTIALS below):
 *   "One centred chip: tiny uppercase label (10px, 0.3em tracking, ink-soft)
 *    over a small uppercase value (ink). Chips sit in one slim wrapping row
 *    separated by thin vertical copper hairlines. hologram:true swaps the
 *    value's fill for the .holo-mark iridescent sheen (globals.css) — used
 *    ONLY on the supplied-to-airports mark."
 *
 * Numbers are single-sourced from the Stats namespace so this strip can
 * never contradict <Stats/>. Throughput confirmed by the client on
 * 2026-07-10: 35 containers / year (was shown as 1,000+/yr pre-GRN-123).
 */
export async function Prestige() {
  const t = await getTranslations("Prestige");
  const stats = await getTranslations("Stats");

  const credentials: {
    key: string;
    label: string;
    value: string;
    hologram?: boolean;
  }[] = [
    { key: "airports", label: t("supplied"), value: t("airports"), hologram: true },
    { key: "countries", label: t("shipped"), value: t("countries", { count: stats("countries") }) },
    { key: "containers", label: t("throughput"), value: t("containers", { count: stats("containers") }) },
  ];

  return (
    <section aria-label={t("aria")} className="border-t border-line bg-paper-2 px-6 py-8">
      <Reveal y={12}>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {credentials.map((c, i) => (
            <Fragment key={c.key}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden h-7 w-px bg-gradient-to-b from-transparent via-copper/45 to-transparent sm:block"
                />
              )}
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
                  {c.label}
                </div>
                <div className="mt-1.5 text-xs font-medium uppercase tracking-[0.18em] text-ink">
                  {c.hologram ? <span className="holo-mark">{c.value}</span> : c.value}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
