/** Lighten (amt > 0) or darken (amt < 0) a hex color. amt in -1..1. */
export function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  if (amt >= 0) {
    r = Math.round(r + (255 - r) * amt);
    g = Math.round(g + (255 - g) * amt);
    b = Math.round(b + (255 - b) * amt);
  } else {
    const a = 1 + amt;
    r = Math.round(r * a);
    g = Math.round(g * a);
    b = Math.round(b * a);
  }
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
