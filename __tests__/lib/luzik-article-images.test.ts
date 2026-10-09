import { describe, expect, it } from "vitest";
import { articleImages } from "@/lib/luzik-article-images";
import sizes from "@/lib/luzik-blog-image-sizes.json";

describe("imported article image layout", () => {
  it("reserves the measured image ratio after CMS host migration", () => {
    const [path, dimensions] = Object.entries(sizes)[0];
    const html = `<p>Oryginalny tekst</p><img src="https://cms.luzikkielce.pl${path}" alt="Opis ilustracji" />`;
    const result = articleImages(html);
    expect(result).toContain(`width="${dimensions.width}" height="${dimensions.height}"`);
    expect(result).toContain('loading="lazy" decoding="async"');
    expect(result).toContain('<p>Oryginalny tekst</p>');
    expect(result).toContain('alt="Opis ilustracji"');
  });
  it("keeps editor dimensions and deliberate eager loading", () => {
    const html = '<img src="photo.jpg" width="900" height="600" loading="eager" decoding="sync" alt="" />';
    expect(articleImages(html)).toBe(html);
  });
});
