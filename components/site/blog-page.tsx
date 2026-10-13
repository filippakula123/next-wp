import Link from "@/components/site/site-link";
import { BookOpen, Search, ArrowLeft, ArrowRight } from "@/components/site/icons";
import { getAllCategories, getPostsPaginated } from "@/lib/wordpress";
import { blogCategory } from "@/lib/luzik-blog";
import { SubpageHero, SubpageCta } from "./subpage-hero";
import { BlogPostCard } from "./blog-post-card";

export type BlogParams = { page?: string; search?: string; category?: string; author?: string; tag?: string };
export function blogParams(params: BlogParams) {
  return { page: /^\d{1,6}$/.test(params.page || "") ? Math.max(1, Number(params.page)) : 1,
    search: typeof params.search === "string" ? params.search.trim().slice(0, 200) : "",
    category: /^\d+$/.test(params.category || "") ? params.category : undefined,
    author: /^\d+$/.test(params.author || "") ? params.author : undefined,
    tag: /^\d+$/.test(params.tag || "") ? params.tag : undefined,
  };
}
export async function BlogPage({ params = {} }: { params?: BlogParams }) {
  const filter = blogParams(params);
  const [response, categories] = await Promise.all([getPostsPaginated(filter.page, 9, filter), getAllCategories()]);
  const posts = response.data;
  const filtered = Boolean(filter.search || filter.category || filter.author || filter.tag);
  const featured = filter.page === 1 && !filtered ? posts[0] : undefined;
  const remaining = featured ? posts.slice(1) : posts;
  function pageUrl(page: number) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filter)) if (key !== "page" && value) query.set(key, String(value));
    if (page > 1) query.set("page", String(page));
    return `/blog${query.size ? `?${query}` : ""}#artykuly`;
  }
  const pages = Array.from(new Set([1, filter.page - 1, filter.page, filter.page + 1, response.headers.totalPages])).filter(page => page >= 1 && page <= response.headers.totalPages).sort((a,b) => a-b);
  return <main id="main-content" className="luzik-blog-page">
    <SubpageHero eyebrow="Strefa wiedzy kierowcy" breadcrumb="Blog" title={<>Blog.<br /><span>Wiedza na dobrą drogę.</span></>}
      description="Witamy na naszym blogu, który jest połączeniem bazy wiedzy i aktualności. To właśnie tutaj publikujemy ciekawe i przydatne informacje związane z naszą ofertą oraz nauką jazdy."
      action={{ href: "#artykuly", label: "Przeglądaj artykuły" }}
      visual={<div className="luzik-blog-hero-visual"><BookOpen size={70} aria-hidden="true" /><p>Na dobry początek</p><strong>Więcej wiedzy.<br />Więcej pewności<br />za kierownicą.</strong><span>Nauka jazdy · Egzamin · Aktualności</span></div>} />
    <section id="artykuly" className="home-section luzik-blog-section" aria-labelledby="blog-title"><div className="luzik-container">
      <div className="luzik-section-topline"><div><p className="home-eyebrow">Baza wiedzy i aktualności</p><h2 id="blog-title" className="home-title">{filtered ? "Wyniki wyszukiwania" : "Zanim ruszysz w drogę"}</h2></div><p>Przeczytaj. Przygotuj się. Jedź na luzie.</p></div>
      <form action="/blog#artykuly" method="get" className="luzik-blog-search" role="search" aria-label="Wyszukaj artykuły">
        <label><span>Szukaj na blogu</span><div><Search size={19} aria-hidden="true" /><input name="search" type="search" defaultValue={filter.search} placeholder="Wpisz temat lub słowo…" maxLength={200} /></div></label>
        <label><span>Kategoria</span><select name="category" defaultValue={filter.category || ""}><option value="">Wszystkie kategorie</option>{categories.filter(c => c.count > 0).map(c => <option key={c.id} value={c.id}>{blogCategory(c.name)}</option>)}</select></label>
        <button className="home-button" type="submit">Szukaj<ArrowRight size={17} aria-hidden="true" /></button>
        {filtered && <Link href="/blog#artykuly" className="luzik-blog-clear">Wyczyść filtry</Link>}
      </form>
      <p className="luzik-blog-results" role="status">{response.headers.total} artykułów{filter.search && <> dla „{filter.search}”</>}</p>
      {featured && <BlogPostCard post={featured} featured />}
      {remaining.length > 0 && <div className="luzik-blog-grid">{remaining.map(post => <BlogPostCard post={post} key={post.id} />)}</div>}
      {posts.length === 0 && <div className="luzik-blog-empty"><BookOpen size={38} aria-hidden="true" /><h3>{filtered ? "Nie znaleźliśmy pasujących artykułów" : filter.page > 1 ? "Na tej stronie nie ma artykułów" : "Kolejne artykuły już wkrótce"}</h3><p>{filtered ? "Spróbuj innego hasła lub wybierz wszystkie kategorie." : "Masz pytanie o naukę jazdy? Porozmawiaj z naszym zespołem."}</p><Link href={filtered || filter.page > 1 ? "/blog#artykuly" : "/kontakt"}>{filtered || filter.page > 1 ? "Zobacz wszystkie artykuły" : "Skontaktuj się z nami"}</Link></div>}
      {response.headers.totalPages > 1 && <nav className="luzik-blog-pagination" aria-label="Strony bloga">
        {filter.page > 1 && <Link href={pageUrl(filter.page-1)} aria-label="Poprzednia strona"><ArrowLeft size={18} /></Link>}
        {pages.map((page,index) => <span key={page}>{index > 0 && page - pages[index-1] > 1 && <span className="luzik-blog-ellipsis">…</span>}<Link href={pageUrl(page)} aria-current={page === filter.page ? "page" : undefined} aria-label={`Strona ${page}`}>{page}</Link></span>)}
        {filter.page < response.headers.totalPages && <Link href={pageUrl(filter.page+1)} aria-label="Następna strona"><ArrowRight size={18} /></Link>}
      </nav>}
    </div></section><SubpageCta />
  </main>;
}
