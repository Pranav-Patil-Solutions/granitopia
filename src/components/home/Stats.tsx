"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { prefersReducedMotion } from "@/lib/motion";

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const target = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
  const suffix = value.replace(/[\d.,\s]/g, ""); // keeps a trailing "+"
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        setDisplay(
          new Intl.NumberFormat("en-US").format(Math.round(eased * target)) +
            suffix,
        );
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value); // exact localized final string
      }
    };
    // start from zero
    setDisplay("0" + suffix);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, suffix, value]);

  return <span ref={ref}>{display}</span>;
}

export function Stats() {
  const t = useTranslations("Stats");

  const items = [
    { value: t("countries"), label: t("countriesLabel") },
    { value: t("area"), label: t("areaLabel") },
    { value: t("containers"), label: t("containersLabel") },
    { value: t("units"), label: t("unitsLabel") },
  ];

  return (
    <section className="border-t border-line bg-paper-2 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.3em] text-copper">
            {t("title")}
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="text-center">
                <div className="font-display text-4xl tabular-nums text-copper md:text-6xl">
                  <Counter value={item.value} />
                </div>
                <div className="mt-3 text-xs uppercase tracking-widest text-ink-soft">
                  {item.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
