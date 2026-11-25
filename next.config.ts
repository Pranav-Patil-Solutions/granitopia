import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allowed source for temporary stock imagery (swapped for real assets before go-live).
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      {
        // Spelling fix: Millenium → Millennium. The old slug keeps working.
        source: "/:locale(en|de|ar)/stones/millenium-cream",
        destination: "/:locale/stones/millennium-cream",
        permanent: true,
      },
      {
        source: "/stones/millenium-cream",
        destination: "/en/stones/millennium-cream",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
