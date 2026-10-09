import { describe, expect, it, vi, afterEach } from "vitest";
import { articleHeadings, articleSections, articleLinks, articleFaqs, blogText, postSchema, postMetadata, readingMinutes } from "@/lib/luzik-blog";
import type { Post } from "@/lib/wordpress.d";
vi.mock("@/lib/luzik-seo-server", () => ({ getCmsSeo: vi.fn(async () => undefined) }));

const post = { id: 1, slug: "nauka-jazdy", title: { rendered: "Kurs &amp; egzamin" }, excerpt: { rendered: "<p>Porady dla kierowców.</p>" }, content: { rendered: "<p>Przykładowa treść artykułu.</p>" }, date_gmt: "2026-10-08T08:00:00", modified_gmt: "2026-10-08T09:00:00", _embedded: { author: [{ name: "Autor" }] } } as Post;

describe("Blog SEO and WordPress content", () => {
  it("adds FAQ markup only for actual question and answer details blocks", () => {
    const html = '<details class="wp-block-details"><summary>Czy muszę dodać FAQ?</summary><p>Nie, <strong>jest opcjonalne</strong>.</p></details>';
    expect(articleFaqs(html)).toEqual([{ question: "Czy muszę dodać FAQ?", answer: "Nie, jest opcjonalne." }]);
    const withFaq = { ...post, content: { rendered: html, protected: false } };
    expect(postSchema(withFaq)["@graph"].some(node => node["@type"] === "FAQPage")).toBe(true);
    expect(postSchema(post)["@graph"].some(node => node["@type"] === "FAQPage")).toBe(false);
    expect(articleFaqs('<details class="wp-block-details"><summary>Informacja dodatkowa</summary><p>Treść</p></details>')).toEqual([]);
  });
  it("places the promotion between complete sections and preserves all WordPress content", () => {
    const html = '<p>Wstęp</p><h2>Pierwsza</h2><p>Treść<img src="photo.jpg" /></p><h2>Druga</h2><div><h2>Zagnieżdżony</h2><p>Grupa</p></div><h2>Trzecia</h2><p>Koniec</p>';
    const result = articleSections(html);
    expect(result.intro).toBe('<p>Wstęp</p>');
    expect(result.afterCta).toBe('<h2>Trzecia</h2><p>Koniec</p>');
    expect(result.intro + result.beforeCta + result.afterCta).toBe(html);
    expect(result.showCta).toBe(true);
    expect(articleSections('<div><h2>W grupie</h2></div>').showCta).toBe(false);
    expect(articleSections(html + '<h3>Szukasz szkoły jazdy, która naprawdę Cię nauczy?</h3>').showCta).toBe(false);
  });
  it("keeps migrated links on the new site without changing external or unmigrated articles", () => {
    const html = '<a href="https://luzikkielce.pl/kursy-prawa-jazdy/jazdy-doszkalajace/">Jazdy</a><a href="https://luzikkielce.pl/pkk/">PKK</a><a href="https://luzikkielce.pl/stary-artykul/">Stary</a><a href="https://example.com/">Inna strona</a>';
    const result = articleLinks(html, ["pkk"]);
    expect(result).toContain('href="/jazdy-doszkalajace"');
    expect(result).toContain('href="/pkk"');
    expect(result).toContain('href="https://luzikkielce.pl/stary-artykul/"');
    expect(result).toContain('href="https://example.com/"');
    expect(blogText(result)).toBe(blogText(html));
    const pkkSlug = "profil-kandydata-na-kierowce-pkk-co-to-jest-i-jak-go-uzyskac";
    expect(articleLinks('<p>Opisywaliśmy co to jest PKK (BĘDZIE LINK DO ARTYKUŁU).</p>', [pkkSlug])).toBe(`<p>Opisywaliśmy <a href="/${pkkSlug}">co to jest PKK</a>.</p>`);
  });
  it("creates Polish heading anchors, preserves existing anchors and avoids collisions", () => {
    const source = '<p id="sekcja-zolc">Wstęp</p><h2>Żółć</h2><h3>Żółć</h3><h2 id="moj-naglowek"><strong>Kurs &amp; egzamin</strong></h2>';
    const result = articleHeadings(source);
    expect(result.headings).toEqual([{ id: "sekcja-zolc-2", title: "Żółć", level: 2 }, { id: "sekcja-zolc-3", title: "Żółć", level: 3 }, { id: "moj-naglowek", title: "Kurs & egzamin", level: 2 }]);
    expect(blogText(result.html)).toBe(blogText(source));
    expect(result.html).toContain('<h2 id="moj-naglowek"><strong>Kurs &amp; egzamin</strong></h2>');
    expect(articleHeadings("<p>Bez nagłówków</p>").headings).toEqual([]);
  });
  afterEach(() => { vi.unstubAllEnvs(); });
  it("decodes WordPress titles without preserving HTML", () => {
    expect(blogText("<h2>Kurs &amp; egzamin &#8212; &#x142;atwo</h2>")).toBe("Kurs & egzamin — łatwo");
  });
  it("publishes canonical article metadata with real dates and noindex for demo posts", () => {
    const metadata = postMetadata(post);
    expect(metadata.alternates?.canonical).toBe("https://luzikkielce.pl/nauka-jazdy");
    expect(metadata.robots).toMatchObject({ index: false });
    const schema = postSchema(post)["@graph"][0];
    expect(schema).toMatchObject({ "@type": "BlogPosting", headline: "Kurs & egzamin", datePublished: "2026-10-08T08:00:00Z", dateModified: "2026-10-08T09:00:00Z" });
    expect(readingMinutes(post)).toBe(1);
  });
  it("adds published article URLs to the sitemap only when blog indexing is enabled", async () => {
    vi.stubEnv("BLOG_INDEXABLE", "true");
    const wordpress = await import("@/lib/wordpress");
    const spy = vi.spyOn(wordpress, "getAllPostsForSitemap").mockResolvedValue([{ slug: "nauka-jazdy", modified: "2026-10-08T09:00:00Z" }]);
    const sitemap = (await import("@/app/sitemap")).default;
    try {
      const entries = await sitemap();
      expect(entries.some(entry => entry.url === "https://luzikkielce.pl/blog")).toBe(true);
      expect(entries.find(entry => entry.url.endsWith("/nauka-jazdy"))?.lastModified).toEqual(new Date("2026-10-08T09:00:00Z"));
    } finally { spy.mockRestore(); }
  });
});

