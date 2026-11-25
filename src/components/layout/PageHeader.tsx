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
    <header className="border-b border-line bg-paper px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.28em] text-copper">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
