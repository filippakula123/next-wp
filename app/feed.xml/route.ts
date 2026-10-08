import { getPostsPaginated } from "@/lib/wordpress";
import { postHref, postTitle, postExcerpt } from "@/lib/luzik-blog";
import { publicUrl } from "@/lib/luzik-seo";
import { siteConfig } from "@/site.config";

export const revalidate = 3600;
const xml = (text: string) => text.replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);
export async function GET() {
  const posts = (await getPostsPaginated(1, 20)).data;
  const items = posts.map(post => `<item><title>${xml(postTitle(post))}</title><link>${xml(publicUrl(postHref(post.slug)))}</link><guid isPermaLink="true">${xml(publicUrl(postHref(post.slug)))}</guid><pubDate>${new Date(`${post.date_gmt}Z`).toUTCString()}</pubDate><description>${xml(postExcerpt(post))}</description></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(siteConfig.site_name)}</title><link>${xml(publicUrl("/blog"))}</link><description>${xml(siteConfig.site_description)}</description><language>pl-PL</language><atom:link href="${xml(publicUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
}
