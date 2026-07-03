"use client";

import * as THREE from "three";
import { useEffect, useMemo } from "react";
import type { Finish, Stone } from "@/data/stones";
import { shade } from "@/lib/color";

/**
 * Procedurally-derived PBR stone surface: a crisp albedo, a *real* normal map
 * (Sobel-derived from a height field of the same veining) and a finish-driven
 * roughness map — so the veining reads as genuine depth, not a printed decal.
 *
 * TODO(assets): when scanned maps land, drop
 *   /public/images/stones/<slug>/{albedo,normal,roughness,displacement}.jpg
 * and load them here in place of the generated canvases — the material rig
 * (clearcoat / anisotropy / transmission / env) stays identical.
 */

const ALBEDO = 1024;
const MAP = 512; // normal + roughness (lower-freq, cheaper)

/* deterministic RNG so the same stone always veins the same way */
function seededRng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Vein = { pts: [number, number][]; w: number; a: number; color: string };

/** One set of vein paths, scale-independent (0..1), rendered onto every map. */
function buildVeins(rng: () => number, hero: string, vein: string): Vein[] {
  const light = shade(vein, 0.4);
  const out: Vein[] = [];
  const add = (
    count: number,
    w: [number, number],
    a: [number, number],
    color: string,
  ) => {
    for (let i = 0; i < count; i++) {
      let x = rng();
      let y = rng();
      const pts: [number, number][] = [[x, y]];
      const steps = 5 + Math.floor(rng() * 5);
      for (let s = 0; s < steps; s++) {
        x += (rng() - 0.5) * 0.5;
        y += (rng() - 0.5) * 0.5;
        pts.push([x, y]);
      }
      out.push({
        pts,
        w: w[0] + rng() * (w[1] - w[0]),
        a: a[0] + rng() * (a[1] - a[0]),
        color,
      });
    }
  };
  add(10, [6, 16], [0.03, 0.09], vein);
  add(26, [0.5, 2.5], [0.05, 0.18], vein);
  add(14, [0.4, 1.4], [0.05, 0.14], light);
  return out;
}

function strokeVein(
  ctx: CanvasRenderingContext2D,
  v: Vein,
  size: number,
  color: string,
  alpha: number,
  widthScale = 1,
) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = v.w * widthScale;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  const p = v.pts;
  ctx.moveTo(p[0][0] * size, p[0][1] * size);
  for (let i = 1; i < p.length - 1; i++) {
    const cx = p[i][0] * size;
    const cy = p[i][1] * size;
    const nx = ((p[i][0] + p[i + 1][0]) / 2) * size;
    const ny = ((p[i][1] + p[i + 1][1]) / 2) * size;
    ctx.quadraticCurveTo(cx, cy, nx, ny);
  }
  ctx.stroke();
}

