/**
 * Export map geometry.
 *
 * The site says stone ships to 38+ countries and names Bengaluru as the
 * office. The only country the copy names is Germany (Impressum). There is
 * no list of the other markets, so the map draws that one arc and the
 * counter still reads 38+.
 */
export const EXPORT_ORIGIN = {
  id: "bengaluru",
  lat: 12.9716,
  lon: 77.5946,
} as const;

export const EXPORT_DESTINATIONS = [
  { id: "germany", lat: 51.1657, lon: 10.4515 },
] as const;

export function project(lat: number, lon: number, width = 1000, height = 500) {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y] as const;
}

/** Schematic land rings, lat/lon, drawn as a diagram rather than a dataset. */
const LAND: Array<Array<[number, number]>> = [
  [
    [72, -156], [70, -128], [71, -100], [68, -88], [62, -70], [52, -56],
    [47, -53], [44, -66], [41, -70], [30, -81], [25, -80], [18, -88],
    [21, -105], [26, -112], [32, -117], [40, -124], [49, -126], [58, -138],
    [64, -166],
  ],
  [
    [12, -72], [8, -60], [2, -50], [-8, -35], [-18, -40], [-28, -48],
    [-40, -62], [-52, -70], [-55, -68], [-48, -74], [-30, -72], [-12, -77],
    [-2, -80], [8, -77],
  ],
  [
    [71, 28], [66, 14], [60, 5], [54, -6], [48, -5], [43, -9], [36, -6],
    [36, 3], [38, 16], [36, 28], [41, 29], [46, 38], [55, 30], [64, 28], [70, 32],
  ],
  [
    [37, 10], [32, -6], [28, -14], [16, -17], [8, -10], [4, 9], [-8, 12],
    [-18, 14], [-30, 20], [-35, 26], [-28, 32], [-12, 40], [2, 42], [12, 51],
    [18, 38], [30, 32], [33, 22], [35, 12],
  ],
  [
    [72, 70], [66, 44], [58, 30], [46, 40], [40, 48], [28, 56], [24, 68],
    [22, 72], [8, 77], [15, 80], [23, 88], [8, 98], [1, 104], [12, 109],
    [22, 120], [35, 140], [50, 142], [62, 165], [70, 140], [74, 100], [75, 80],
  ],
  [
    [-12, 131], [-18, 122], [-26, 113], [-35, 117], [-38, 140], [-37, 150],
    [-28, 154], [-14, 146], [-11, 137],
  ],
];

export function landPaths(width = 1000, height = 500): string[] {
  return LAND.map((ring) => {
    const d = ring
      .map(([lat, lon], index) => {
        const [x, y] = project(lat, lon, width, height);
        return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
    return `${d} Z`;
  });
}

export function arcPath(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  width = 1000,
  height = 500,
): string {
  const [x1, y1] = project(from.lat, from.lon, width, height);
  const [x2, y2] = project(to.lat, to.lon, width, height);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.min(90, Math.hypot(x2 - x1, y2 - y1) * 0.28);
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
