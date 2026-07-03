import type { ReactNode } from "react";

// Root pass-through layout. The real <html>/<body> (with locale + dir) live in
// app/[locale]/layout.tsx so they can react to the active language.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
