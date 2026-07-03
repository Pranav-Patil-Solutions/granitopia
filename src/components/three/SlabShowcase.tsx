"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { featuredStones, type Finish, type Stone } from "@/data/stones";
import { isWebGLAvailable, isHighPerfDevice } from "@/lib/webgl";
import { Reveal } from "@/components/ui/Reveal";
import { MarbleTexture } from "@/components/visual/MarbleTexture";
import type { Lighting } from "./SlabViewer";

const SlabViewer = dynamic(() => import("./SlabViewer"), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
});

const LIGHTINGS: Lighting[] = ["gallery", "showroom", "evening"];

function ViewerSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-copper-bright" />
    </div>
  );
}

function Fallback2D({ stone }: { stone: Stone }) {
  return (
    <div className="relative h-full w-full">
      <MarbleTexture hero={stone.heroColor} vein={stone.veinColor} />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-6">
        <span className="text-xs text-white/80">{stone.name}</span>
      </div>
    </div>
  );
}

export function SlabShowcase() {
  const t = useTranslations("Slab");
  // Default to a warm, veiny stone — it glows on the dark gallery stage
  // (a black slab on near-black reads as a void). Users can pick any stone.
  const [stone, setStone] = useState<Stone>(featuredStones[2]);
  const [finish, setFinish] = useState<Finish>(featuredStones[2].finishes[0]);
  const [lighting, setLighting] = useState<Lighting>("gallery");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [post, setPost] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(isWebGLAvailable());
    setPost(isHighPerfDevice());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function selectStone(s: Stone) {
    setStone(s);
    if (!s.finishes.includes(finish)) setFinish(s.finishes[0]);
  }

  const showViewer = inView && webgl === true;

  return (
    <section
      id="slab"
      className="relative overflow-hidden border-t border-white/10 px-6 py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #241d1a 0%, #1a1512 58%, #141010 100%)",
      }}
    >
      {/* Soft museum spotlight behind the slab */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 30% 42%, rgba(182,112,42,0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        {/* Viewer */}
        <Reveal>
          <div
            ref={ref}
            className="relative h-[420px] overflow-hidden rounded-sm border border-white/10 bg-[#17120f] shadow-2xl md:h-[560px]"
          >
            {showViewer ? (
              <SlabViewer
                stone={stone}
                finish={finish}
                lighting={lighting}
                post={post}
              />
            ) : webgl === false ? (
              <Fallback2D stone={stone} />
            ) : (
              <ViewerSkeleton />
            )}
            <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/50">
              {t("dragHint")}
            </span>
          </div>
        </Reveal>

        {/* Controls */}
        <Reveal delay={0.1}>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-copper-bright">
              {t("eyebrow")}
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-md text-white/70">{t("subtitle")}</p>

            {/* Finish selector */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
                {t("finishLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {stone.finishes.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFinish(f)}
                    aria-pressed={finish === f}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                      finish === f
                        ? "border-copper bg-copper-deep text-white"
                        : "border-white/20 text-white/70 hover:border-copper-bright hover:text-copper-bright"
                    }`}
                  >
                    {t(`finishes.${f}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting selector */}
            <div className="mt-6">
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
                {t("lightingLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {LIGHTINGS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLighting(l)}
                    aria-pressed={lighting === l}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                      lighting === l
                        ? "border-copper bg-copper-deep text-white"
                        : "border-white/20 text-white/70 hover:border-copper-bright hover:text-copper-bright"
                    }`}
                  >
                    {t(`lighting.${l}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stone selector */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-3">
                {featuredStones.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => selectStone(s)}
                    aria-label={s.name}
                    aria-pressed={s.slug === stone.slug}
                    title={s.name}
                    className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                      s.slug === stone.slug
                        ? "border-copper-bright"
                        : "border-white/25"
                    }`}
                    style={{ backgroundColor: s.heroColor }}
                  />
                ))}
              </div>
              <p className="mt-4 font-display text-lg text-white">{stone.name}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
