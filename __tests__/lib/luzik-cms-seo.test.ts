import { describe, expect, it } from "vitest";
import { applyCmsSeo, parseCmsSeo } from "@/lib/luzik-cms-seo";
import { luzikMetadata } from "@/lib/luzik-seo";

describe("WordPress SEO precedence and validation", () => {
  it("uses edited CMS text, preserves the original H1 independently and clears old overrides", () => {
    const fallback = luzikMetadata("Tytuł strony", "Automatyczny opis", "/kontakt", undefined, true, undefined, false);
    const changed = applyCmsSeo(fallback, { title: "Nowy tytuł SEO", description: "Nowy opis SEO" }, "/kontakt");
    expect(changed.title).toEqual({ absolute: "Nowy tytuł SEO" });
    expect(changed.openGraph).toMatchObject({ title: "Nowy tytuł SEO", description: "Nowy opis SEO" });
    expect(applyCmsSeo(fallback, { title: "", description: "" }, "/kontakt").description).toBe("Automatyczny opis");
  });
  it("keeps previews unindexed even if WordPress requests indexing", () => {
    const base = luzikMetadata("Tytuł", "Opis", "/kontakt");
    expect(applyCmsSeo(base, { robots: ["index", "nofollow"] }, "/kontakt").robots).toMatchObject({ index: false, follow: false });
    expect(applyCmsSeo({ robots: { index: true, follow: true } }, { robots: ["noindex"] }, "/kontakt").robots).toMatchObject({ index: false });
  });
  it("rejects local CMS canonicals and gives paginated blog pages distinct titles", () => {
    const base = luzikMetadata("Blog", "Opis", "/blog?page=2", undefined, true, undefined, false);
    const metadata = applyCmsSeo(base, { title: "Blog Luzika", canonical: "http://next-wp.local/blog" }, "/blog?page=2");
    expect(metadata.title).toEqual({ absolute: "Blog Luzika — strona 2" });
    expect(metadata.alternates?.canonical).toBe("https://luzikkielce.pl/blog?page=2");
  });
  it("validates the response contract and rejects executable URLs", () => {
    expect(parseCmsSeo([])).toBeUndefined();
    expect(parseCmsSeo({ version: 1, entries: [] })).toBeUndefined();
    const data = parseCmsSeo({ version: 1, entries: { "/kontakt": { title: "<b>Kontakt</b>", socialImage: "javascript:alert(1)", robots: ["noindex", "invalid", 1] }, "//bad": { title: "Nie" } } });
    expect(data?.entries["/kontakt"]).toMatchObject({ title: "Kontakt", socialImage: undefined, robots: ["noindex"] });
    expect(data?.entries["//bad"]).toBeUndefined();
    expect(parseCmsSeo({ version: 1, entries: { "/": { socialImage: "", twitterImage: "http://next-wp.local/photo.jpg" } } })?.entries["/"]).toMatchObject({ socialImage: undefined, twitterImage: undefined });
  });
});
