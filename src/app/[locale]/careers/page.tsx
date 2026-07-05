import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Link } from "@/i18n/navigation";

const ROLE_KEYS = [
  "quarryLead",
  "exportSales",
  "cncFinisher",
  "logistics",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return { title: `${t("eyebrow")} — Granitopia` };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Careers");

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />

      {/* Why work here */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-display text-2xl text-copper">{t("whyTitle")}</h2>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          {t("whyBody")}
        </p>
      </section>

      {/* Open roles */}
      <section className="border-t border-line bg-paper-2 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            {t("openRolesTitle")}
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {ROLE_KEYS.map((key) => (
              <li key={key}>
                <Link
                  href="/contact"
                  className="group flex h-full flex-col rounded-sm border border-line bg-paper p-7 transition-colors hover:border-copper"
                >
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-copper">
                    <span>
                      {t("locationLabel")}: {t(`roles.${key}.location`)}
                    </span>
                    <span className="text-copper/50">·</span>
                    <span>
                      {t("typeLabel")}: {t(`roles.${key}.type`)}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-ink">
                    {t(`roles.${key}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-ink-soft">
                    {t(`roles.${key}.blurb`)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-copper">
                    {t("apply")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Open application CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-ink md:text-4xl">
          {t("ctaTitle")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">{t("ctaBody")}</p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-full border border-copper px-6 py-3 text-xs uppercase tracking-widest text-copper transition-colors hover:bg-copper hover:text-white"
        >
          {t("ctaButton")}
        </Link>
      </section>
    </main>
  );
}
