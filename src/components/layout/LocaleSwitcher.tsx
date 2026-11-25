"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { en: "EN", de: "DE", ar: "AR" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-1 text-xs tracking-widest"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="mx-1 text-line">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={loc === locale ? "true" : undefined}
            className={
              loc === locale
                ? "inline-flex min-h-11 min-w-11 items-center justify-center text-copper"
                : "inline-flex min-h-11 min-w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink"
            }
          >
            {LABELS[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}
