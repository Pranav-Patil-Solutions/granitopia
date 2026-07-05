import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "./PageHeader";

type Section = { heading: string; body: string };
export type LegalDoc = "impressum" | "privacy" | "cookies";

// Turn any email address inside legal copy into a mailto link — the contact
// address recurs across these notices and readers expect it to be tappable.
const EMAIL_SPLIT = /([^\s@]+@[^\s@]+\.[a-zA-Z]{2,})/g;
const EMAIL_ONE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function linkifyEmail(text: string): ReactNode[] {
  return text.split(EMAIL_SPLIT).map((part, i) =>
    EMAIL_ONE.test(part) ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="text-copper underline-offset-2 hover:underline"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

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
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <p className="rounded-sm border border-copper/30 bg-copper/5 px-4 py-3 text-sm leading-relaxed text-ink-soft">
          {linkifyEmail(t("provisionalNote"))}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <div key={i} className="border-s-2 border-line ps-5">
              <h2 className="flex items-baseline gap-3 font-display text-xl text-copper">
                <span className="text-sm tabular-nums text-copper/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.heading}
              </h2>
              {s.body.split("\n").map((line, j) => (
                <p key={j} className="mt-3 leading-relaxed text-ink-soft">
                  {linkifyEmail(line)}
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
