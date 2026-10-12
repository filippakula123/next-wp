import { describe, expect, it } from 'vitest';
import { historicalInstructorRating, parseInstructorRating, ratingSlug } from '@/lib/luzik-instructor-ratings';
import profiles from '@/lib/luzik-profiles.json';
describe('instructor ratings', () => {
  it('has real migration totals for every known profile', () => {
    for (const profile of profiles) {
      expect(ratingSlug(profile.slug)).toBe(true);
      if (ratingSlug(profile.slug)) expect(historicalInstructorRating(profile.slug)).not.toBeNull();
    }
    expect(historicalInstructorRating('instruktor-nauki-jazdy-kategoria-b-kacper-jaros')).toEqual({ count: 5, sum: 25, average: 5 });
  });
  it('rejects unknown slugs and impossible or malformed totals', () => {
    expect(ratingSlug('__proto__')).toBe(false);
    expect(ratingSlug('made-up-person')).toBe(false);
    for (const value of [null, {count:-1,sum:0}, {count:2,sum:11}, {count:3,sum:2}, {count:1.5,sum:5}, {count:'5',sum:25}, {count:0,sum:1}]) expect(parseInstructorRating(value)).toBeNull();
  });
  it('computes the average from the actual sum and count', () => {
    expect(parseInstructorRating({count:26,sum:123})).toEqual({count:26,sum:123,average:4.73});
    expect(parseInstructorRating({count:0,sum:0})).toEqual({count:0,sum:0,average:0});
  });
});
