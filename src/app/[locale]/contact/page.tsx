import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { getStone } from "@/data/stones";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: `${t("title")} — Granitopia` };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const f = await getTranslations("Footer");
  const nav = await getTranslations("Nav");

  const stoneSlug = typeof sp.stone === "string" ? sp.stone : undefined;
  const stone = stoneSlug ? getStone(stoneSlug) : undefined;

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <QuoteForm defaultStone={stone?.name} />

          <aside className="rounded-sm border border-line bg-paper-2 p-8">
            <h2 className="font-display text-xl text-ink">
              {t("directTitle")}
            </h2>

            <p className="mt-6 text-xs uppercase tracking-widest text-ink-soft">
              {f("addressLabel")}
            </p>
            <p className="mt-1 text-ink">{f("addressValue")}</p>

            <p className="mt-5 text-xs uppercase tracking-widest text-ink-soft">
              {f("phoneLabel")}
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-1 block text-ink transition-colors hover:text-copper"
            >
              {PHONE_DISPLAY}
            </a>

            <p className="mt-5 text-xs uppercase tracking-widest text-ink-soft">
              {f("emailLabel")}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-1 block text-ink transition-colors hover:text-copper"
            >
              {EMAIL}
            </a>

            <p className="mt-8 text-xs uppercase tracking-widest text-ink-soft">
              {t("orReach")}
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block rounded-full border border-copper px-6 py-2.5 text-xs uppercase tracking-widest text-copper transition-colors hover:bg-copper hover:text-white"
            >
              {nav("whatsapp")}
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}
