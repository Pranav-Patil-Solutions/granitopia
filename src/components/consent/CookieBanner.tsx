"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getConsent, setConsent } from "@/lib/consent";

export function CookieBanner() {
  const t = useTranslations("Consent");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(getConsent() === null);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-paper/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-ink-soft">{t("message")}</p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => {
              setConsent("declined");
              setShow(false);
            }}
            className="rounded-full border border-line px-5 py-2 text-xs uppercase tracking-widest text-ink-soft transition-colors hover:text-ink"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent("accepted");
              setShow(false);
            }}
            className="rounded-full bg-copper px-5 py-2 text-xs uppercase tracking-widest text-white"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
