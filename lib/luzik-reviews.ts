export const luzikGooglePlaceId = "ChIJ6YYMDDonGEcRZEwLNN76QHc";
export const luzikGoogleReviewsUrl = `https://www.google.com/maps/search/?api=1&query=Szko%C5%82a+Jazdy+Luzik+Kielce&query_place_id=${luzikGooglePlaceId}`;

export type GoogleReview = {
  id: string;
  author: string;
  authorUrl?: string;
  photoUrl?: string;
  rating: number;
  text: string;
  language?: string;
  translated: boolean;
  date?: string;
  url?: string;
};
export type GoogleReviews = {
  name: string;
  rating?: number;
  count?: number;
  url: string;
  reviews: GoogleReview[];
  attributions: { name: string; url?: string }[];
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function text(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function attributionUrl(value: unknown): string | undefined {
  try {
    const url = new URL(text(value));
    if (url.protocol === "https:" && !url.username && !url.password) return url.href;
  } catch { /* Invalid attribution URL. */ }
}
function googleUrl(value: unknown, photo = false): string | undefined {
  try {
    const url = new URL(text(value));
    const allowed = photo ? ["googleusercontent.com", "gstatic.com"] : ["google.com", "maps.app.goo.gl"];
    if (url.protocol === "https:" && !url.username && !url.password && allowed.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) return url.href;
  } catch { /* Invalid provider URL: do not render it as a link. */ }
}

/** Only public display fields are returned. Keep Google's relevance order and all ratings. */
export function parseGoogleReviews(value: unknown): GoogleReviews | null {
  const place = record(value);
  // Reject an unexpected business rather than showing another school's reviews.
  if (place.id !== luzikGooglePlaceId || !text(record(place.displayName).text)) return null;
  const reviews: GoogleReview[] = [];
  for (const [index, raw] of (Array.isArray(place.reviews) ? place.reviews : []).entries()) {
    const review = record(raw);
    const author = record(review.authorAttribution);
    const body = record(review.text);
    const original = record(review.originalText);
    if (!text(author.displayName) || typeof review.rating !== "number" || !Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) continue;
    const date = text(review.publishTime);
    reviews.push({
      id: text(review.name) || `review-${index}`,
      author: text(author.displayName),
      authorUrl: googleUrl(author.uri),
      photoUrl: googleUrl(author.photoUri, true),
      rating: review.rating,
      text: text(body.text) || text(original.text),
      language: text(body.languageCode) || text(original.languageCode) || undefined,
      translated: Boolean(text(body.languageCode) && text(original.languageCode) && body.languageCode !== original.languageCode),
      date: date && Number.isFinite(Date.parse(date)) ? new Date(date).toISOString() : undefined,
      url: googleUrl(review.googleMapsUri),
    });
  }
  return {
    name: text(record(place.displayName).text),
    rating: typeof place.rating === "number" && place.rating >= 1 && place.rating <= 5 ? place.rating : undefined,
    count: typeof place.userRatingCount === "number" && Number.isSafeInteger(place.userRatingCount) && place.userRatingCount >= 0 ? place.userRatingCount : undefined,
    url: googleUrl(place.googleMapsUri) || luzikGoogleReviewsUrl,
    reviews,
    attributions: (Array.isArray(place.attributions) ? place.attributions : []).map(raw => {
      const attribution = record(raw);
      return { name: text(attribution.provider), url: attributionUrl(attribution.providerUri) };
    }).filter(item => item.name),
  };
}
