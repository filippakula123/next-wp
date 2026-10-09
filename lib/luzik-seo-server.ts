import "server-only";
import { cache } from "react";
import { unstable_rethrow } from "next/navigation";
import { luzikMetadata } from "./luzik-seo";
import { luzikPages, completedLuzikSlugs, type LuzikPageSlug } from "./luzik-pages";
import { courseHref, coursePresentation } from "./luzik-course-details";
import { luzikCourses } from "./luzik-offer";
import type { LuzikSiteData } from "./luzik-settings";
import { getLuzikSiteData } from "./luzik-settings-server";
import { parseCmsSeo, applyCmsSeo } from "./luzik-cms-seo";
import { blogIndexable, postTitle, postExcerpt, postHref } from "./luzik-blog";
import type { Post } from "./wordpress.d";

export const getCmsSeo = cache(async () => {
  const base = process.env.WORDPRESS_URL;
  if (!base) return undefined;
  try {
    const response = await fetch(new URL("/wp-json/luzik/v1/seo", base), { signal: AbortSignal.timeout(5000), ...(process.env.WORDPRESS_CACHE_DISABLED === "true" ? { cache: "no-store" as const } : { next: { revalidate: 60, tags: ["wordpress", "luzik-seo"] } }) });
    if (!response.ok) throw new Error(`SEO HTTP ${response.status}`);
    const result = parseCmsSeo(await response.json());
    if (!result) throw new Error("Invalid SEO response");
    return result;
  } catch (error) {
    unstable_rethrow(error);
    console.warn("SEO WordPressa niedostępne — używam zapasowych metadanych.");
    return undefined;
  }
});
export async function getLuzikMetadata(title: string, description: string, path: string, image?: string, indexable = true, data?: LuzikSiteData) {
  const cms = await getCmsSeo();
  const base = luzikMetadata(title, description, path, image, indexable, data, !cms?.entries[path.split("?")[0]]);
  return applyCmsSeo(base, cms?.entries[path.split("?")[0]], path);
}
export async function getLuzikPageMetadata(slug: LuzikPageSlug, data?: LuzikSiteData) {
  data ??= await getLuzikSiteData();
  const page = luzikPages[slug], course = luzikCourses.find(course => courseHref(course.id) === `/${slug}`);
  const description = slug === "kontakt" ? `Kontakt ze Szkołą Jazdy Luzik: ${data.contact.address}, ${data.contact.floor}. Telefon ${data.header.phoneLabel}, ${data.header.email}. Biuro czynne ${data.contact.hours}.` : page.description;
  return getLuzikMetadata(page.title, description, `/${slug}`, course ? coursePresentation[course.id].image : undefined, completedLuzikSlugs.includes(slug) && (slug !== "blog" || blogIndexable), data);
}
export async function getPostMetadata(post: Post) {
  const metadata = await getLuzikMetadata(postTitle(post), postExcerpt(post), postHref(post.slug), post._embedded?.["wp:featuredmedia"]?.[0]?.source_url, blogIndexable);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" as const, publishedTime: post.date_gmt + "Z", modifiedTime: post.modified_gmt + "Z" } };
}
