import type { Post } from "./wordpress.d";
import { luzikMetadata, publicUrl } from "./luzik-seo";
import { wordpressImageUnoptimized } from "./wordpress-media";

export const blogIndexable = process.env.BLOG_INDEXABLE === "true";
export const postHref = (slug: string) => `/${encodeURIComponent(slug)}`;
export function blogText(html: string) {
  const entities: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ", hellip: "…", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };
  return html.replace(/<[^>]*>/g, " ").replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, code: string) => {
    if (!code.startsWith("#")) return entities[code] ?? match;
    const value = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : match;
  }).replace(/\s+/g, " ").replace(/\s+([,.!?;:])/g, "$1").trim();
}
export const postTitle = (post: Post) => blogText(post.title.rendered);
export const blogCategory = (name: string) => name === "Uncategorized" ? "Bez kategorii" : blogText(name);
export const postExcerpt = (post: Post) => {
  const text = blogText(post.excerpt.rendered || post.content.rendered);
  if (text.length <= 180) return text;
  const cut = text.slice(0, 179), boundary = cut.lastIndexOf(" ");
  return `${cut.slice(0, boundary > 100 ? boundary : cut.length).trimEnd()}…`;
};
export const postDate = (date: string) => new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
export const readingMinutes = (post: Post) => Math.max(1, Math.ceil(blogText(post.content.rendered).split(/\s+/).length / 200));
export function articleHeadings(content: string) {
  const headings: { id: string; title: string; level: number }[] = [];
  const used = new Set(Array.from(content.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi), match => match[1]));
  const html = content.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (heading, level: string, attributes: string, body: string) => {
    const title = blogText(body);
    if (!title) return heading;
    let id = attributes.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!id) {
      const slug = title.toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const base = `sekcja-${slug || "naglowek"}`;
      id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      attributes += ` id="${id}"`;
    }
    headings.push({ id, title, level: Number(level) });
    return `<h${level}${attributes}>${body}</h${level}>`;
  });
  return { html, headings };
}
// Split only between complete Gutenberg blocks, never inside a group or a column.
export function articleSections(html: string) {
  const boundaries: number[] = [];
  let depth = 0;
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  for (const token of html.matchAll(/<!--[\s\S]*?-->|<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
    if (!token[1]) continue;
    const tag = token[1].toLowerCase();
    if (token[0].startsWith("</")) depth = Math.max(0, depth - 1);
    else {
      if (depth === 0 && tag === "h2") boundaries.push(token.index!);
      if (!voidTags.has(tag) && !token[0].endsWith("/>")) depth++;
    }
  }
  const start = boundaries[0] ?? 0;
  const split = boundaries[2] ?? html.length;
  return { intro: html.slice(0, start), beforeCta: html.slice(start, split), afterCta: html.slice(split), showCta: boundaries.length >= 3 && !blogText(html).includes("Szukasz szkoły jazdy, która naprawdę Cię nauczy?") };
}

export function articleLinks(html: string, articleSlugs: string[]) {
  html = html.replace(/<(p|ul|ol)\b[^>]*>\s*(?:<li\b[^>]*>\s*<\/li>\s*)*<\/\1>/gi, "");
  const pkkSlug = "profil-kandydata-na-kierowce-pkk-co-to-jest-i-jak-go-uzyskac";
  if (articleSlugs.includes(pkkSlug)) html = html.replace(/co(?:\s|&nbsp;)+to(?:\s|&nbsp;)+jest(?:\s|&nbsp;)+PKK\s*\(BĘDZIE LINK DO ARTYKUŁU\)/g, `<a href="${postHref(pkkSlug)}">co to jest PKK</a>`);
  return html.replace(/\bhref=(["'])(https?:\/\/(?:www\.)?luzikkielce\.pl\/[^"']*)\1/gi, (attribute, quote: string, href: string) => {
    const url = new URL(href.replace(/&amp;/g, "&"));
    let path = url.pathname.replace(/\/$/, "");
    if (path === "/kursy-prawa-jazdy/jazdy-doszkalajace") path = "/jazdy-doszkalajace";
    const slug = path.slice(1);
    if (articleSlugs.includes(slug)) path = postHref(slug);
    else if (!/^\/(?:kursy-prawa-jazdy(?:-kategorii-[a-z0-9-]+)?|jazdy-doszkalajace|badania-lekarskie-na-prawo-jazdy-kielce|kontakt|o-nas|cennik|galeria|blog|szkola-jazdy-luzik-instruktorzy)$/.test(path)) return attribute;
    return `href=${quote}${path}${url.search.replace(/&/g, "&amp;")}${url.hash}${quote}`;
  });
}
export function postMetadata(post: Post) {
  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const metadata = luzikMetadata(postTitle(post), postExcerpt(post), postHref(post.slug), image, blogIndexable);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" as const, publishedTime: post.date_gmt + "Z", modifiedTime: post.modified_gmt + "Z" } };
}
export function postSchema(post: Post) {
  const url = publicUrl(postHref(post.slug));
  const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const faqs = articleFaqs(post.content.rendered);
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "BlogPosting", "@id": `${url}#article`, url, headline: postTitle(post), description: postExcerpt(post), inLanguage: "pl-PL", datePublished: post.date_gmt + "Z", dateModified: post.modified_gmt + "Z", mainEntityOfPage: url,
      publisher: { "@id": publicUrl("/#school") }, isPartOf: { "@id": publicUrl("/blog#blog") }, articleSection: (post._embedded?.["wp:term"]?.[0] ?? []).map(category => blogCategory(category.name)), wordCount: blogText(post.content.rendered).split(/\s+/).filter(Boolean).length,
      ...(image && !wordpressImageUnoptimized(image) ? { image } : {}),
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Strona główna", item: publicUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: publicUrl("/blog") },
      { "@type": "ListItem", position: 3, name: postTitle(post), item: url },
    ] },
    ...(faqs.length ? [{ "@type": "FAQPage", "@id": `${url}#faq`, isPartOf: { "@id": `${url}#article` }, mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : []),
  ] };
}

export function articleFaqs(html: string) {
  return Array.from(html.matchAll(/<details\b([^>]*)>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi)).flatMap(match => {
    if (!/\bwp-block-details\b/.test(match[1])) return [];
    const question = blogText(match[2]), answer = blogText(match[3]);
    return question.endsWith("?") && answer ? [{ question, answer }] : [];
  });
}
