"use client";

/** Seamless infinite marquee band. Pauses on hover; static under reduced motion. */
export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`marquee-group marquee-mask overflow-hidden border-y border-line bg-paper py-5 ${className ?? ""}`}
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm uppercase tracking-[0.25em] text-ink-soft"
          >
            {item}
            <span className="text-copper">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
