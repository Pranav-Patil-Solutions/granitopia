"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { featuredStones } from "@/data/stones";
import { useReducedMotion } from "@/lib/motion";

export function HorizontalStones() {
  const t = useTranslations("Featured");
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(
        Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 24),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const header = (
    <div className="mb-10 flex items-end justify-between px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-copper">
          {t("eyebrow")}
        </p>
        <h2 className="mt-4 font-display text-4xl leading-tight text-ink md:text-6xl">
          {t("title")}
        </h2>
      </div>
      <Link
        href="/collections"
        className="hidden border-b border-copper pb-1 text-sm uppercase tracking-widest text-copper transition-opacity hover:opacity-70 md:inline-block"
      >
        {t("viewAll")}
      </Link>
    </div>
  );

  const cards = featuredStones.map((stone) => (
    <Link
      key={stone.slug}
      href={`/stones/${stone.slug}`}
      className="group relative block h-[60vh] w-[80vw] shrink-0 overflow-hidden rounded-sm border border-line sm:w-[46vw] lg:w-[32vw]"
    >
      <Image
        src={stone.image}
        alt={stone.name}
        fill
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 46vw, 32vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-copper">
            {t(`categories.${stone.category}`)}
          </p>
          <p className="mt-1 font-display text-2xl text-white">{stone.name}</p>
        </div>
        <span className="text-white/70 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  ));

  // Reduced-motion fallback: native horizontal scroll.
  if (reduced) {
    return (
      <section id="featured" className="border-t border-line bg-paper py-24">
        {header}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4">{cards}</div>
      </section>
    );
  }

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="relative border-t border-line bg-paper"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        {header}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 px-6">
          {cards}
        </motion.div>
      </div>
    </section>
  );
}
