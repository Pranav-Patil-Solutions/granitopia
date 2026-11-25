import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Default share card, reused by opengraph-image and twitter-image in every
 * locale. Latin wordmark on purpose: the brand lockup is Latin, and the
 * bundled Geist file has no Arabic glyphs. Page titles and descriptions
 * stay localized in the meta tags.
 *
 * Brief: a 1200×630 card in the site's warm charcoal and copper, with the
 * wordmark, the existing tagline, and the published Bengaluru export line.
 * No invented awards, addresses, or prices.
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = "Granitopia — Utopia of Natural Stones";

export async function renderBrandOg() {
  const font = await readFile(
    join(
      process.cwd(),
      "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
    ),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#3e3333",
          color: "#f6f3ee",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 128,
            height: 6,
            background: "#d98b45",
            marginBottom: 40,
          }}
        />
        <div style={{ display: "flex", fontSize: 84, lineHeight: 1 }}>
          Granitopia
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 34,
            color: "#d98b45",
          }}
        >
          Utopia of Natural Stones
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            color: "#e4e0d9",
          }}
        >
          Natural stone exporter · Bengaluru
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Geist",
          data: font,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
