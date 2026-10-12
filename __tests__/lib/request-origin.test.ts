import { describe, expect, it } from 'vitest';
import { isSameOriginRequest, publicRequestOrigin } from '@/lib/request-origin';

const publicOrigin = 'https://mediumslateblue-porpoise-987005.hostingersite.com';
function proxied(headers: Record<string, string> = {}) {
  return new Request('http://localhost:3000/api/instructor-ratings', {
    headers: { origin: publicOrigin, 'x-forwarded-host': new URL(publicOrigin).host, 'x-forwarded-proto': 'https', ...headers },
  });
}

describe('public request origin behind a proxy', () => {
  it('matches the public HTTPS origin instead of the internal HTTP URL', () => {
    expect(publicRequestOrigin(proxied())).toBe(publicOrigin);
    expect(isSameOriginRequest(proxied())).toBe(true);
  });
  it('uses Host when the proxy does not supply a forwarded host', () => {
    const request = new Request('http://localhost:3000/api', { headers: { host: 'luzikkielce.pl', 'x-forwarded-proto': 'https', origin: 'https://luzikkielce.pl' } });
    expect(isSameOriginRequest(request)).toBe(true);
  });
  it('rejects foreign, missing, opaque and cross-site origins', () => {
    for (const origin of ['https://evil.example', '', 'null', publicOrigin + ':8443']) {
      expect(isSameOriginRequest(proxied({ origin }))).toBe(false);
    }
    expect(isSameOriginRequest(proxied({ 'sec-fetch-site': 'cross-site' }))).toBe(false);
  });
  it('rejects malformed forwarding headers', () => {
    for (const host of ['user@luzikkielce.pl', 'luzikkielce.pl/path', 'luzikkielce.pl?query', 'https://luzikkielce.pl']) {
      expect(publicRequestOrigin(proxied({ 'x-forwarded-host': host }))).toBeNull();
    }
    expect(publicRequestOrigin(proxied({ 'x-forwarded-proto': 'ftp' }))).toBeNull();
  });
  it('permits origin-less reads but continues rejecting cross-site reads', () => {
    expect(isSameOriginRequest(proxied({ origin: '' }), false)).toBe(true);
    expect(isSameOriginRequest(proxied({ origin: '', 'sec-fetch-site': 'cross-site' }), false)).toBe(false);
  });
});
