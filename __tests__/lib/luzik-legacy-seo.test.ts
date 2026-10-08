import { describe, expect, it } from "vitest";
import { legacySeo } from "@/lib/luzik-legacy-seo";
import { buildLuzikSiteData } from "@/lib/luzik-settings";
import { luzikMetadata, luzikPageMetadata } from "@/lib/luzik-seo";
import { articleLinks } from "@/lib/luzik-blog";

describe("Rank Math migration", () => {
  it("preserves saved titles without adding the brand twice", () => {
    const metadata = luzikMetadata("Nowy tytuł", "Opis", "/");
    expect(metadata.title).toEqual({ absolute: "Szkoła Jazdy Kielce Luzik - nauka na prawo jazdy Kielce!" });
    expect(metadata.openGraph).toMatchObject({ title: "Szkoła Jazdy Kielce Luzik - nauka na prawo jazdy Kielce!" });
    expect(legacySeo("/o-nas", "Nowy tytuł", "Opis").title).toBe("O nas");
    expect(legacySeo("/blog?page=2", "Blog — strona 2", "Opis").title).toBe("Blog — strona 2");
  });
  it("uses current CMS prices in the original SEO copy", () => {
    const data = buildLuzikSiteData({ price_b: 4100, lesson_b: 160, lesson_b_automat: 170 });
    expect(luzikPageMetadata("kursy-prawa-jazdy-kategorii-b", data).description).toContain("4100 zł");
    expect(luzikPageMetadata("jazdy-doszkalajace", data).description).toContain("160 zł/h (manual) i 170 zł/h (automat)");
  });
  it("repairs copied social descriptions that belonged to a different article", () => {
    const seo = legacySeo("/kiss-and-ride-k-r-przepisy-znaki-postoj-mandat", "Kiss and Ride", "Opis");
    expect(seo.socialTitle).toBe(seo.title);
    expect(seo.socialDescription).toBe(seo.description);
    expect(seo.socialImage).toContain("/luzik/blog-social/");
    expect(legacySeo("/polityka-prywatnosci", "Polityka", "Opis").indexable).toBe(false);
  });
  it("normalizes malformed imported links and retains their anchors", () => {
    const html = '<a href="https://luzikkielce.pl/kurs-prawa-jazdy-kategorii-b-automat/#zapisy">Kurs</a>';
    expect(articleLinks(html, [])).toBe('<a href="/kursy-prawa-jazdy-kategorii-b-automat#zapisy">Kurs</a>');
  });
});
