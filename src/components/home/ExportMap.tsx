"use client";

import { useTranslations } from "next-intl";
import {
  EXPORT_DESTINATIONS,
  EXPORT_ORIGIN,
  arcPath,
  landPaths,
  project,
} from "@/data/exportMarkets";

/**
 * Schematic export map. Arcs share the stats counter's 1.4s climb.
 * Reduced motion draws the arcs in their finished position.
 */
export function ExportMap({ play, reduced }: { play: boolean; reduced: boolean }) {
  const t = useTranslations("Export");
  const [ox, oy] = project(EXPORT_ORIGIN.lat, EXPORT_ORIGIN.lon);
  const animate = play && !reduced;

  return (
    <figure className="mx-auto mt-10 max-w-4xl">
      <figcaption className="text-center text-xs uppercase tracking-[0.22em] text-ink">
        {t("title")}
      </figcaption>
      <svg
        viewBox="0 0 1000 500"
        role="img"
        aria-label={t("title")}
        className="mt-4 h-auto w-full text-ink"
        style={{ direction: "ltr" }}
      >
        <defs>
          <marker id="export-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="#8C5A32" />
          </marker>
        </defs>
        <rect width="1000" height="500" fill="transparent" />
        {landPaths().map((d, index) => (
          <path key={index} d={d} fill="currentColor" opacity="0.14" />
        ))}
        {EXPORT_DESTINATIONS.map((destination) => {
          const [x, y] = project(destination.lat, destination.lon);
          const d = arcPath(EXPORT_ORIGIN, destination);
          return (
            <g key={destination.id}>
              <path
                d={d}
                fill="none"
                stroke="#8C5A32"
                strokeWidth="2.5"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={animate ? undefined : 0}
                markerEnd="url(#export-arrow)"
                className={animate ? "export-arc" : undefined}
              />
              <circle cx={x} cy={y} r="6" fill="#8C5A32" />
            </g>
          );
        })}
        <circle cx={ox} cy={oy} r="7" fill="#161601" />
      </svg>
      <p className="mt-2 text-center text-sm font-medium text-ink">
        {t("origin")}
        <span aria-hidden> → </span>
        {EXPORT_DESTINATIONS.map((destination) => t(destination.id)).join(", ")}
      </p>
    </figure>
  );
}
