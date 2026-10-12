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
  it('serves public CMS photos responsively through the Next optimizer without changing alt text', () => {
    const result=articleImages('<img src="https://cms.example/wp-content/uploads/2026/photo.jpg" width="1200" height="800" alt="Instruktor przy samochodzie" srcset="original.jpg 1200w" />','https://cms.example');
    expect(result).toContain('src="/_next/image?url=https%3A%2F%2Fcms.example%2Fwp-content%2Fuploads%2F2026%2Fphoto.jpg&amp;w=1200&amp;q=75"');
    expect(result).toContain('srcset="');
    expect(result).toContain('640w');
    expect(result).toContain('sizes="');
    expect(result).toContain('alt="Instruktor przy samochodzie"');
    expect(result).not.toContain('original.jpg');
    expect(result).not.toContain('1920w');
  });
  it('does not proxy private CMS, animation or untrusted external images', () => {
    for (const src of ['http://next-wp.local/wp-content/uploads/photo.jpg','https://other.example/wp-content/uploads/photo.jpg','https://cms.example/private/photo.jpg','https://cms.example/wp-content/uploads/photo.gif','https://cms.example/wp-content/uploads/photo.svg','https://cms.example/wp-content/uploads/photo.jpg?token=x']) {
      expect(articleImages(`<img src="${src}" alt="" />`,'https://cms.example')).not.toContain('/_next/image');
    }
  });
  it('upgrades old HTTP upload links only for the configured HTTPS CMS', () => {
    const result=articleImages('<img src="http://cms.example/wp-content/uploads/photo.jpg" width="1080" height="720" />','https://cms.example');
    expect(result).toContain('url=https%3A%2F%2Fcms.example%2Fwp-content%2Fuploads%2Fphoto.jpg');
    expect(result).toContain('srcset="');
    expect(articleImages('<img src="http://other.example/wp-content/uploads/photo.jpg" />','https://cms.example')).not.toContain('/_next/image');
  });
});
