"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/contact";

/**
 * Explore links, one rule for every page and locale:
 * on the homepage, scroll to the section that already exists there;
 * everywhere else, go to the real route (those hashes are not on other pages).
 */
export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const pathname = usePathname();
  const onHome = pathname === "/";

  const explore = [
    {
      label: nav("collections"),
      href: onHome ? "/#featured" : "/collections",
    },
    { label: nav("about"), href: onHome ? "/#story" : "/about" },
    { label: nav("quote"), href: onHome ? "/#quote" : "/contact" },
  ];
  const legal = [
    { label: t("privacy"), href: "/privacy" },
    { label: t("impressum"), href: "/impressum" },
    { label: t("cookies"), href: "/cookies" },
  ];

  return (
    <footer
      id="contact"
      className="bg-dark px-5 pb-10 pt-16 text-white/70 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo variant="lockup" className="text-white" wordmarkClassName="text-[1.5rem]" />
            <p className="mt-3 text-sm text-white/50">{t("tagline")}</p>
          </div>

          {/* Contact */}
          <div className="text-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-copper">
              {t("addressLabel")}
            </p>
            <p>{t("addressValue")}</p>
            <p className="mt-4 text-xs uppercase tracking-widest text-copper">
              {t("phoneLabel")}
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex min-h-11 items-center transition-colors hover:text-copper"
            >
              <bdi dir="ltr">{PHONE_DISPLAY}</bdi>
            </a>
            <p className="mt-4 text-xs uppercase tracking-widest text-copper">
              {t("emailLabel")}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex min-h-11 items-center transition-colors hover:text-copper"
            >
              {EMAIL}
            </a>
          </div>

          {/* Explore */}
          <div className="text-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-copper">
              {t("exploreTitle")}
            </p>
            <ul className="space-y-2">
              {explore.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center transition-colors hover:text-copper">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/careers"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-copper"
                >
                  {nav("careers")}
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-copper"
                >
                  {nav("whatsapp")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-sm">
            <p className="mb-3 text-xs uppercase tracking-widest text-copper">
              {t("legalTitle")}
            </p>
            <ul className="space-y-2">
              {legal.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-11 items-center transition-colors hover:text-copper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} {t("rights")}
          </p>
          <a
            href="https://handelos.io"
            target="_blank"
            rel="noopener noreferrer"
            className="tracking-widest transition-colors hover:text-copper"
          >
            MADE BY HANDELOS
            <span className="sr-only"> ({t("newTab")})</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
