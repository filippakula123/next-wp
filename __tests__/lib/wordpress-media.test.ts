import { describe, expect, it } from "vitest";
import { wordpressImageUnoptimized } from "@/lib/wordpress-media";
import { luzikMetadata } from "@/lib/luzik-seo";
describe("WordPress image delivery", () => {
  it("bypasses only local development images", () => {
    expect(wordpressImageUnoptimized("http://next-wp.local/wp-content/uploads/image.jpg")).toBe(true);
    expect(wordpressImageUnoptimized("http://localhost:80/image.jpg")).toBe(true);
    expect(wordpressImageUnoptimized("http://[::1]/image.jpg")).toBe(true);
    expect(wordpressImageUnoptimized("https://cms.luzikkielce.pl/wp-content/uploads/image.jpg")).toBe(false);
    expect(wordpressImageUnoptimized("/luzik/hero.webp")).toBe(false);
  });
  it("does not expose local WordPress media in social metadata", () => {
    const metadata = luzikMetadata("Artykuł", "Opis", "/artykul", "http://next-wp.local/image.jpg");
    expect(JSON.stringify(metadata.openGraph)).not.toContain("next-wp.local");
    expect(JSON.stringify(metadata.openGraph)).toContain("/luzik/brand/social.jpg");
  });
});
