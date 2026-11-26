"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { isWebGLAvailable } from "@/lib/webgl";
import type { Finish, Stone } from "@/data/stones";
const SlabViewer = dynamic(() => import("@/components/three/SlabViewer"), {
  ssr: false,
});

/** Photograph by default. The 3D slab loads only after a large-screen request. */
export function StoneViewer({ stone }: { stone: Stone }) {
  const t = useTranslations("Slab");
  const [finish, setFinish] = useState<Finish>(stone.finishes[0]);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const [phone, setPhone] = useState(true);
  const [show3d, setShow3d] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setPhone(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(isWebGLAvailable());
    return () => mq.removeEventListener("change", apply);
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

  const show = show3d && inView && webgl === true && !phone;

  return (
    <div>
      <div
        ref={ref}
        className="relative h-[68vw] max-h-[720px] min-h-[280px] overflow-hidden bg-paper-2 sm:h-[420px] lg:h-[560px]"
      >
        {show ? (
          <SlabViewer stone={stone} finish={finish} />
        ) : (
          <button type="button" className="absolute inset-0" onClick={() => setOpen(true)} aria-label={stone.name}>
            <Image
              src={stone.image}
              alt={stone.name}
              fill
              priority
              quality={75}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </button>
        )}
        {!phone && show3d && (
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            {t("dragHint")}
          </span>
        )}
      </div>
      {open && (
        <dialog
          open
          className="fixed inset-0 z-[80] m-0 h-full max-h-none w-full max-w-none bg-ink/92 p-6"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <button type="button" className="absolute right-4 top-4 min-h-11 px-3 text-2xl text-paper" onClick={() => setOpen(false)} aria-label={t("viewPhoto")}>
            ×
          </button>
          <img src={stone.image} alt={stone.name} className="mx-auto h-full max-h-[90svh] object-contain" />
        </dialog>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {!phone && webgl && (
          <button
            type="button"
            onClick={() => setShow3d((v) => !v)}
            className="min-h-11 rounded-full border border-ink px-4 text-xs uppercase tracking-widest text-ink"
          >
            {show3d ? t("viewPhoto") : t("viewSlab")}
          </button>
        )}
        {show3d &&
          !phone &&
          stone.finishes.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFinish(f)}
              aria-pressed={finish === f}
              className={`min-h-11 rounded-full border px-4 text-xs uppercase tracking-widest transition-colors ${
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
