import "server-only";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { buildLuzikSiteData } from "./luzik-settings";

export const getLuzikSiteData = cache(async () => {
  const base = process.env.WORDPRESS_URL;
  if (!base) return buildLuzikSiteData();
  try {
    const localNoCache = process.env.WORDPRESS_CACHE_DISABLED === "true";
    const response = await fetch(new URL("/wp-json/luzik/v1/settings", base), {
      ...(localNoCache
        ? { cache: "no-store" as const, signal: AbortSignal.timeout(5000) }
        : { next: { revalidate: 60, tags: ["wordpress", "luzik-settings"] } }),
    });
    if (!response.ok) throw new Error(`Settings endpoint HTTP ${response.status}`);
    return buildLuzikSiteData(await response.json());
  } catch (error) {
    unstable_rethrow(error);
    console.warn("Ustawienia Luzik niedostępne — używam wartości zapasowych.");
    return buildLuzikSiteData();
  }
});
