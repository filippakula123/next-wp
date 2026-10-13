import Image from "@/components/site/static-image";
import { wordpressImageUnoptimized } from "@/lib/wordpress-media";
import Link from "@/components/site/site-link";
import { ArrowRight, BookOpen, Clock3 } from "@/components/site/icons";
import type { Post } from "@/lib/wordpress.d";
import { blogCategory, postDate, postExcerpt, postHref, postTitle, readingMinutes } from "@/lib/luzik-blog";

export function BlogPostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  return <article className={`luzik-blog-card ${featured ? "luzik-blog-featured" : ""}`}>
    <Link href={postHref(post.slug)} className="luzik-blog-card-photo" aria-label={`Czytaj: ${postTitle(post)}`}>
      {media?.source_url ? <Image src={media.source_url} alt={media.alt_text || postTitle(post)} fill sizes={featured ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 100vw, (max-width: 1000px) 50vw, 33vw"} unoptimized={wordpressImageUnoptimized(media.source_url)} loading={featured ? "eager" : "lazy"} /> : <div className="luzik-blog-placeholder"><BookOpen size={64} aria-hidden="true" /><span>Strefa wiedzy kierowcy</span></div>}
      <span className="luzik-blog-category">{blogCategory(category?.name || "Baza wiedzy")}</span>
    </Link>
    <div className="luzik-blog-card-content">
      {featured && <p className="home-eyebrow">Najnowszy artykuł</p>}
      <div className="luzik-blog-meta"><time dateTime={post.date}>{postDate(post.date)}</time><span><Clock3 size={14} aria-hidden="true" />{readingMinutes(post)} min czytania</span></div>
      <h3><Link href={postHref(post.slug)}>{postTitle(post)}</Link></h3>
      <p>{postExcerpt(post)}</p>
      <Link className="luzik-blog-read" href={postHref(post.slug)}>Czytaj artykuł<ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  </article>;
}

