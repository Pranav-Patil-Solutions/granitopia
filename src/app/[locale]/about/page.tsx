import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stats } from "@/components/home/Stats";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: `${t("eyebrow")} — Granitopia` };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <main>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} />
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-display text-2xl leading-relaxed text-ink">
          {t("lead")}
        </p>
        <div className="mt-8 space-y-6 text-ink-soft">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-xl text-copper">
              {t("missionTitle")}
            </h2>
            <p className="mt-3 text-ink-soft">{t("missionBody")}</p>
          </div>
          <div>
            <h2 className="font-display text-xl text-copper">
              {t("visionTitle")}
            </h2>
            <p className="mt-3 text-ink-soft">{t("visionBody")}</p>
          </div>
        </div>
      </section>
      <Stats />
    </main>
  );
}
