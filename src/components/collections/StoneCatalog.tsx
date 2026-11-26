"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryOrder, stones, type StoneCategory } from "@/data/stones";
import type { Finish } from "@/data/stones";
import { StoneCard } from "@/components/collections/StoneCard";

/**
 * One catalog, looped for the full collection and for a single material.
 * Search matches the stone name. Chips filter material and finish. The chip
 * row scrolls inside itself so the page never grows sideways.
 */
export function StoneCatalog({ category }: { category?: StoneCategory }) {
  const t = useTranslations("Collections");
  const finishesT = useTranslations("Slab");
  const materials = useTranslations("Featured");
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState<StoneCategory | "">("");
  const [finish, setFinish] = useState<Finish | "">("");
  const [visible, setVisible] = useState(12);
  const [quick, setQuick] = useState<(typeof stones)[number] | null>(null);

  const pool = useMemo(
    () => (category ? stones.filter((s) => s.category === category) : stones),
    [category],
  );

  const finishOptions = useMemo(() => {
    const set = new Set<Finish>();
    for (const stone of pool) {
      for (const item of stone.finishes) set.add(item);
    }
    return [...set];
  }, [pool]);

  const shown = pool.filter((stone) => {
    if (query.trim() && !stone.name.toLowerCase().includes(query.trim().toLowerCase())) {
      return false;
    }
    if (!category && material && stone.category !== material) return false;
    if (finish && !stone.finishes.includes(finish)) return false;
    return true;
  });

  const active = query.trim() !== "" || material !== "" || finish !== "";

  function clear() {
    setQuery("");
    setMaterial("");
    setFinish("");
    setVisible(12);
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="stone-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <input
            id="stone-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            autoComplete="off"
            className="w-full min-h-12 rounded-full border border-line bg-paper px-5 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/70 focus:border-copper"
          />
        </div>

        {!category && (
          <FilterRow label={t("filterCategory")}>
            <Chip pressed={material === ""} onClick={() => setMaterial("")}>
              {t("all")}
            </Chip>
            {categoryOrder.map((item) => (
              <Chip
                key={item}
                pressed={material === item}
                onClick={() => setMaterial(item)}
              >
                {materials(`categories.${item}`)}
              </Chip>
            ))}
          </FilterRow>
        )}

        <FilterRow label={t("filterFinish")}>
          <Chip pressed={finish === ""} onClick={() => setFinish("")}>
            {t("all")}
          </Chip>
          {finishOptions.map((item) => (
            <Chip
              key={item}
              pressed={finish === item}
              onClick={() => setFinish(item)}
            >
              {finishesT(`finishes.${item}`)}
            </Chip>
          ))}
        </FilterRow>

        <div className="flex items-center justify-between gap-4 text-sm text-ink-soft">
          <p>{t("pieces", { count: shown.length })}</p>
          {active && (
            <button
              type="button"
              onClick={clear}
              className="min-h-11 px-1 text-xs uppercase tracking-widest text-copper"
            >
              {t("clear")}
            </button>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-12 text-lg text-ink-soft">{t("noResults")}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.slice(0, visible).map((stone, i) => (
            <div key={stone.slug} className="min-w-0">
              <StoneCard stone={stone} index={i} />
              <button
                type="button"
                onClick={() => setQuick(stone)}
                className="mt-2 min-h-11 text-xs uppercase tracking-[0.18em] text-ink-soft link-draw"
              >
                {t("quickView")}
              </button>
            </div>
          ))}
        </div>
      )}
      {visible < shown.length && (
        <button
          type="button"
          onClick={() => setVisible((n) => n + 12)}
          className="mt-10 inline-flex min-h-12 items-center border border-ink px-6 text-xs uppercase tracking-[0.2em]"
        >
          {t("loadMore")}
        </button>
      )}
      {quick && (
        <dialog
          open
          className="fixed inset-0 z-[80] m-0 flex h-full w-full items-end bg-ink/50 p-0 sm:items-center sm:justify-center sm:p-8"
          onClick={() => setQuick(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuick(null);
          }}
        >
          <div
            className="grid w-full max-w-3xl bg-paper sm:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square bg-paper-2">
              <img src={quick.image} alt={quick.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col p-6">
              <button type="button" className="self-end min-h-11 px-2" onClick={() => setQuick(null)}>
                {t("close")}
              </button>
              <p className="font-display text-4xl text-ink">{quick.name}</p>
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Link href={`/stones/${quick.slug}`} className="inline-flex min-h-12 items-center justify-center bg-ink text-xs uppercase tracking-[0.2em] text-paper">
                  {t("viewStone")}
                </Link>
                <Link
                  href={{ pathname: "/contact", query: { stone: quick.slug } }}
                  className="inline-flex min-h-12 items-center justify-center border border-ink text-xs uppercase tracking-[0.2em]"
                >
                  {t("quote")}
                </Link>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-ink-soft">
        {label}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm transition-colors ${
        pressed
          ? "border-ink bg-ink text-paper"
          : "border-line bg-paper text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}
