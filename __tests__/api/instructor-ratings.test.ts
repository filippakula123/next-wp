import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const cookieSet = vi.hoisted(() => vi.fn());
const revalidate = vi.hoisted(() => vi.fn());
vi.mock('next/cache', () => ({ revalidateTag: revalidate }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => ({ value: '12345678-1234-1234-1234-123456789abc' }), set: cookieSet }) }));
import { POST } from '@/app/api/instructor-ratings/route';
const slug='instruktor-nauki-jazdy-kategoria-b-kacper-jaros';
function request(body: unknown, origin='https://luzikkielce.pl') {
  return new Request('https://luzikkielce.pl/api/instructor-ratings', { method:'POST', headers: { origin, 'Content-Type':'application/json', 'x-forwarded-for':'192.0.2.1' }, body:JSON.stringify(body) });
}
describe('instructor voting proxy', () => {
  beforeEach(() => { vi.stubEnv('WORDPRESS_URL','https://cms.example'); vi.stubEnv('WORDPRESS_RATINGS_SECRET','test-secret-with-at-least-32-characters'); cookieSet.mockClear(); revalidate.mockClear(); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
  it('rejects cross-site and invalid votes before contacting WordPress', async () => {
    const fetcher=vi.fn(); vi.stubGlobal('fetch',fetcher);
    expect((await POST(request({slug,rating:5},'https://evil.example'))).status).toBe(403);
    for (const body of [{slug,rating:6},{slug,rating:0},{slug,rating:1.2},{slug:'unknown',rating:5}]) expect((await POST(request(body))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('authenticates upstream, sends hashed identifiers and returns confirmed totals', async () => {
    const fetcher=vi.fn().mockResolvedValue(Response.json({count:6,sum:30})); vi.stubGlobal('fetch',fetcher);
    const response=await POST(request({slug,rating:5}));
    expect(await response.json()).toEqual({count:6,sum:30,average:5});
    expect(revalidate).toHaveBeenCalledWith(`luzik-rating-${slug}`, { expire: 0 });
    const [url,options]=fetcher.mock.calls[0];
    expect(String(url)).toBe('https://cms.example/wp-json/luzik/v1/instructor-ratings/'+slug);
    expect(options.headers['X-Luzik-Ratings-Secret']).toBe(process.env.WORDPRESS_RATINGS_SECRET);
    const body=JSON.parse(options.body);
    expect(body.voter).toMatch(/^[a-f0-9]{64}$/); expect(body.limit).toMatch(/^[a-f0-9]{64}$/);
    expect(options.body).not.toContain('192.0.2.1');
    expect(cookieSet).toHaveBeenCalledWith('luzik-rating-visitor',expect.any(String),expect.objectContaining({httpOnly:true,secure:true,sameSite:'strict'}));
  });
  it('does not pretend a duplicate or unavailable CMS vote succeeded', async () => {
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({}, {status:409})));
    expect((await POST(request({slug,rating:5}))).status).toBe(409);
    expect(revalidate).not.toHaveBeenCalled();
    vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('unavailable')));
    expect((await POST(request({slug,rating:5}))).status).toBe(503);
  });
  it('accepts votes through the hosting proxy and keeps the visitor cookie secure', async () => {
    const fetcher=vi.fn().mockResolvedValue(Response.json({count:6,sum:30})); vi.stubGlobal('fetch',fetcher);
    const proxied=new Request('http://localhost:3000/api/instructor-ratings', {
      method:'POST', headers: { origin:'https://preview.hostingersite.com', 'x-forwarded-host':'preview.hostingersite.com', 'x-forwarded-proto':'https', 'sec-fetch-site':'same-origin', 'Content-Type':'application/json' }, body:JSON.stringify({slug,rating:5}),
    });
    const response=await POST(proxied);
    expect(response.status).toBe(200);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(cookieSet).toHaveBeenCalledWith('luzik-rating-visitor',expect.any(String),expect.objectContaining({secure:true}));
  });
});
