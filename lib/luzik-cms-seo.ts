import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { wordpressImageUnoptimized } from "./wordpress-media";

export type CmsSeoEntry = {
  title?: string; description?: string; socialTitle?: string; socialDescription?: string;
  socialImage?: string; twitterTitle?: string; twitterDescription?: string; twitterImage?: string;
  canonical?: string; robots?: string[];
};
export type CmsSeo = { version: 1; entries: Record<string, CmsSeoEntry> };

const text = (value: unknown, limit: number) => typeof value === "string" && value.length <= limit ? value.replace(/<[^>]*>/g, "").trim() : undefined;
const imageUrl = (value: unknown) => {
  if (typeof value !== "string" || !value.trim() || value.length > 2000) return undefined;
  try { const url = new URL(value, siteConfig.site_domain); return ["https:", "http:"].includes(url.protocol) && !wordpressImageUnoptimized(url.toString()) ? url.toString() : undefined; } catch { return undefined; }
};
export function parseCmsSeo(input: unknown): CmsSeo | undefined {
  if (!input || typeof input !== "object") return undefined;
  const candidate = input as Record<string, unknown>;
  if (candidate.version !== 1 || !candidate.entries || typeof candidate.entries !== "object" || Array.isArray(candidate.entries)) return undefined;
  const entries: Record<string, CmsSeoEntry> = {};
  for (const [path, value] of Object.entries(candidate.entries)) {
    if (!path.startsWith("/") || path.startsWith("//") || /[?#\s]/.test(path) || !value || typeof value !== "object" || Array.isArray(value)) continue;
    const entry = value as Record<string, unknown>;
    entries[path] = { title: text(entry.title, 1000), description: text(entry.description, 5000), socialTitle: text(entry.socialTitle, 1000), socialDescription: text(entry.socialDescription, 5000), socialImage: imageUrl(entry.socialImage), twitterTitle: text(entry.twitterTitle, 1000), twitterDescription: text(entry.twitterDescription, 5000), twitterImage: imageUrl(entry.twitterImage), canonical: text(entry.canonical, 2000), robots: Array.isArray(entry.robots) ? entry.robots.filter((item): item is string => typeof item === "string" && ["index", "noindex", "follow", "nofollow", "noarchive", "nosnippet", "noimageindex"].includes(item)) : [] };
  }
  return { version: 1, entries };
}
export function applyCmsSeo(metadata: Metadata, entry: CmsSeoEntry | undefined, path: string): Metadata {
  if (!entry) return metadata;
  const page = Number(new URL(path, siteConfig.site_domain).searchParams.get("page"));
  const suffix = path.split("?")[0] === "/blog" && Number.isSafeInteger(page) && page > 1 ? ` — strona ${page}` : "";
  const title = entry.title ? entry.title + suffix : undefined;
  const robots = typeof metadata.robots === "object" && metadata.robots ? metadata.robots : {};
  const baseCanonical = metadata.alternates?.canonical;
  let canonical = baseCanonical && typeof baseCanonical === "object" && !(baseCanonical instanceof URL) ? baseCanonical.url : baseCanonical;
  if (entry.canonical) {
    try {
      const url = new URL(entry.canonical, siteConfig.site_domain);
      // A CMS permalink on a separate/local host must never become the public canonical.
      if (url.origin === siteConfig.site_domain && ["http:", "https:"].includes(url.protocol)) canonical = url.toString();
    } catch { /* Keep the verified public URL. */ }
  }
  const ogTitle = entry.socialTitle ? entry.socialTitle + suffix : title;
  const ogDescription = entry.socialDescription || entry.description;
  return { ...metadata, ...(title ? { title: { absolute: title } } : {}), ...(entry.description ? { description: entry.description } : {}), alternates: { ...metadata.alternates, canonical },
    robots: { ...robots, index: robots.index === true && !entry.robots?.includes("noindex"), follow: !entry.robots?.includes("nofollow"), noarchive: entry.robots?.includes("noarchive"), nosnippet: entry.robots?.includes("nosnippet"), noimageindex: entry.robots?.includes("noimageindex") },
    openGraph: { ...metadata.openGraph, ...(canonical ? { url: canonical } : {}), ...(ogTitle ? { title: ogTitle } : {}), ...(ogDescription ? { description: ogDescription } : {}), ...(entry.socialImage ? { images: [{ url: entry.socialImage, alt: entry.socialTitle || entry.title || "Szkoła Jazdy Luzik" }] } : {}) },
    twitter: { ...metadata.twitter, ...(entry.twitterTitle || ogTitle ? { title: entry.twitterTitle ? entry.twitterTitle + suffix : ogTitle } : {}), ...(entry.twitterDescription || ogDescription ? { description: entry.twitterDescription || ogDescription } : {}), ...(entry.twitterImage || entry.socialImage ? { images: [entry.twitterImage || entry.socialImage!] } : {}) },
  };
}
