import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Szkoła Jazdy Luzik — Kielce", short_name: "Luzik", lang: "pl", description: "Kursy prawa jazdy i poradniki Szkoły Jazdy Luzik w Kielcach.",
    start_url: "/", display: "browser", background_color: "#ffffff", theme_color: "#0075b8",
    icons: [192, 512].map(size => ({ src: `/luzik/brand/icon-${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" })),
  };
}
