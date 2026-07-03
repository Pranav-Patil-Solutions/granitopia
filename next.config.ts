import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allowed source for temporary stock imagery (swapped for real assets before go-live).
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
