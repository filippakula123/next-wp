// Audit rendered SEO/AIO without reading or changing the sitemap.
import { writeFile } from "node:fs/promises";
const base = new URL(process.argv[2] || "http://localhost:3001");
const cms = new URL(process.argv[3] || "http://next-wp.local");
const publicOrigin = "https://luzikkielce.pl";
const report = { checkedAt: new Date().toISOString(), base: base.origin, scope: "SEO/AIO; sitemap excluded", pages: [], errors: [], advisories: [], botChecks: [], redirects: [] };
const decode = value => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, " ");
const text = html => decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m => [m[1].toLowerCase(), decode(m[3])]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(m => attributes(m[0]));
const get = async (path, ua = "Googlebot", redirect = "follow") => {
  // The local CMS can have a small PHP worker pool; this is a crawl, not a load test.
  await new Promise(resolve => setTimeout(resolve, 200));
  const response = await fetch(new URL(path, base), { headers: { "User-Agent": ua }, redirect, signal: AbortSignal.timeout(30000) });
  return { response, html: await response.text() };
};
const seoResponse = await fetch(new URL("/wp-json/luzik/v1/seo", cms));
if (!seoResponse.ok) throw Error("CMS SEO endpoint unavailable");
const seo = await seoResponse.json();
const posts = await fetch(new URL("/wp-json/wp/v2/posts?per_page=100&_embed=true", cms)).then(r => r.json());
const postMap = new Map(posts.map(p => ["/" + p.slug, p]));
const routes = new Set(Object.keys(seo.entries));
routes.add("/blog");
const htmlByPath = new Map();
const images = new Set();
const links = [];
const duplicates = { titles: new Map(), descriptions: new Map() };
for (const path of routes) {
  const { response, html } = await get(path);
  htmlByPath.set(path, html);
  const head = html.split("</head>")[0];
  const meta = tags(head, "meta");
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map(m => text(m[1]));
  const descriptions = meta.filter(m => m.name === "description").map(m => m.content);
  const canonicals = tags(head, "link").filter(t => t.rel === "canonical").map(t => t.href);
  const robots = meta.find(m => m.name === "robots")?.content || "";
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => text(m[1]));
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
  const errors = [];
  if (response.status !== 200) errors.push("HTTP " + response.status);
  if (titles.length !== 1 || !titles[0]) errors.push("Missing/duplicate head title");
  if (descriptions.length !== 1 || !descriptions[0]) errors.push("Missing/duplicate meta description");
  if (canonicals.length !== 1 || new URL(canonicals[0], base).origin !== publicOrigin) errors.push("Missing/duplicate/non-public canonical");
  if (canonicals.length === 1 && new URL(canonicals[0]).pathname !== path) errors.push("Canonical points to another path");
  if (h1.length !== 1 || !h1[0]) errors.push("Missing/duplicate H1");
  if (!/<html\b[^>]*lang="pl"/.test(html)) errors.push("Missing Polish language declaration");
  if (text(main).split(/\s+/).length < 30) errors.push("Main content missing from server HTML");
  if (!robots) errors.push("Missing robots metadata");
  if (seo.entries[path]?.robots?.includes("noindex") && !robots.includes("noindex")) errors.push("CMS noindex not respected");
  for (const property of ["og:title", "og:description", "og:url", "og:image"]) if (!meta.some(m => m.property === property && m.content)) errors.push("Missing " + property);
  if (!meta.some(m => m.name === "twitter:card" && m.content === "summary_large_image")) errors.push("Missing Twitter card");
  if (/%(?:title|sitename|sep|excerpt|page|luzik_[a-z_]+)%|BĘDZIE LINK|docelową treść i układ odtworzymy/.test(text(main) + titles.join(" ") + descriptions.join(" "))) errors.push("Unresolved template/editor placeholder");
  const graph = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const data = JSON.parse(match[1]); graph.push(...(data["@graph"] || [data])); } catch { errors.push("Invalid JSON-LD"); }
  }
  if (!graph.some(n => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]).includes("LocalBusiness"))) errors.push("Missing school entity");
  if (!graph.some(n => n["@type"] === "WebSite")) errors.push("Missing website entity");
  const article = graph.find(n => n["@type"] === "BlogPosting");
  if (postMap.has(path)) {
    if (!article) errors.push("Missing BlogPosting");
    else {
      if (article.headline !== h1[0]) errors.push("Schema headline differs from visible H1");
      if ([article.datePublished, article.dateModified].some(d => Number.isNaN(Date.parse(d)))) errors.push("Invalid article dates");
      if (article.mainEntityOfPage !== canonicals[0]) errors.push("Article schema canonical mismatch");
      if (!article.image) report.advisories.push({ path, issue: "Article image omitted from schema while CMS is local; verify after public media migration." });
    }
  }
  const faq = graph.find(n => n["@type"] === "FAQPage");
  if (faq) for (const item of faq.mainEntity) {
    if (!text(main).includes(item.name) || !text(main).includes(item.acceptedAnswer.text)) errors.push("FAQ schema does not match visible text");
  }
  const imgs = tags(main, "img");
  if (imgs.some(img => !("alt" in img))) errors.push("Image without alt attribute");
  // Next/Image fill cards reserve their ratio in CSS rather than img attributes.
  // Require intrinsic dimensions for images inside the raw WordPress article.
  const articleBody = main.match(/<article\b[^>]*class="luzik-article-body"[^>]*>([\s\S]*?)<\/article>/)?.[1] || "";
  for (const img of tags(articleBody, "img")) if (img.src?.includes("/wp-content/uploads/")) {
    if (!img.width || !img.height) errors.push("CMS image without layout dimensions");
    if (!img.loading) errors.push("CMS image without loading strategy");
  }
  for (const m of meta.filter(m => ["og:image"].includes(m.property))) images.add(m.content);
  for (const a of tags(html, "a")) {
    if (!a.href) continue;
    let url; try { url = new URL(a.href, new URL(path, base)); } catch { continue; }
    if (![base.origin, publicOrigin, "https://www.luzikkielce.pl"].includes(url.origin)) continue;
    if (/^\/(?:api|_next|wp-admin|wp-json|wp-content)\b/.test(url.pathname)) continue;
    links.push({ source: path, path: url.pathname, hash: url.hash, query: url.pathname === "/blog" && url.searchParams.has("page") ? "?page=" + url.searchParams.get("page") : "" });
  }
  for (const [name, value] of [["titles", titles[0]], ["descriptions", descriptions[0]]]) {
    if (!value) continue;
    const map = duplicates[name]; if (!map.has(value)) map.set(value, []); map.get(value).push(path);
  }
  if (titles[0]?.length > 70) report.advisories.push({ path, issue: "Long preserved SEO title", characters: titles[0].length });
  if (descriptions[0]?.length > 180) report.advisories.push({ path, issue: "Long preserved description", characters: descriptions[0].length });
  report.pages.push({ path, status: response.status, title: titles[0], description: descriptions[0], canonical: canonicals[0], robots, h1: h1[0], words: text(main).split(/\s+/).length, schema: graph.map(n => n["@type"]), errors });
  report.errors.push(...errors.map(issue => ({ path, issue })));
}
for (const [name, map] of Object.entries(duplicates)) for (const [value, paths] of map) if (paths.length > 1) report.advisories.push({ issue: "Duplicate " + name, paths, value });
for (const image of images) {
  const url = new URL(image);
  const target = url.origin === publicOrigin ? new URL(url.pathname, base) : url;
  const response = await fetch(target, { signal: AbortSignal.timeout(30000) });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) report.errors.push({ path: image, issue: "Social image not accessible as an image" });
  await response.arrayBuffer();
}
const internalTargets = new Set(links.map(l => l.path + l.query));
for (const path of internalTargets) {
  if (htmlByPath.has(path)) continue;
  const { response, html } = await get(path);
  if (response.status !== 200) report.errors.push({ path, issue: "Internal link HTTP " + response.status });
  htmlByPath.set(path, html);
}
for (const link of links) if (link.hash) {
  const id = decodeURIComponent(link.hash.slice(1));
  if (!htmlByPath.get(link.path + link.query)?.includes(`id="${id}"`)) report.errors.push({ path: link.source, issue: "Broken fragment: " + link.path + link.hash });
}
for (const path of routes) if (path !== "/" && !links.some(link => link.path === path && link.source !== path)) report.errors.push({ path, issue: "No incoming internal link" });
for (const ua of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "facebookexternalhit"]) {
  const { response, html } = await get("/kontakt", ua);
  const head = html.split("</head>")[0];
  const ok = response.status === 200 && head.includes("<title>") && head.includes('name="description"') && head.includes('property="og:image"') && /<h1\b/.test(html);
  report.botChecks.push({ ua, completeHeadAndContent: ok });
  if (!ok) report.errors.push({ path: "/kontakt", issue: "Incomplete crawler head: " + ua });
}
for (const path of ["/blog?search=egzamin", "/blog?category=1", "/blog?page=2"]) {
  const { response, html } = await get(path);
  const robots = tags(html, "meta").find(m => m.name === "robots")?.content;
  if (response.status !== 200) report.errors.push({ path, issue: "Blog variant HTTP " + response.status });
  if (path.includes("search=") || path.includes("category=")) { if (!robots?.includes("noindex")) report.errors.push({ path, issue: "Search/filter not noindex" }); }
  if (path.includes("page=2") && !html.includes("strona 2")) report.errors.push({ path, issue: "Pagination missing distinct title" });
}
for (const path of ["/pages/kontakt", "/posts/" + posts[0].slug, "/posts/authors", "/feed"]) {
  const { response } = await get(path, "Googlebot", "manual");
  report.redirects.push({ path, status: response.status, target: response.headers.get("location") });
  if (response.status !== 308) report.errors.push({ path, issue: "Legacy redirect not permanent" });
}
const missing = await get("/__seo-audit-nieistniejaca-strona");
if (missing.response.status !== 404) report.errors.push({ path: "/__seo-audit-nieistniejaca-strona", issue: "Missing page not HTTP 404" });
report.summary = { pages: report.pages.length, posts: posts.length, internalTargets: internalTargets.size, socialImages: images.size, botChecks: report.botChecks.length, errors: report.errors.length, advisories: report.advisories.length };
await writeFile(".seo-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ summary: report.summary, errors: report.errors, advisories: report.advisories.filter(a => !a.issue.startsWith("Article image")) }, null, 2));
if (report.errors.length) process.exitCode = 1;
