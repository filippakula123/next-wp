import { postHref } from "@/lib/luzik-blog";
import { permanentRedirect } from "next/navigation";

export const revalidate = 3600;
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  permanentRedirect(postHref((await params).slug));
}
