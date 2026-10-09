import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import { BlogPage, blogParams, type BlogParams } from "@/components/site/blog-page";
import { JsonLd } from "@/components/site/json-ld";
import { pageSchema } from "@/lib/luzik-seo";
import { getLuzikMetadata } from "@/lib/luzik-seo-server";
import { luzikPages } from "@/lib/luzik-pages";
import { blogIndexable } from "@/lib/luzik-blog";

export const revalidate = 3600;
export async function generateMetadata({ searchParams }: { searchParams: Promise<BlogParams> }) {
  const filter = blogParams(await searchParams);
  const filtered = Boolean(filter.search || filter.category || filter.author || filter.tag);
  return getLuzikMetadata(`${luzikPages.blog.title}${filter.page > 1 ? ` — strona ${filter.page}` : ""}`, luzikPages.blog.description, `/blog${filter.page > 1 ? `?page=${filter.page}` : ""}`, undefined, blogIndexable && !filtered);
}
export default async function Page({ searchParams }: { searchParams: Promise<BlogParams> }) {
  const data = await getLuzikSiteData();
  return <><JsonLd data={pageSchema("blog", data.courses)} /><BlogPage params={await searchParams} /></>;
}
