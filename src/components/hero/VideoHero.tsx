"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/fx/Magnetic";
import { useReducedMotion } from "@/lib/motion";

export function VideoHero() {
  const t = useTranslations("Hero");
  const nav = useTranslations("Nav");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [filmOpen, setFilmOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, reduced ? 1 : 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);
  // Gentle veil that layers on as the hero scrolls away (brief §6).
  const veil = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 0.35]);

  // Accessible modal: focus trap, Escape to close, scroll lock, focus return.
  useEffect(() => {
    if (!filmOpen) return;
    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setFilmOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const nodes = dialog.querySelectorAll<HTMLElement>(
        'button, [href], video, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (triggerRef.current ?? prevActive)?.focus?.();
    };
  }, [filmOpen]);

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
      {/* Cinematic background video (real footage) */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          poster="/media/banners/banner.jpg"
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/media/marble-texture.mp4" type="video/mp4" />
        </video>
        {/* Layered scrim: lifts contrast behind the headline, lets the footage
            breathe at the edges (replaces the flat 55% wash). */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 85% at 50% 42%, rgba(255,255,255,0.74), rgba(255,255,255,0.46) 48%, rgba(255,255,255,0.30) 100%)",
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
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setFilmOpen(true)}
              className="flex items-center gap-3 text-sm uppercase tracking-widest text-ink transition-colors hover:text-copper-deep"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-copper text-copper-deep"
              >
                ▶
              </span>
              {t("watchFilm")}
            </button>
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

      {/* Film modal — real quarry footage */}
      {filmOpen && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-dark/90 px-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("watchFilm")}
          onClick={() => setFilmOpen(false)}
        >
          <div
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-sm border border-white/10 bg-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="h-full w-full object-cover"
              src="/media/hero.mp4"
              controls
              autoPlay
              playsInline
            />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setFilmOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-2xl text-white/80 hover:text-copper"
              aria-label={nav("close")}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
