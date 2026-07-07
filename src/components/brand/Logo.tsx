"use client";

import { useId } from "react";

/**
 * Granitopia brand logo — a faithful, scalable recreation of the printed card.
 *
 * The card mark is a three-hexagon "honeycomb" of real stone, next to the
 * "Granitopia." serif wordmark and the "Utopia of natural stones" tagline.
 * Rebuilt here as vector + live type so it stays retina-crisp at any size,
 * flips cleanly between light/dark (colours inherit `currentColor`), and needs
 * no cut-out image asset.
 *
 * ── Loop-engineered hex brief (per AGENTS.md) ─────────────────────────────
 * ONE tile spec, looped over three stones. Each tile = a flat-top hexagon
 * clipping a real product photo from /public/images/stones, with a solid
 * fallback tint (shows instantly before the photo loads) and a hairline
 * outline in `currentColor`. Swap a `src` to re-skin a hex; the geometry,
 * clipping, fallback and stroke all follow automatically.
 *   • left   → warm veined marble   (kashmir-gold)
 *   • top    → black speckled granite (black-galaxy)
 *   • bottom → grey flowing stone     (elegant-grey)
 * Every stone was opened and matched to the card before wiring in.
 * ──────────────────────────────────────────────────────────────────────────
 */

// Hexagon layout units (SVG viewBox space). SPACING_R positions the centres;
// HEX_R draws each hexagon slightly smaller so a thin gap reads between them,
// exactly like the printed card.
const SPACING_R = 24;
const HEX_R = 22.5;
const ROW = Math.sqrt(3) * SPACING_R; // vertical step between stacked hexes
const COL = 1.5 * SPACING_R; // horizontal step between columns
const TOP = { x: 60, y: 28 }; // top-right hex centre; everything else derives

type HexTile = {
  stone: string;
  src: string;
  fallback: string; // instant tint before the photo paints
  label: string;
};

const HEX_TILES: readonly (HexTile & { cx: number; cy: number })[] = [
  {
    stone: "kashmir-gold",
    src: "/images/stones/kashmir-gold.jpg",
    fallback: "#d8c6a4",
    label: "veined marble",
    cx: TOP.x - COL,
    cy: TOP.y + ROW / 2,
  },
  {
    stone: "black-galaxy",
    src: "/images/stones/black-galaxy.jpg",
    fallback: "#1b1b1b",
    label: "black granite",
    cx: TOP.x,
    cy: TOP.y,
  },
  {
    stone: "elegant-grey",
    src: "/images/stones/elegant-grey.jpg",
    fallback: "#8b8a86",
    label: "grey stone",
    cx: TOP.x,
    cy: TOP.y + ROW,
  },
];

/** Flat-top hexagon vertices as an SVG points string. */
function hexPoints(cx: number, cy: number, r: number): string {
  const h = (Math.sqrt(3) / 2) * r;
  return [
    [cx + r, cy],
    [cx + r / 2, cy - h],
    [cx - r / 2, cy - h],
    [cx - r, cy],
    [cx - r / 2, cy + h],
    [cx + r / 2, cy + h],
  ]
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

/** The three-hexagon stone mark, on its own. */
export function LogoMark({ className }: { className?: string }) {
  const uid = useId();
  return (
    <svg
      viewBox="1 8 82 82"
      className={className}
      role="img"
      aria-label="Granitopia"
      fill="none"
    >
      {HEX_TILES.map((tile, i) => {
        const pts = hexPoints(tile.cx, tile.cy, HEX_R);
        const h = (Math.sqrt(3) / 2) * HEX_R;
        const clipId = `${uid}-hex-${i}`;
        return (
          <g key={tile.stone}>
            <clipPath id={clipId}>
              <polygon points={pts} />
            </clipPath>
            {/* instant tint + real stone photo, clipped to the hex */}
            <polygon points={pts} fill={tile.fallback} />
            <image
              href={tile.src}
              x={tile.cx - HEX_R}
              y={tile.cy - h}
              width={HEX_R * 2}
              height={h * 2}
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
            {/* hairline outline — inherits theme colour */}
            <polygon
              points={pts}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.22}
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}

/** The "Granitopia." serif wordmark (+ optional tagline), colour via currentColor. */
export function LogoWordmark({
  tagline = false,
  className,
}: {
  tagline?: boolean;
  className?: string;
}) {
  return (
    // dir="ltr": the brand name + English tagline are Latin, so keep them
    // left-to-right even inside RTL (/ar) — otherwise the trailing period in
    // "Granitopia." bidi-flips to the wrong side. Nav placement (logo on the
    // right in RTL) is unaffected; only the text's internal direction is fixed.
    <span dir="ltr" className={className}>
      <span className="font-display font-medium leading-none tracking-[-0.01em]">
        Granitopia.
      </span>
      {tagline && (
        <span className="mt-1 block font-display text-[0.34em] font-normal leading-none tracking-[0.02em] opacity-70">
          Utopia of natural stones
        </span>
      )}
    </span>
  );
}

type LogoVariant = "lockup" | "full" | "mark" | "wordmark";

/**
 * Composed logo.
 *  • lockup   → mark + wordmark inline (nav)
 *  • full     → mark + wordmark stacked over tagline (footer / hero)
 *  • mark     → hexagons only
 *  • wordmark → type only
 *
 * Colour follows `currentColor`/text colour on the wrapper, so pass e.g.
 * `text-ink` (default via layout), `text-white`, or `text-copper`.
 */
export function Logo({
  variant = "lockup",
  className,
  markClassName,
  wordmarkClassName,
}: {
  variant?: LogoVariant;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  if (variant === "mark") {
    return <LogoMark className={markClassName ?? "h-9 w-9"} />;
  }
  if (variant === "wordmark") {
    return (
      <LogoWordmark
        className={`inline-flex flex-col ${className ?? ""}`}
        tagline
      />
    );
  }

  const stacked = variant === "full";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark
        className={markClassName ?? (stacked ? "h-12 w-12" : "h-9 w-9")}
      />
      <LogoWordmark
        tagline={stacked}
        className={`flex flex-col ${
          wordmarkClassName ?? (stacked ? "text-[1.9rem]" : "text-[1.4rem]")
        }`}
      />
    </span>
  );
}
