// Presentational header band for inner pages. Accounts for the fixed nav.
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-line bg-paper-2 px-6 pb-16 pt-36 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-copper">{eyebrow}</p>
      <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-tight text-ink md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-xl text-ink-soft">{subtitle}</p>
      )}
    </header>
  );
}
