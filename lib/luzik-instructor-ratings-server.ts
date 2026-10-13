import 'server-only';
import { cache } from 'react';
import { historicalInstructorRating, parseInstructorRating, ratingSlug } from './luzik-instructor-ratings';
import { wordpressCacheDisabled } from './wordpress-cache';
export const getInstructorRating = cache(async (slug: string) => {
  if (!ratingSlug(slug)) throw new Error('Unknown instructor');
  try {
    if (!process.env.WORDPRESS_URL) throw new Error('Missing CMS');
    const url = new URL(`/wp-json/luzik/v1/instructor-ratings/${slug}`, process.env.WORDPRESS_URL);
    const response = await fetch(url, wordpressCacheDisabled()
      ? { cache: 'no-store', signal: AbortSignal.timeout(5000) }
      : { next: { revalidate: 60, tags: ['wordpress', `luzik-rating-${slug}`] } });
    const rating = response.ok ? parseInstructorRating(await response.json()) : null;
    if (rating) return { rating, connected: true, voting: !!process.env.WORDPRESS_RATINGS_SECRET };
  } catch { /* Keep the verified historical totals when the CMS is unavailable. */ }
  return { rating: historicalInstructorRating(slug), connected: false, voting: false };
});
