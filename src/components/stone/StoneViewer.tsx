"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { isWebGLAvailable } from "@/lib/webgl";
import type { Finish, Stone } from "@/data/stones";
import { MarbleTexture } from "@/components/visual/MarbleTexture";

const SlabViewer = dynamic(() => import("@/components/three/SlabViewer"), {
  ssr: false,
  loading: () => <Skeleton />,
});

function Skeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-copper" />
    </div>
  );
}

function Fallback2D({ stone }: { stone: Stone }) {
  return (
    <div className="relative h-full w-full">
      <MarbleTexture hero={stone.heroColor} vein={stone.veinColor} />
    </div>
  );
}

/** Single-stone interactive 3D viewer with finish switching (detail page). */
export function StoneViewer({ stone }: { stone: Stone }) {
  const t = useTranslations("Slab");
  const [finish, setFinish] = useState<Finish>(stone.finishes[0]);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWebgl(isWebGLAvailable());
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

  const show = inView && webgl === true;

  return (
    <div>
      <div
        ref={ref}
        className="relative h-[380px] overflow-hidden rounded-sm border border-line bg-paper-2 md:h-[520px]"
      >
        {show ? (
          <SlabViewer stone={stone} finish={finish} />
        ) : webgl === false ? (
          <Fallback2D stone={stone} />
        ) : (
          <Skeleton />
        )}
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          {t("dragHint")}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {stone.finishes.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFinish(f)}
            aria-pressed={finish === f}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
              finish === f
                ? "border-copper bg-copper text-white"
                : "border-line text-ink-soft hover:border-copper hover:text-copper"
            }`}
          >
            {t(`finishes.${f}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
