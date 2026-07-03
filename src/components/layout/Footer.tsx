"use client";

import { useTranslations } from "next-intl";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/contact";

export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");

  const explore = [
    { label: nav("collections"), href: "#featured" },
    { label: nav("about"), href: "#story" },
    { label: nav("quote"), href: "#quote" },
  ];
  const legal = [
    { label: t("privacy"), href: "#" },
    { label: t("impressum"), href: "#" },
    { label: t("cookies"), href: "#" },
  ];

  return (
    <footer
      id="contact"
      className="bg-dark px-6 pb-10 pt-20 text-white/70"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-display text-2xl font-semibold tracking-[0.2em] text-copper">
              GRANITOPIA
            </div>
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
              className="transition-colors hover:text-copper"
            >
              {PHONE_DISPLAY}
            </a>
            <p className="mt-4 text-xs uppercase tracking-widest text-copper">
              {t("emailLabel")}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="transition-colors hover:text-copper"
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
                  <a href={l.href} className="transition-colors hover:text-copper">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-copper"
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
                  <a href={l.href} className="transition-colors hover:text-copper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} {t("rights")}
          </p>
          <p className="tracking-widest">MADE BY HANDELOS</p>
        </div>
      </div>
    </footer>
  );
}
