import { afterEach, describe, expect, it, vi } from "vitest";
import { luzikGooglePlaceId, parseGoogleReviews, parseTrustindexReviews } from "@/lib/luzik-reviews";
vi.mock("server-only", () => ({}));
import { getGoogleReviews, googleReviewsConfigured } from "@/lib/luzik-reviews-server";
import { GET } from "@/app/api/reviews/route";

const place = {
  id: luzikGooglePlaceId, displayName: { text: "Szkoła Jazdy Luzik" }, rating: 4.6, userRatingCount: 456,
  reviews: [
    { name: "places/test/reviews/1", rating: 2, text: { text: "Nie polecam", languageCode: "pl" }, authorAttribution: { displayName: "Autor A", uri: "https://www.google.com/maps/contrib/1", photoUri: "https://lh3.googleusercontent.com/photo" }, googleMapsUri: "https://www.google.com/maps/reviews/1", publishTime: "2026-10-08T12:00:00Z" },
    { name: "places/test/reviews/2", rating: 5, text: { text: "Polecam", languageCode: "pl" }, originalText: { text: "Recommended", languageCode: "en" }, authorAttribution: { displayName: "Autor B" } },
    { name: "places/test/reviews/3", rating: 3, authorAttribution: { displayName: "Autor C" } },
  ],
};

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("Google review source", () => {
  it("keeps low ratings, provider order, rating-only reviews, attribution and the real total", () => {
    const result = parseGoogleReviews({ ...place, attributions: [{ provider: "Data provider", providerUri: "https://provider.example/credit" }] })!;
    expect(result.attributions).toEqual([{ name: "Data provider", url: "https://provider.example/credit" }]);
    expect(result.count).toBe(456);
    expect(result.rating).toBe(4.6);
    expect(result.reviews.map(item => item.rating)).toEqual([2, 5, 3]);
    expect(result.reviews[0].url).toBe("https://www.google.com/maps/reviews/1");
    expect(result.reviews[0].date).toBe("2026-10-08T12:00:00.000Z");
    expect(result.reviews[1].translated).toBe(true);
    expect(result.reviews[2].text).toBe("");
  });
  it("rejects a different business and malformed responses instead of inventing reviews", () => {
    expect(parseGoogleReviews({ ...place, id: "some-other-school" })).toBeNull();
    expect(parseGoogleReviews(null)).toBeNull();
    expect(parseGoogleReviews({ ...place, rating: -1, userRatingCount: "456", reviews: [{ rating: 12 }] })).toMatchObject({ rating: undefined, count: undefined, reviews: [] });
  });
  it("rejects unsafe author and avatar links without discarding valid review content", () => {
    const result = parseGoogleReviews({ ...place, reviews: [{ ...place.reviews[0], publishTime: "invalid", authorAttribution: { displayName: "A", uri: "javascript:alert(1)", photoUri: "https://googleusercontent.com.attacker.test/photo" }, googleMapsUri: "https://google.com.attacker.test/" }] })!;
    expect(result.reviews[0]).toMatchObject({ author: "A", text: "Nie polecam", authorUrl: undefined, photoUrl: undefined, url: undefined, date: undefined });
  });
  it("does not contact a provider without either a key or WordPress", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "");
    vi.stubEnv("WORDPRESS_URL", "");
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    expect(await getGoogleReviews()).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("uses real WordPress reviews without a Google key and retains low and textless ratings", async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', '');
    vi.stubEnv('WORDPRESS_URL', 'https://cms.example');
    vi.stubEnv('WORDPRESS_CACHE_DISABLED', 'false');
    const fetcher = vi.fn().mockResolvedValue(Response.json({ version: 1, source: 'trustindex', place }));
    vi.stubGlobal('fetch', fetcher);
    expect(googleReviewsConfigured()).toBe(true);
    const result = await getGoogleReviews();
    expect(result).toMatchObject({ source: 'trustindex', rating: 4.6, count: 456 });
    expect(result!.reviews.map(item => item.rating)).toEqual([2, 5, 3]);
    expect(fetcher).toHaveBeenCalledOnce();
    const [url, options] = fetcher.mock.calls[0];
    expect(String(url)).toBe('https://cms.example/wp-json/luzik/v1/google-reviews');
    expect(options.next.revalidate).toBe(60);
    expect(options.headers).toBeUndefined();
  });
  it('rejects an unrecognized bridge, other school or empty cached reviews', () => {
    expect(parseTrustindexReviews({ version: 2, source: 'trustindex', place })).toBeNull();
    expect(parseTrustindexReviews({ version: 1, source: 'unknown', place })).toBeNull();
    expect(parseTrustindexReviews({ version: 1, source: 'trustindex', place: { ...place, id: 'other-school' } })).toBeNull();
    expect(parseTrustindexReviews({ version: 1, source: 'trustindex', place: { ...place, reviews: [] } })).toBeNull();
    expect(parseTrustindexReviews({ version: 1, source: 'trustindex', place })).toMatchObject({ attributions: [{ url: 'https://www.trustindex.io/' }] });
  });
  it('falls back to unavailable instead of sample reviews when the bridge is absent', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', '');
    vi.stubEnv('WORDPRESS_URL', 'https://cms.example');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ code: 'rest_no_route' }, { status: 404 })));
    expect(await getGoogleReviews()).toBeNull();
  });
  it('prefers Trustindex over a leftover Places key without contacting Google', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'old-placeholder-key');
    vi.stubEnv('WORDPRESS_URL', 'https://cms.example');
    const fetcher = vi.fn().mockResolvedValue(Response.json({ version: 1, source: 'trustindex', place }));
    vi.stubGlobal('fetch', fetcher);
    expect(await getGoogleReviews()).toMatchObject({ source: 'trustindex', count: 456 });
    expect(fetcher).toHaveBeenCalledOnce();
    expect(String(fetcher.mock.calls[0][0])).toBe('https://cms.example/wp-json/luzik/v1/google-reviews');
  });
  it('can still use Places when the WordPress bridge is unavailable', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'real-configured-key');
    vi.stubEnv('WORDPRESS_URL', 'https://cms.example');
    const fetcher = vi.fn()
      .mockResolvedValueOnce(Response.json({ code: 'rest_no_route' }, { status: 404 }))
      .mockResolvedValueOnce(Response.json(place));
    vi.stubGlobal('fetch', fetcher);
    expect(await getGoogleReviews()).toMatchObject({ count: 456 });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(String(fetcher.mock.calls[1][0])).toContain('places.googleapis.com');
  });
  it("keeps the key in server request headers and does not persist provider content", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-private-key");
    const fetcher = vi.fn().mockResolvedValue(Response.json(place)); vi.stubGlobal("fetch", fetcher);
    const response = await GET(new Request("http://localhost:3000/api/reviews"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.text()).not.toContain("test-private-key");
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toContain(luzikGooglePlaceId);
    expect(url).not.toContain("test-private-key");
    expect(options.cache).toBe("no-store");
    expect(options.headers["X-Goog-Api-Key"]).toBe("test-private-key");
  });
  it("handles quota errors safely and blocks cross-site calls before calling Google", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "test-private-key");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetcher = vi.fn().mockResolvedValue(new Response("provider secret error", { status: 429 })); vi.stubGlobal("fetch", fetcher);
    const response = await GET(new Request("http://localhost:3000/api/reviews"));
    expect(response.status).toBe(503);
    expect(await response.text()).toBe('{"available":false}');
    fetcher.mockClear();
    expect((await GET(new Request("http://localhost:3000/api/reviews", { headers: { origin: "https://other.test", "sec-fetch-site": "cross-site" } }))).status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
