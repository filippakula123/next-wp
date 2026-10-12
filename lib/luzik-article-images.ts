import measuredSizes from "./luzik-blog-image-sizes.json";

// Dimensions recovered from the CMS library for imported images whose HTML
// lacks them. Keys contain upload paths so migration to another host still works.
const sizes: Record<string, { width: number; height: number }> = measuredSizes;
export function articleImages(html: string, cmsBase = process.env.WORDPRESS_URL) {
  let cms: URL | undefined;
  try { cms = cmsBase ? new URL(cmsBase) : undefined; } catch { /* Invalid CMS config leaves source URLs intact. */ }
  return html.replace(/<img\b[^>]*>/gi, tag => {
    const src = tag.match(/\ssrc\s*=\s*(["'])(.*?)\1/i)?.[2];
    let dimensions;
    try { dimensions = src ? sizes[new URL(src, "https://luzikkielce.pl").pathname] : undefined; } catch { /* Preserve invalid source for the CMS editor to correct. */ }
    const additions: string[] = [];
    if (dimensions && !/\s(?:width|height)\s*=/i.test(tag)) additions.push(`width="${dimensions.width}"`, `height="${dimensions.height}"`);
    if (!/\sloading\s*=/i.test(tag)) additions.push('loading="lazy"');
    if (!/\sdecoding\s*=/i.test(tag)) additions.push('decoding="async"');
    try {
      const source = src ? new URL(src, cms) : undefined;
      // Migrated article HTML can still contain http URLs for the same HTTPS CMS.
      if (source && cms?.protocol === 'https:' && source.protocol === 'http:' && source.hostname === cms.hostname && source.port === cms.port) source.protocol = 'https:';
      // Only the configured public CMS is allowed by next.config's image proxy.
      // Animated GIFs, SVGs and third-party images keep their original loading path.
      if (source && cms && cms.protocol === 'https:' && source.origin === cms.origin && source.pathname.startsWith('/wp-content/uploads/') && !source.search && /\.(jpe?g|png|webp|avif)$/i.test(source.pathname)) {
        const width = Number(tag.match(/\swidth\s*=\s*["'](\d+)["']/i)?.[1]) || dimensions?.width || 1920;
        const candidates = [64,128,256,384,640,750,828,1080,1200,1920].filter(candidate => candidate <= width);
        const widths = candidates.length ? candidates : [64];
        const optimized = (size: number) => `/_next/image?url=${encodeURIComponent(source.href)}&amp;w=${size}&amp;q=75`;
        tag = tag.replace(/\ssrc\s*=\s*(["'])(.*?)\1/i, ` src="${optimized(widths.at(-1)!)}"`);
        tag = tag.replace(/\s(?:srcset|sizes)\s*=\s*(["'])(.*?)\1/gi, '');
        additions.push(`srcset="${widths.map(size => `${optimized(size)} ${size}w`).join(', ')}"`, 'sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 60px), 780px"');
      }
    } catch { /* Preserve malformed image URLs for the CMS editor to correct. */ }
    return additions.length ? tag.replace(/\s*\/?>$/, ` ${additions.join(" ")} />`) : tag;
  });
}
