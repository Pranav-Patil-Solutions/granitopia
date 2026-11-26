"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_URL } from "@/lib/contact";

/** Thumb-zone quote bar, WhatsApp, and back-to-top. */
export function Chrome() {
  const t = useTranslations("Nav");
  const ui = useTranslations("Ui");
  const [up, setUp] = useState(false);

  useEffect(() => {
    const onScroll = () => setUp(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-paper/95 p-3 backdrop-blur md:hidden">
        <Link href="/contact" className="inline-flex min-h-12 flex-1 items-center justify-center bg-ink text-[11px] uppercase tracking-[0.18em] text-paper">
          {t("quote")}
        </Link>
        <a href={WHATSAPP_URL} className="inline-flex min-h-12 flex-1 items-center justify-center border border-ink text-[11px] uppercase tracking-[0.18em]">
          {t("whatsapp")}
        </a>
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 hidden h-12 min-w-12 items-center justify-center bg-ink px-4 text-[11px] uppercase tracking-[0.16em] text-paper md:inline-flex"
      >
        {t("whatsapp")}
      </a>
      {up && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 hidden h-12 w-12 items-center justify-center border border-ink bg-paper md:inline-flex"
          aria-label={ui("backToTop")}
        >
          ↑
        </button>
      )}
    </>
  );
}
