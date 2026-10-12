import seed from './luzik-instructor-ratings-seed.json';
export type InstructorRating = { count: number; sum: number; average: number };
export function ratingSlug(value: unknown): value is keyof typeof seed {
  return typeof value === 'string' && Object.hasOwn(seed, value);
}
export function parseInstructorRating(value: unknown): InstructorRating | null {
  if (!value || typeof value !== 'object') return null;
  const { count, sum } = value as Record<string, unknown>;
  if (typeof count !== 'number' || typeof sum !== 'number' || !Number.isSafeInteger(count) || !Number.isSafeInteger(sum) || count < 0 || sum < count || sum > count * 5) return null;
  return { count, sum, average: count ? Math.round(sum / count * 100) / 100 : 0 };
}
export function historicalInstructorRating(slug: keyof typeof seed) {
  return parseInstructorRating(seed[slug])!;
}
