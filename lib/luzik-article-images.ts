import measuredSizes from "./luzik-blog-image-sizes.json";

// Dimensions recovered from the CMS library for imported images whose HTML
// lacks them. Keys contain upload paths so migration to another host still works.
const sizes: Record<string, { width: number; height: number }> = measuredSizes;
export function articleImages(html: string) {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    const src = tag.match(/\ssrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    let dimensions;
    try { dimensions = src ? sizes[new URL(src, "https://luzikkielce.pl").pathname] : undefined; } catch { /* Preserve invalid source for the CMS editor to correct. */ }
    const additions: string[] = [];
    if (dimensions && !/\s(?:width|height)\s*=/i.test(tag)) additions.push(`width="${dimensions.width}"`, `height="${dimensions.height}"`);
    if (!/\sloading\s*=/i.test(tag)) additions.push('loading="lazy"');
    if (!/\sdecoding\s*=/i.test(tag)) additions.push('decoding="async"');
    return additions.length ? tag.replace(/\s*\/?>$/, ` ${additions.join(" ")} />`) : tag;
  });
}
