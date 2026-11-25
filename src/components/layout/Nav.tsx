"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "@/components/brand/Logo";
import { WHATSAPP_URL } from "@/lib/contact";

const LINKS = [
  { key: "collections", href: "/collections" },
  { key: "about", href: "/about" },
  { key: "careers", href: "/careers" },
  { key: "contact", href: "/contact" },
] as const;

export function Nav() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:h-[4.5rem] sm:px-8">
        <Link
          href="/"
          aria-label="Granitopia — home"
          className="min-w-0 text-ink"
          onClick={() => setOpen(false)}
        >
          <Logo
            variant="lockup"
            markClassName="h-8 w-8 sm:h-9 sm:w-9"
            wordmarkClassName="text-[1.15rem] sm:text-[1.35rem]"
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {t(l.key)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitcher />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center px-2 text-xs uppercase tracking-widest text-ink-soft transition-colors hover:text-ink"
          >
            {t("whatsapp")}
          </a>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center rounded-full bg-copper-deep px-5 text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-copper"
          >
            {t("quote")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
          aria-label={open ? t("close") : t("menu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex w-6 flex-col gap-1.5">
            <span
              className={`h-px w-6 bg-ink transition-transform ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ink transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ink transition-transform ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 pb-10 pt-5 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo
              variant="lockup"
              markClassName="h-8 w-8"
              wordmarkClassName="text-[1.15rem]"
            />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
            >
              <span className="text-2xl leading-none text-ink">×</span>
            </button>
          </div>
          <div className="mt-10 flex flex-1 flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-center font-display text-4xl text-ink"
              >
                {t(l.key)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 border-t border-line pt-6">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-copper-deep text-sm font-medium uppercase tracking-widest text-white"
            >
              {t("quote")}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-line text-sm uppercase tracking-widest text-ink"
            >
              {t("whatsapp")}
            </a>
            <div className="pt-2">
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
