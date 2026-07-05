import Image from "next/image";
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

  const reassurances = [
    t("reassure.fast"),
    t("reassure.reach"),
    t("reassure.samples"),
  ];

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid items-start gap-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
          {/* Enquiry */}
          <div>
            <QuoteForm defaultStone={stone?.name} />

            {/* Low-friction reassurance */}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6">
              {reassurances.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-soft"
                >
                  <span aria-hidden className="text-copper">
                    ●
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Warm showroom panel — direct contact + a prominent WhatsApp route */}
          <aside className="relative min-h-[520px] overflow-hidden rounded-sm border border-line">
            <Image
              src="/images/contact/showroom.jpg"
              alt={t("showroomAlt")}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <h2 className="font-display text-2xl text-white">
                {t("directTitle")}
              </h2>

              <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-copper-bright">
                {f("addressLabel")}
              </p>
              <p className="mt-1 text-sm text-white/85">{f("addressValue")}</p>

              <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-copper-bright">
                {f("phoneLabel")}
              </p>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-1 block text-sm text-white/85 transition-colors hover:text-copper-bright"
              >
                <bdi dir="ltr">{PHONE_DISPLAY}</bdi>
              </a>

              <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-copper-bright">
                {f("emailLabel")}
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-1 block text-sm text-white/85 transition-colors hover:text-copper-bright"
              >
                {EMAIL}
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-copper-deep px-7 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform hover:scale-105"
              >
                {t("orReach")} {nav("whatsapp")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
