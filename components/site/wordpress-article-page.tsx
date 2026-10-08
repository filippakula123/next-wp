import type { Post } from "@/lib/wordpress.d";
import { getAllCategories, getPostNeighbours, getPostsPaginated } from "@/lib/wordpress";
import { BlogArticle } from "./blog-article";

export async function WordPressArticlePage({ post }: { post: Post }) {
  const [response, categories, latest, neighbours] = await Promise.all([
    post.categories.length ? getPostsPaginated(1, 4, { category: post.categories.join(",") }) : Promise.resolve({ data: [] }),
    getAllCategories(), getPostsPaginated(1, 4), getPostNeighbours(post),
  ]);
  return <BlogArticle post={post} related={response.data.filter(item => item.id !== post.id).slice(0, 3)} categories={categories} latest={latest.data.filter(item => item.id !== post.id).slice(0, 3)} neighbours={neighbours} />;
}
