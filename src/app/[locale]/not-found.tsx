import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  setRequestLocale("en");
  const t = await getTranslations("Ui");
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-3xl flex-col justify-center px-5 py-24">
      <p className="text-xs uppercase tracking-[0.28em] text-copper">404</p>
      <h1 className="mt-4 font-display text-5xl text-ink sm:text-7xl">{t("notFoundTitle")}</h1>
      <p className="mt-5 max-w-md text-ink-soft">{t("notFoundBody")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/collections" className="inline-flex min-h-12 items-center justify-center bg-ink px-6 text-xs uppercase tracking-[0.2em] text-paper">
          {t("browse")}
        </Link>
        <Link href="/contact" className="inline-flex min-h-12 items-center justify-center border border-ink px-6 text-xs uppercase tracking-[0.2em]">
          {t("quote")}
        </Link>
      </div>
    </main>
  );
}
