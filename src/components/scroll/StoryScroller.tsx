"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/motion";
import { CHAPTER_KEYS, STORY_IMAGES } from "@/components/three/storyChapters";

const N = CHAPTER_KEYS.length;
const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26, clipPath: "inset(0 0 100% 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.75, ease: EASE },
  },
};

export function StoryScroller() {
  const t = useTranslations("Story");
  const locale = useLocale();
  const rtl = locale === "ar";
  const reduced = useReducedMotion();

  const [cinematic, setCinematic] = useState(false);
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Continuous, scroll-driven push-in + drift (Ken Burns) for the pinned film —
  // the stage never sits still, so the story feels like one unbroken shot.
  const filmScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.24]);
  const filmY = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);

  useEffect(() => {
    const desktop =
      window.matchMedia("(min-width: 1024px)").matches &&
      window.matchMedia("(pointer: fine)").matches;
    setCinematic(!reduced && desktop);
  }, [reduced]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((prev) => (prev === i ? prev : i));
  });

  /* ---------- Cinematic: pinned, scroll-driven film ---------- */
  if (cinematic) {
    const key = CHAPTER_KEYS[active];
    const textSide = rtl
      ? "right-6 items-end text-right md:right-16"
      : "left-6 items-start text-left md:left-16";

    return (
      <section
        ref={sectionRef}
        id="story"
        className="relative bg-[#0a0708]"
        style={{ height: `${N * 118}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* pinned film — cross-fading 4K photography, one shot per chapter.
              Outer layer drifts + pushes in continuously with scroll; each shot
              resolves from a soft, scaled-up blur into a sharp, settled frame. */}
          <motion.div
            className="absolute inset-0 bg-[#0a0708]"
            style={{ scale: filmScale, y: filmY }}
          >
            {CHAPTER_KEYS.map((k, i) => {
              const img = STORY_IMAGES[k];
              const on = i === active;
              return (
                <motion.div
                  key={k}
                  className="absolute inset-0 will-change-[opacity,transform]"
                  initial={false}
                  animate={{
                    opacity: on ? 1 : 0,
                    scale: on ? 1 : 1.14,
                    filter: on ? "blur(0px)" : "blur(18px)",
                  }}
                  transition={{
                    opacity: { duration: 1.9, ease: EASE },
                    scale: { duration: 2.8, ease: EASE },
                    filter: { duration: 1.7, ease: EASE },
                  }}
                >
                  <Image
                    src={img.src}
                    alt={t(`chapters.${k}.alt`)}
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* fine film grain — cinematic texture over the whole stage */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "140px 140px",
            }}
          />

          {/* legibility: vignette + top/bottom gradients (survive mood shifts) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(115% 95% at 50% 42%, transparent 38%, rgba(0,0,0,0.66) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/70 to-transparent"
          />

          {/* header */}
          <div
            className={`absolute top-8 z-10 md:top-12 ${rtl ? "right-6 text-right md:right-16" : "left-6 text-left md:left-16"}`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-copper-bright">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 max-w-xs font-display text-xl leading-tight text-white/90 md:text-2xl">
              {t("title")}
            </h2>
            <a
              href="#featured"
              className="mt-4 inline-block text-[11px] uppercase tracking-[0.3em] text-white/45 underline-offset-4 transition-colors hover:text-copper-bright hover:underline"
            >
              {t("skip")} ↓
            </a>
          </div>

          {/* active chapter — masked, staggered reveal */}
          <div className={`absolute bottom-16 z-10 flex max-w-lg flex-col ${textSide}`}>
            {/* keyed remount per chapter → clean masked reveal, no exit queue
                (robust when scrolling fast across several chapters) */}
            <motion.div
              key={key}
              variants={container}
              initial="hidden"
              animate="show"
              className={`flex flex-col ${rtl ? "items-end" : "items-start"}`}
            >
              <motion.span
                variants={item}
                className="text-xs uppercase tracking-[0.35em] text-copper-bright"
              >
                {String(active + 1).padStart(2, "0")} · {t(`chapters.${key}.kicker`)}
              </motion.span>
              <motion.h3
                variants={item}
                className="mt-3 max-w-xl font-display text-4xl leading-[1.05] text-white md:text-6xl"
              >
                {t(`chapters.${key}.headline`)}
              </motion.h3>
              <motion.p
                variants={item}
                className="mt-5 max-w-md text-white/70 md:text-lg"
              >
                {t(`chapters.${key}.body`)}
              </motion.p>
            </motion.div>
          </div>

          {/* copper chapter rail (opposite side) */}
          <div
            className={`absolute top-1/2 z-10 flex h-52 -translate-y-1/2 flex-col ${rtl ? "left-6" : "right-6"}`}
          >
            <div className="relative h-full w-px bg-white/15">
              <motion.div
                className="absolute left-0 top-0 w-px origin-top bg-copper-bright"
                style={{ height: "100%", scaleY: scrollYProgress }}
              />
              {CHAPTER_KEYS.map((s, i) => (
                <span
                  key={s}
                  className={`absolute -left-[3px] h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    i <= active ? "bg-copper-bright" : "bg-white/25"
                  } ${i === active ? "scale-150" : ""}`}
                  style={{ top: `${(i / (N - 1)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Fallback: static, stacked, museum-light (no-JS / reduced / mobile) ---------- */
  return (
    <section
      ref={sectionRef}
      id="story"
      className="border-t border-line bg-paper-2"
    >
      <div className="mx-auto max-w-7xl px-6 pt-24 text-center md:pt-32">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">
            {t("eyebrow")}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight text-ink md:text-6xl">
            {t("title")}
          </h2>
          <a
            href="#featured"
            className="mt-6 inline-block text-[11px] uppercase tracking-[0.3em] text-ink-soft underline-offset-4 transition-colors hover:text-copper hover:underline"
          >
            {t("skip")} ↓
          </a>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {CHAPTER_KEYS.map((key, i) => (
          <div
            key={key}
            className={`flex flex-col gap-8 border-t border-line py-14 md:grid md:grid-cols-2 md:items-center md:gap-12 ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal>
              <span className="text-xs uppercase tracking-[0.35em] text-copper">
                {String(i + 1).padStart(2, "0")} · {t(`chapters.${key}.kicker`)}
              </span>
              <h3 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
                {t(`chapters.${key}.headline`)}
              </h3>
              <p className="mt-5 max-w-md text-ink-soft">
                {t(`chapters.${key}.body`)}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line">
                <Image
                  src={STORY_IMAGES[key].src}
                  alt={t(`chapters.${key}.alt`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
