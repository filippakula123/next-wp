import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { completedLuzikSlugs } from "@/lib/luzik-pages";
import { getAllPostsForSitemap } from "@/lib/wordpress";
import profiles from "@/lib/luzik-profiles.json";

// Blog content enters the sitemap only after real articles replace demo content.
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.site_domain}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];


  const blogReady = process.env.BLOG_INDEXABLE === "true";
  const luzikUrls: MetadataRoute.Sitemap = completedLuzikSlugs.filter(slug => slug !== "blog" || blogReady).map(slug => ({
    url: `${siteConfig.site_domain}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const posts = blogReady ? await getAllPostsForSitemap() : [];
  const postUrls: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${siteConfig.site_domain}/${encodeURIComponent(post.slug)}`,
    ...(Number.isNaN(Date.parse(post.modified)) ? {} : { lastModified: new Date(post.modified) }),
    changeFrequency: "monthly", priority: 0.6,
  }));
  const profileUrls: MetadataRoute.Sitemap = profiles.map(profile => ({ url: `${siteConfig.site_domain}/team/${profile.slug}`, changeFrequency: "monthly", priority: 0.5 }));
  return [...staticUrls, ...luzikUrls, ...profileUrls, ...postUrls];
}
