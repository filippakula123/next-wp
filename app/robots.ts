import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteConfig.site_indexable ? { userAgent: "*", allow: "/", disallow: ["/api/revalidate", "/admin", "/pages/", "/posts/authors", "/posts/categories", "/posts/tags"] } : { userAgent: "*", disallow: "/" },
    ...(siteConfig.site_indexable ? { sitemap: `${siteConfig.site_domain}/sitemap.xml` } : {}),
  };
}
