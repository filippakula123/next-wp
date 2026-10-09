import { afterEach, describe, expect, it, vi } from "vitest";
import { luzikGooglePlaceId, parseGoogleReviews } from "@/lib/luzik-reviews";
vi.mock("server-only", () => ({}));
import { getGoogleReviews } from "@/lib/luzik-reviews-server";
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
  it("does not contact Google without a server key", async () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "");
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    expect(await getGoogleReviews()).toBeNull();
    expect(fetcher).not.toHaveBeenCalled();
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
