import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getPublishedPostBySlug, getPageBySlug } from "@/lib/wordpress";
import { blogText } from "@/lib/luzik-blog";
import { getLuzikMetadata, getPostMetadata } from "@/lib/luzik-seo-server";
import { WordPressDocument } from "@/components/site/wordpress-document";
import { WordPressArticlePage } from "@/components/site/wordpress-article-page";

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  const page = post ? undefined : await getPageBySlug(slug);
  return post ? getPostMetadata(post) : page ? getLuzikMetadata(blogText(page.title.rendered), blogText(page.excerpt.rendered || page.content.rendered).slice(0, 160), `/${slug}`, undefined, false) : {};
}

export default async function WordPressPage({ params }: PageProps) {
  await connection();
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (post) return <WordPressArticlePage post={post} />;
  const page = await getPageBySlug(slug);
  if (page) return <WordPressDocument page={page} />;
  notFound();
}
