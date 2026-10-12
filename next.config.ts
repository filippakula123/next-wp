import type { NextConfig } from "next";
import { legacyPaths } from "./lib/luzik-redirects";
import { metadataCrawlerPattern } from "./lib/luzik-crawlers";
import imageRedirects from "./lib/luzik-image-redirects.json";

const wordpressUrlValue = process.env.WORDPRESS_URL;

if (!wordpressUrlValue) {
  throw new Error("Brakuje WORDPRESS_URL w pliku .env.local");
}

const wordpressUrl = new URL(wordpressUrlValue);
const isDevelopment = process.env.NODE_ENV === "development";

if (
  wordpressUrl.protocol !== "http:" &&
  wordpressUrl.protocol !== "https:"
) {
  throw new Error("WORDPRESS_URL musi używać http lub https");
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  htmlLimitedBots: metadataCrawlerPattern,
  images: {
    dangerouslyAllowLocalIP: isDevelopment,
    remotePatterns: [
      {
        protocol: wordpressUrl.protocol === "https:" ? "https" : "http",
        hostname: wordpressUrl.hostname,
        port: wordpressUrl.port,
        pathname: "/wp-content/uploads/**",
        search: "",
      },
    ],
  },

  async redirects() {
    return [
      { source: "/icon.svg", destination: "/icon.png", permanent: true },
      ...Object.entries(imageRedirects).map(([source, destination]) => ({ source, destination, permanent: true })),
      ...Object.entries(legacyPaths).map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/feed", destination: "/feed.xml", permanent: true },
      {
        source: "/admin",
        destination: new URL("/wp-admin", wordpressUrl).toString(),
        permanent: false,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ] }];
  },
};

export default nextConfig;
