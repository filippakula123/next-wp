import { permanentRedirect, notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/wordpress";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = await getCategoryBySlug((await params).slug);
  if (!category) notFound();
  permanentRedirect(`/blog?category=${category.id}`);
}
