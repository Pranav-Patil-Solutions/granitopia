"use client";

import { useId } from "react";
import { shade } from "@/lib/color";

/**
 * High-resolution, resolution-independent marble surface rendered with SVG
 * turbulence + gradients. Sharp at any size (no low-res photos), tinted per stone.
 */
export function MarbleTexture({
  hero,
  vein,
  className,
}: {
  hero: string;
  vein: string;
  className?: string;
}) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const veinId = `v${raw}`;
  const grainId = `g${raw}`;

  const light = shade(hero, 0.28);
  const dark = shade(hero, -0.4);
  const mid = shade(hero, 0.06);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {/* Depth gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 22% 12%, ${light}, transparent 55%),
             radial-gradient(120% 120% at 82% 92%, ${dark}, transparent 60%),
             linear-gradient(135deg, ${mid} 0%, ${hero} 45%, ${dark} 100%)`,
        }}
      />
      {/* Veins + grain */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id={veinId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.013"
              numOctaves="4"
              seed="7"
              result="n"
            />
            {/* luminance -> alpha */}
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0.7 0.7 0 -0.25"
              result="a"
            />
            {/* sharpen noise into vein-like structures */}
            <feComponentTransfer in="a" result="veinAlpha">
              <feFuncA type="gamma" amplitude="1" exponent="3.2" offset="0" />
            </feComponentTransfer>
            <feFlood floodColor={vein} result="c" />
            <feComposite in="c" in2="veinAlpha" operator="in" result="veins" />
            <feGaussianBlur in="veins" stdDeviation="0.5" />
          </filter>
          <filter id={grainId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              result="gn"
            />
            <feColorMatrix
              in="gn"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${veinId})`} opacity="0.55" />
        <rect
          width="100%"
          height="100%"
          filter={`url(#${grainId})`}
          opacity="0.06"
        />
      </svg>
    </div>
  );
}
