"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { prefersReducedMotion, useReducedMotion } from "@/lib/motion";

const ExportMap = dynamic(
  () => import("@/components/home/ExportMap").then((mod) => mod.ExportMap),
  { loading: () => <div className="mx-auto mt-10 h-56 max-w-4xl" /> },
);

function Counter({ value, play }: { value: string; play: boolean }) {
  const target = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
  const suffix = value.replace(/[\d.,\s]/g, ""); // keeps a trailing "+"
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!play) return;
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
  }, [play, target, suffix, value]);

  return <span>{display}</span>;
}

export function Stats() {
  const t = useTranslations("Stats");
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShowMap(true);
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const items = [
    { value: t("countries"), label: t("countriesLabel") },
    { value: t("area"), label: t("areaLabel") },
    { value: t("containers"), label: t("containersLabel") },
    { value: t("units"), label: t("unitsLabel") },
  ];

  return (
    <section ref={sectionRef} id="export-map" className="border-t border-line bg-paper-2 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center text-xs uppercase tracking-[0.3em] text-copper">
            {t("title")}
          </p>
        </Reveal>
        {showMap ? (
          <ExportMap play={inView} reduced={reduced || prefersReducedMotion()} />
        ) : (
          <div className="mx-auto mt-10 h-56 max-w-4xl" />
        )}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="text-center">
                <div className="font-display text-3xl tabular-nums text-copper sm:text-5xl lg:text-6xl">
                  <Counter value={item.value} play={inView} />
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
