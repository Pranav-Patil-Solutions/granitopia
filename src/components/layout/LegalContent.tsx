import { getTranslations } from "next-intl/server";
import { PageHeader } from "./PageHeader";

type Section = { heading: string; body: string };
export type LegalDoc = "impressum" | "privacy" | "cookies";

/**
 * Renders a legal document (Impressum / Privacy / Cookies) from the `Legal`
 * message namespace. Server component — content is fully SSR'd.
 *
 * TODO(legal): the following facts are shown as "on request" until Pranav
 * confirms them — full registered postal address, LLPIN, GSTIN, names of the
 * Designated Partners, and (for GDPR) the international-transfer safeguard used
 * and any required privacy contact/DPO. These notices need a professional legal
 * review before they are relied upon.
 */
export async function LegalContent({
  locale,
  doc,
}: {
  locale: string;
  doc: LegalDoc;
}) {
  const t = await getTranslations({ locale, namespace: "Legal" });
  const sections = t.raw(`${doc}.sections`) as Section[];

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t(`${doc}.title`)}
        subtitle={t(`${doc}.intro`)}
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="rounded-sm border border-copper/30 bg-copper/5 px-4 py-3 text-sm text-ink-soft">
          {t("provisionalNote")}
        </p>

        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-xl text-copper">{s.heading}</h2>
              {s.body.split("\n").map((line, j) => (
                <p key={j} className="mt-2 text-ink-soft">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        <p className="mt-14 border-t border-line pt-6 text-xs uppercase tracking-widest text-ink-soft/70">
          {t("updated")}: {t("updatedDate")} · {t("reviewNote")}
        </p>
      </section>
    </main>
  );
}
