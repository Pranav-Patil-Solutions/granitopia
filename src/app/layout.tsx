import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

// Root pass-through layout. The real <html>/<body> (with locale + dir) live in
// app/[locale]/layout.tsx so they can react to the active language.
// metadataBase is set here so every relative OG/Twitter image resolves on the
// public site, including routes outside a locale segment.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
