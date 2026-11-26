"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getConsent, setConsent } from "@/lib/consent";

export function CookieBanner() {
  const t = useTranslations("Consent");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShow(getConsent() === null));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed left-4 right-4 top-20 z-[70] border border-ink bg-paper p-5 sm:left-auto sm:right-6 sm:w-80">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-ink-soft">{t("message")}</p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => {
              setConsent("declined");
              setShow(false);
            }}
            className="min-h-11 border border-ink px-4 text-xs uppercase tracking-widest"
          >
            {t("decline")}
          </button>
          <button
            type="button"
            onClick={() => {
              setConsent("accepted");
              setShow(false);
            }}
            className="min-h-11 bg-ink px-4 text-xs uppercase tracking-widest text-paper"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
