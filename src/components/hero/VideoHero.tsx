"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/fx/Magnetic";
import { useReducedMotion } from "@/lib/motion";

/**
 * Home hero. Cinematic background video (real quarry-to-showroom footage) with
 * a slow scroll-driven Ken-Burns scale, a kinetic word-reveal headline and the
 * quote CTA. A poster paints instantly and the video fades in once it can play,
 * so the footage never blocks first paint.
 */
export function VideoHero() {
  const t = useTranslations("Hero");
  const nav = useTranslations("Nav");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Belt-and-braces autoplay: some browsers ignore the autoPlay attribute on
  // hydration, so we also call play() once the element mounts.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("loadeddata", tryPlay, { once: true });
    return () => v.removeEventListener("loadeddata", tryPlay);
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, reduced ? 1 : 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  // Gentle veil that layers on as the hero scrolls away (brief §6).
  const veil = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 0.35]);

  const words = [
    { text: t("titleLine1"), accent: false },
    { text: t("titleAccent"), accent: true },
  ];

  const meta = ["Natural stone", "Granite · Marble · Exotics", "38+ countries"];

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Cinematic background video — real quarry-to-showroom footage, so the
          hero shows what Granitopia actually does. Poster paints instantly; the
          film fades in once it can play so the heavier file never blocks first
          paint.
          TODO(asset): drop the final on-brand quarry/factory cut at
          /public/media/hero.mp4 (16:9, muted, ~10–20s loop) to replace this. */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/media/banners/banner.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        {/* Layered scrim: lifts contrast behind the headline, lets the image
            breathe at the edges. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 85% at 50% 42%, rgba(255,255,255,0.58), rgba(255,255,255,0.34) 48%, rgba(255,255,255,0.18) 100%)",
          }}
        />
        <div className="bg-vignette absolute inset-0" />
        <div className="hero-grain absolute inset-0" />
      </motion.div>

      {/* Scroll-driven veil */}
      <motion.div
        style={{ opacity: veil }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-paper"
      />

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 px-6 text-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.4em] text-copper-deep"
        >
          {t("eyebrow")}
        </motion.p>

        {/* Kinetic word-reveal headline */}
        <h1 className="mt-6 font-display text-6xl leading-[0.92] text-ink drop-shadow-[0_2px_16px_rgba(255,255,255,0.5)] md:text-[8.5rem]">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className={`inline-block ${w.accent ? "italic text-copper" : ""}`}
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {w.text}
              </motion.span>
              {i === 0 ? " " : ""}
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto mt-8 max-w-xl text-ink-soft md:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <Link
              href="/contact"
              className="inline-block rounded-full bg-copper-deep px-7 py-3 text-sm font-medium uppercase tracking-widest text-white transition-transform hover:scale-105"
            >
              {nav("quote")}
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/collections"
              className="inline-block rounded-full border border-copper px-7 py-3 text-sm font-medium uppercase tracking-widest text-copper-deep transition-colors hover:bg-copper-deep hover:text-white"
            >
              {nav("collections")}
            </Link>
          </Magnetic>
        </div>

        {/* Film-style metadata line */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          {meta.map((m, i) => (
            <span key={m} className="flex items-center gap-4">
              {i > 0 && <span className="text-copper">◆</span>}
              {m}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <div className="mx-auto mb-2 flex h-9 w-5 justify-center rounded-full border border-ink/25 pt-1.5">
          <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-copper" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          {t("scrollCue")}
        </p>
      </div>
    </section>
  );
}