function makeCanvas(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

/* ---- Albedo (colour) ---- */
function drawAlbedo(hero: string, vein: string, veins: Vein[]): HTMLCanvasElement {
  const c = makeCanvas(ALBEDO);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = hero;
  ctx.fillRect(0, 0, ALBEDO, ALBEDO);

  const g = ctx.createLinearGradient(0, 0, ALBEDO, ALBEDO);
  g.addColorStop(0, "rgba(255,255,255,0.06)");
  g.addColorStop(0.5, "rgba(0,0,0,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0.04)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ALBEDO, ALBEDO);

  for (const v of veins) strokeVein(ctx, v, ALBEDO, v.color, v.a, ALBEDO / 512);

  ctx.globalAlpha = 1;
  for (let i = 0; i < ALBEDO * 10; i++) {
    ctx.fillStyle =
      Math.random() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.09)";
    ctx.fillRect(Math.random() * ALBEDO, Math.random() * ALBEDO, 1, 1);
  }
  return c;
}

/* ---- Height field (grayscale) → source for normal + roughness ---- */
function drawHeight(veins: Vein[]): HTMLCanvasElement {
  const c = makeCanvas(MAP);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080"; // mid = flat
  ctx.fillRect(0, 0, MAP, MAP);
  // veins recess (darker); bright light-veins raise slightly
  for (const v of veins) {
    const raised = v.color !== undefined && v.a < 0.09 && v.w < 2;
    strokeVein(
      ctx,
      v,
      MAP,
      raised ? "#b8b8b8" : "#3a3a3a",
      Math.min(0.5, v.a * 3),
      1,
    );
  }
  // micro speckle for tactile grain
  ctx.globalAlpha = 1;
  for (let i = 0; i < MAP * 6; i++) {
    const s = Math.random() > 0.5 ? 150 : 105;
    ctx.fillStyle = `rgb(${s},${s},${s})`;
    ctx.fillRect(Math.random() * MAP, Math.random() * MAP, 1, 1);
  }
  return c;
}

/** Sobel height → tangent-space normal map. */
function heightToNormal(height: HTMLCanvasElement, strength: number): HTMLCanvasElement {
  const size = height.width;
  const hctx = height.getContext("2d")!;
  const h = hctx.getImageData(0, 0, size, size).data;
  const out = makeCanvas(size);
  const octx = out.getContext("2d")!;
  const img = octx.createImageData(size, size);
  const d = img.data;
  const L = (x: number, y: number) => {
    const xi = (x + size) % size;
    const yi = (y + size) % size;
    return h[(yi * size + xi) * 4] / 255;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        L(x - 1, y - 1) + 2 * L(x - 1, y) + L(x - 1, y + 1) -
        (L(x + 1, y - 1) + 2 * L(x + 1, y) + L(x + 1, y + 1));
      const dy =
        L(x - 1, y - 1) + 2 * L(x, y - 1) + L(x + 1, y - 1) -
        (L(x - 1, y + 1) + 2 * L(x, y + 1) + L(x + 1, y + 1));
      let nx = dx * strength;
      let ny = dy * strength;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      const i = (y * size + x) * 4;
      d[i] = (nx * 0.5 + 0.5) * 255;
      d[i + 1] = (ny * 0.5 + 0.5) * 255;
      d[i + 2] = (nz / len) * 255;
      d[i + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  return out;
}

/** Height → roughness variation (veins slightly rougher than the polished field). */
function heightToRoughness(height: HTMLCanvasElement): HTMLCanvasElement {
  const size = height.width;
  const hctx = height.getContext("2d")!;
  const src = hctx.getImageData(0, 0, size, size);
  const out = makeCanvas(size);
  const octx = out.getContext("2d")!;
  const img = octx.createImageData(size, size);
  for (let i = 0; i < src.data.length; i += 4) {
    // deviation from mid-gray (either recessed vein or raised) → rougher
    const dev = Math.abs(src.data[i] - 128) / 128;
    const r = Math.min(1, 0.35 + dev * 0.9);
    const v = r * 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  octx.putImageData(img, 0, 0);
  return out;
}

function tex(
  canvas: HTMLCanvasElement,
  srgb: boolean,
): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.anisotropy = 8;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  return t;
}

/* per-finish surface parameters (maps stay the same; only the surface morphs) */
export const FINISH_PARAMS: Record<
  Finish,
  {
    roughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
    anisotropy: number;
    normalScale: number;
    env: number;
  }
> = {
  polished: { roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.09, anisotropy: 0, normalScale: 0.35, env: 1.35 },
  honed: { roughness: 0.42, clearcoat: 0.18, clearcoatRoughness: 0.35, anisotropy: 0.45, normalScale: 0.6, env: 0.9 },
  leathered: { roughness: 0.62, clearcoat: 0.06, clearcoatRoughness: 0.5, anisotropy: 0.5, normalScale: 0.9, env: 0.6 },
  flamed: { roughness: 0.82, clearcoat: 0, clearcoatRoughness: 0.6, anisotropy: 0.15, normalScale: 1.05, env: 0.4 },
};

/** Stones that let light bleed through (subsurface / transmission). */
const TRANSLUCENT = new Set(["crystallo-divine"]);

/**
 * Physical stone material. Maps are generated once per stone; changing the
 * finish only morphs surface params, so the finish selector is cheap.
 */
export function useStoneMaterial(stone: Stone, finish: Finish) {
  const material = useMemo(() => {
    const rng = seededRng(stone.slug || stone.heroColor);
    const veins = buildVeins(rng, stone.heroColor, stone.veinColor);
    const albedo = tex(drawAlbedo(stone.heroColor, stone.veinColor, veins), true);
    const height = drawHeight(veins);
    const normal = tex(heightToNormal(height, 2.4), false);
    const rough = tex(heightToRoughness(height), false);

    const translucent = TRANSLUCENT.has(stone.slug);
    const m = new THREE.MeshPhysicalMaterial({
      map: albedo,
      normalMap: normal,
      roughnessMap: rough,
      metalness: 0,
      envMapIntensity: 1.2,
      // nonzero at construction so the clearcoat/anisotropy shader features
      // compile in — the finish selector + story morph then drive them live.
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      anisotropy: 0.2,
      transmission: translucent ? 0.9 : 0,
      thickness: translucent ? 1.4 : 0,
      ior: 1.5,
      attenuationColor: new THREE.Color(stone.heroColor),
      attenuationDistance: translucent ? 2.2 : Infinity,
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stone.slug, stone.heroColor, stone.veinColor]);

  // Morph surface params on finish change (no texture regen).
  useEffect(() => {
    const p = FINISH_PARAMS[finish];
    material.roughness = p.roughness;
    material.clearcoat = p.clearcoat;
    material.clearcoatRoughness = p.clearcoatRoughness;
    material.anisotropy = p.anisotropy;
    material.envMapIntensity = p.env;
    material.normalScale.set(p.normalScale, p.normalScale);
    material.needsUpdate = true;
  }, [material, finish]);

  useEffect(() => {
    return () => {
      material.map?.dispose();
      material.normalMap?.dispose();
      material.roughnessMap?.dispose();
      material.dispose();
    };
  }, [material]);

  return material;
}
