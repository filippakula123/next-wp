import { afterEach, describe, expect, it, vi } from "vitest";
import { luzikPageMetadata, pageSchema } from "@/lib/luzik-seo";
import { luzikCourses } from "@/lib/luzik-offer";
import { serializeJsonLd } from "@/components/site/json-ld";
import sitemap from "@/app/sitemap";
import { getCmsSeo } from "@/lib/luzik-seo-server";
vi.mock("@/lib/luzik-seo-server", () => ({ getCmsSeo: vi.fn(async () => undefined) }));

describe("Luzik search metadata", () => {
  it("excludes a page marked noindex in WordPress from the sitemap", async () => {
    vi.mocked(getCmsSeo).mockResolvedValueOnce({ version: 1, entries: { "/kontakt": { robots: ["noindex"] } } });
    const urls = (await sitemap()).map(entry => entry.url);
    expect(urls).not.toContain("https://luzikkielce.pl/kontakt");
    expect(urls).toContain("https://luzikkielce.pl/galeria");
  });
  it("never publishes localhost canonicals or social image URLs", () => {
    const metadata = luzikPageMetadata("szkola-jazdy-luzik-instruktorzy");
    expect(metadata.alternates?.canonical).toBe("https://luzikkielce.pl/szkola-jazdy-luzik-instruktorzy");
    expect(JSON.stringify(metadata.openGraph)).not.toContain("localhost");
  });
  it("keeps demo blog content out of search results", async () => {
    expect(luzikPageMetadata("blog").robots).toMatchObject({ index: false, follow: true });
    const urls = (await sitemap()).map(entry => entry.url);
    expect(urls).toHaveLength(23);
    expect(urls).toContain("https://luzikkielce.pl/kontakt");
    expect(urls).toContain("https://luzikkielce.pl/galeria");
    expect(urls.some(url => /localhost|\/posts|\/blog$/.test(url))).toBe(false);
  });
  it("matches structured course prices to the visible pricing source", () => {
    const graph = pageSchema("cennik")["@graph"];
    const courses = graph.filter(node => node["@type"] === "Course");
    expect(courses).toHaveLength(6);
    for (const course of luzikCourses) {
      const node = courses.find(n => n.courseCode === (course.id === "b-automat" ? "B automat" : course.category));
      expect(node?.offers).toMatchObject({ price: course.price, priceCurrency: "PLN" });
    }
  });
  it("describes Mariola once even though she appears in two team sections", () => {
    const people = pageSchema("szkola-jazdy-luzik-instruktorzy")["@graph"].filter(node => node["@type"] === "Person");
    expect(people).toHaveLength(7);
    expect(people.filter(person => person.name === "Mariola Jaros")).toHaveLength(1);
  });
  it("cannot terminate a JSON-LD script through content", () => {
    const payload = { name: '</script><script>alert("test")</script>' };
    const serialized = serializeJsonLd(payload);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(payload);
  });
});

describe("preview and public indexing", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
  it("keeps a production build running on localhost unindexed", async () => {
    vi.resetModules(); vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    const { siteConfig } = await import("@/site.config");
    expect(siteConfig.site_indexable).toBe(false);
    expect(siteConfig.site_domain).toBe("https://luzikkielce.pl");
  });
  it("enables the public production website and allows staging to opt out", async () => {
    vi.resetModules(); vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://luzikkielce.pl"); vi.stubEnv("VERCEL_ENV", "production"); vi.stubEnv("SITE_INDEXABLE", "true");
    expect((await import("@/site.config")).siteConfig.site_indexable).toBe(true);
    expect((await import("@/lib/luzik-seo")).luzikPageMetadata("szkola-jazdy-luzik-instruktorzy").robots).toMatchObject({ index: true });
    vi.resetModules(); vi.stubEnv("SITE_INDEXABLE", "false");
    expect((await import("@/site.config")).siteConfig.site_indexable).toBe(false);
  });
});
