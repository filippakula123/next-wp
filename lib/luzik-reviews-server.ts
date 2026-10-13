import "server-only";
import { luzikGooglePlaceId, parseGoogleReviews, parseTrustindexReviews } from "./luzik-reviews";
import { wordpressCacheDisabled } from './wordpress-cache';

export function googleReviewsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim() || process.env.WORDPRESS_URL?.trim());
}

async function getWordPressReviews() {
  const base = process.env.WORDPRESS_URL;
  if (!base) return null;
  try {
    const localNoCache = wordpressCacheDisabled();
    const response = await fetch(new URL('/wp-json/luzik/v1/google-reviews', base), {
      ...(localNoCache
        ? { cache: 'no-store' as const, signal: AbortSignal.timeout(6000) }
        : { next: { revalidate: 60, tags: ['wordpress', 'luzik-reviews'] } }),
    });
    if (!response.ok) {
      console.warn(`Opinie WordPressa niedostępne (HTTP ${response.status}).`);
      return null;
    }
    const reviews = parseTrustindexReviews(await response.json());
    if (!reviews) console.warn('Niepoprawny format opinii WordPressa.');
    return reviews;
  } catch {
    console.warn('Nie udało się pobrać opinii z WordPressa.');
    return null;
  }
}

export async function getGoogleReviews() {
  // Prefer the configured WordPress bridge, including deployments that still
  // have an old/placeholder Places key in their environment variables.
  const wordpressReviews = await getWordPressReviews();
  if (wordpressReviews) return wordpressReviews;
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) return null;
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${luzikGooglePlaceId}?languageCode=pl`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,googleMapsUri,reviews,attributions",
      },
      // Places content is not persisted in Next's cache, a database, or a file.
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) {
      console.warn(`Opinie Google niedostępne (HTTP ${response.status}).`);
      return null;
    }
    return parseGoogleReviews(await response.json());
  } catch {
    // Never log the provider response, request headers, or API key.
    console.warn("Nie udało się pobrać opinii Google.");
    return null;
  }
}
