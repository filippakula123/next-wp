/** Public origin supplied by the hosting proxy, rather than its internal Node URL. */
export function publicRequestOrigin(request: Request): string | null {
  const url = new URL(request.url);
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host'))?.split(',')[0]?.trim();
  const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? url.protocol.slice(0, -1);
  if (!['http', 'https'].includes(protocol)) return null;
  if (!host) return url.origin;
  try {
    const publicUrl = new URL(`${protocol}://${host}`);
    // Only a host/port is valid here, never userinfo, a path, or query parameters.
    if (publicUrl.host !== host.toLowerCase() || publicUrl.username || publicUrl.password || publicUrl.pathname !== '/' || publicUrl.search || publicUrl.hash) return null;
    return publicUrl.origin;
  } catch {
    return null;
  }
}

export function isSameOriginRequest(request: Request, requireOrigin = true): boolean {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  if (!origin) return !requireOrigin;
  return origin === publicRequestOrigin(request);
}
