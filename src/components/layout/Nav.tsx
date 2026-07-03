"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { WHATSAPP_URL } from "@/lib/contact";

const LINKS = [
  { key: "collections", href: "/collections" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function Nav() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line bg-paper/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-[0.25em] text-copper"
        >
          GRANITOPIA
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="text-sm tracking-wide text-ink-soft transition-colors hover:text-ink"
            >
              {t(l.key)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="rounded-full border border-copper px-4 py-2 text-xs uppercase tracking-widest text-copper transition-colors hover:bg-copper hover:text-white"
          >
            {t("quote")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
          aria-label={open ? t("close") : t("menu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-ink transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-6 border-t border-line bg-paper px-6 py-8 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-ink"
            >
              {t(l.key)}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="font-display text-2xl text-copper"
          >
            {t("quote")}
          </Link>
          <div className="flex items-center justify-between pt-4">
            <LocaleSwitcher />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-soft"
            >
              {t("whatsapp")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
