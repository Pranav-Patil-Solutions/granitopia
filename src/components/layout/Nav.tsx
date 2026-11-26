"use client";

import { useEffect, useRef, useState } from "react";
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
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last.current && y > 72 && !open);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-md transition-transform duration-500 ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
        <Link
          href="/"
          aria-label="Granitopia — home"
          className="text-ink"
          onClick={() => setOpen(false)}
        >
          <Logo
            variant="lockup"
            markClassName="h-8 w-8"
            wordmarkClassName="text-[1.15rem] sm:text-[1.3rem]"
          />
        </Link>
        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="link-draw text-[13px] uppercase tracking-[0.18em] text-ink"
            >
              {t(l.key)}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-5 lg:flex">
          <LocaleSwitcher />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw text-[13px] uppercase tracking-[0.18em]"
          >
            {t("whatsapp")}
          </a>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center bg-ink px-5 text-[11px] uppercase tracking-[0.22em] text-paper transition-colors duration-300 hover:bg-copper-deep"
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
          <span className="text-2xl leading-none">{open ? "×" : "☰"}</span>
        </button>
      </nav>
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 pb-8 pt-5 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo
              variant="lockup"
              markClassName="h-8 w-8"
              wordmarkClassName="text-[1.15rem]"
            />
            <button
              type="button"
              className="h-11 w-11 text-3xl"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="mt-12 flex flex-1 flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-16 items-center font-display text-5xl text-ink"
              >
                {t(l.key)}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-12 items-center justify-center bg-ink text-xs uppercase tracking-[0.22em] text-paper"
          >
            {t("quote")}
          </Link>
          <a
            href={WHATSAPP_URL}
            className="mt-3 inline-flex min-h-12 items-center justify-center border border-ink text-xs uppercase tracking-[0.22em]"
          >
            {t("whatsapp")}
          </a>
          <div className="pt-4">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
