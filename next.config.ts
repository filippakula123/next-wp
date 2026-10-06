import type { NextConfig } from "next";

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
      {
        source: "/admin",
        destination: new URL("/wp-admin", wordpressUrl).toString(),
        permanent: false,
      },
    ];
  },
};

export default nextConfig;