import "server-only";
import { luzikGooglePlaceId, parseGoogleReviews } from "./luzik-reviews";

export function googleReviewsConfigured(): boolean {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY?.trim());
}

export async function getGoogleReviews() {
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
