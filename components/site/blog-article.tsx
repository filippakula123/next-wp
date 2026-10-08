import { getLuzikSiteData } from "@/lib/luzik-settings-server";
import Image from "next/image";
import { wordpressImageUnoptimized } from "@/lib/wordpress-media";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Clock3, Phone, Search } from "lucide-react";
import type { Category, Post } from "@/lib/wordpress.d";
import { articleHeadings, articleSections, articleLinks, blogCategory, postDate, postHref, postSchema, postTitle, readingMinutes } from "@/lib/luzik-blog";
import { JsonLd } from "./json-ld";
import { BlogPostCard } from "./blog-post-card";

export async function BlogArticle({ post, related, categories, latest, neighbours }: { post: Post; related: Post[]; categories: Category[]; latest: Post[]; neighbours: { previous?: Post; next?: Post } }) {
  const { header: luzikHeaderData } = await getLuzikSiteData();
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const content = articleHeadings(articleLinks(post.content.rendered, [post.slug, ...related.map(item => item.slug), ...latest.map(item => item.slug)]));
  const sections = articleSections(content.html);
  return <main id="main-content" className="luzik-blog-page">
    <JsonLd data={postSchema(post)} />
    <header className="luzik-article-hero"><div className="luzik-container">
      <nav className="luzik-breadcrumbs" aria-label="Ścieżka nawigacji"><Link href="/">Strona główna</Link><ChevronRight size={14} aria-hidden="true" /><Link href="/blog">Blog</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Artykuł</span></nav>
      <p className="home-eyebrow">{category ? <Link href={`/blog?category=${category.id}#artykuly`}>{blogCategory(category.name)}</Link> : "Strefa wiedzy kierowcy"}</p>
      <h1>{postTitle(post)}</h1>
      <div className="luzik-blog-meta"><time dateTime={post.date}>{postDate(post.date)}</time><span><Clock3 size={15} aria-hidden="true" />{readingMinutes(post)} min czytania</span></div>
      {media?.source_url && <div className="luzik-article-photo"><Image src={media.source_url} alt={media.alt_text || postTitle(post)} width={media.media_details?.width || 1200} height={media.media_details?.height || 700} sizes="(max-width: 767px) 100vw, 1200px" unoptimized={wordpressImageUnoptimized(media.source_url)} loading="eager" fetchPriority="high" /></div>}
    </div></header>
    <section className="home-section luzik-article-section"><div className="luzik-container luzik-article-layout">
      <article className="luzik-article-body" aria-label={postTitle(post)}>
        {sections.intro && <div dangerouslySetInnerHTML={{ __html: sections.intro }} />}
        {content.headings.length > 1 && <details className="luzik-article-toc" open>
          <summary>Spis treści</summary>
          <nav aria-label="Spis treści artykułu"><ol>{content.headings.map(heading => <li key={heading.id} className={heading.level === 3 ? "luzik-toc-subheading" : undefined}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ol></nav>
        </details>}
        <div dangerouslySetInnerHTML={{ __html: sections.beforeCta }} />
        {sections.showCta && <aside className="luzik-article-promo" aria-label="Zapisy do szkoły jazdy Luzik">
          <div className="luzik-article-promo-photo"><Image src="/luzik/courses/intro.jpg" alt="Zespół instruktorów szkoły jazdy Luzik w Kielcach" fill sizes="(max-width: 767px) 100vw, 280px" /></div>
          <div className="luzik-article-promo-content"><span className="home-eyebrow">Szkoła Jazdy Luzik</span><h2>Szukasz szkoły jazdy, która naprawdę Cię nauczy?</h2><p>Dołącz do kursantów Luzik — profesjonalnie, bez stresu, w Kielcach.</p><Link href="/kontakt" className="home-button">Zapisz się<ArrowRight size={17} aria-hidden="true" /></Link></div>
        </aside>}
        {sections.afterCta && <div dangerouslySetInnerHTML={{ __html: sections.afterCta }} />}
        {(neighbours.previous || neighbours.next) && <nav className="luzik-article-neighbours" aria-label="Poprzedni i następny wpis">
          {neighbours.previous && <Link href={postHref(neighbours.previous.slug)} rel="prev"><span><ArrowLeft size={16} aria-hidden="true" />Poprzedni wpis</span><strong>{postTitle(neighbours.previous)}</strong></Link>}
          {neighbours.next && <Link href={postHref(neighbours.next.slug)} rel="next"><span>Następny wpis<ArrowRight size={16} aria-hidden="true" /></span><strong>{postTitle(neighbours.next)}</strong></Link>}
        </nav>}
      </article>
      <aside className="luzik-article-sidebar" aria-label="Narzędzia bloga i nauka jazdy">
        <form action="/blog#artykuly" method="get" role="search" className="luzik-article-search" aria-label="Wyszukaj na blogu"><label htmlFor="article-search">Wyszukaj artykuł</label><div><input id="article-search" name="search" type="search" placeholder="Temat lub słowo kluczowe…" maxLength={200} required /><button type="submit" aria-label="Szukaj"><Search size={20} aria-hidden="true" /></button></div></form>
        {categories.some(item => item.count > 0) && <nav className="luzik-article-categories" aria-label="Kategorie bloga"><h2>Kategorie</h2><ul>{categories.filter(item => item.count > 0).map(item => <li key={item.id}><Link href={`/blog?category=${item.id}#artykuly`}>{blogCategory(item.name)}<span>{item.count}</span></Link></li>)}</ul></nav>}
        <div className="luzik-article-aside"><p className="home-eyebrow">Od wiedzy do praktyki</p><h2>Twój kurs.<br />Twój Luzik.</h2><p>Chcesz przygotować się do egzaminu lub poczuć się pewniej za kierownicą? Poznaj nasze kursy.</p><Link href="/kursy-prawa-jazdy" className="home-button">Zobacz kursy<ArrowRight size={17} aria-hidden="true" /></Link><a href={luzikHeaderData.phoneHref}><Phone size={17} aria-hidden="true" />{luzikHeaderData.phoneLabel}</a></div>
        {latest.length > 0 && <nav className="luzik-article-latest" aria-label="Najnowsze wpisy"><h2>Najnowsze wpisy</h2>{latest.map(item => <Link key={item.id} href={postHref(item.slug)}><time dateTime={item.date}>{postDate(item.date)}</time><strong>{postTitle(item)}</strong></Link>)}</nav>}
      </aside>
    </div><div className="luzik-container"><Link href="/blog" className="luzik-blog-back"><ArrowLeft size={18} aria-hidden="true" />Wróć do wszystkich artykułów</Link></div></section>
    {related.length > 0 && <section className="home-section luzik-blog-section" aria-labelledby="related-title"><div className="luzik-container"><p className="home-eyebrow">Czytaj dalej</p><h2 id="related-title" className="home-title">Więcej wiedzy na drogę</h2><div className="luzik-blog-grid">{related.map(item => <BlogPostCard key={item.id} post={item} />)}</div></div></section>}
  </main>;
}

