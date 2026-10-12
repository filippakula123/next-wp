import { cookies } from 'next/headers';
import { createHash, randomUUID } from 'node:crypto';
import { parseInstructorRating, ratingSlug } from '@/lib/luzik-instructor-ratings';
import { isSameOriginRequest, publicRequestOrigin } from '@/lib/request-origin';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return Response.json({ error: 'Niedozwolone żądanie.' }, { status: 403, headers });
  if ((Number(request.headers.get('content-length')) || 0) > 1024) return Response.json({ error: 'Nieprawidłowe żądanie.' }, { status: 413, headers });
  const secret = process.env.WORDPRESS_RATINGS_SECRET;
  const base = process.env.WORDPRESS_URL;
  if (!secret || !base) return Response.json({ error: 'Ocenianie nie jest jeszcze dostępne.' }, { status: 503, headers });
  let input: unknown;
  try { const text = await request.text(); if (text.length > 1024) throw new Error(); input = JSON.parse(text); } catch { return Response.json({ error: 'Nieprawidłowe żądanie.' }, { status: 400, headers }); }
  const { slug, rating } = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  if (!ratingSlug(slug) || typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) return Response.json({ error: 'Wybierz ocenę od 1 do 5.' }, { status: 400, headers });
  const jar = await cookies();
  const stored = jar.get('luzik-rating-visitor')?.value;
  const visitor = stored && /^[a-f0-9-]{36}$/i.test(stored) ? stored : randomUUID();
  // Only keyed hashes reach WordPress; never store a raw IP or visitor cookie there.
  const hash = (value: string) => createHash('sha256').update(secret + ':' + value).digest('hex');
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  try {
    const response = await fetch(new URL(`/wp-json/luzik/v1/instructor-ratings/${slug}`, base), {
      method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(7000),
      headers: { 'Content-Type': 'application/json', 'X-Luzik-Ratings-Secret': secret },
      body: JSON.stringify({ rating, voter: hash(visitor), limit: hash(ip === 'unknown' ? visitor : ip) }),
    });
    const result = await response.json();
    const data = response.ok ? parseInstructorRating(result) : null;
    const output = data ? Response.json(data, { headers }) : Response.json({ error: response.status === 409 ? 'Już oceniłeś tego instruktora.' : response.status === 429 ? 'Odczekaj chwilę przed kolejną oceną.' : 'Nie udało się zapisać oceny. Spróbuj ponownie.' }, { status: [409,429].includes(response.status) ? response.status : 502, headers });
    jar.set('luzik-rating-visitor', visitor, { httpOnly: true, sameSite: 'strict', secure: publicRequestOrigin(request)?.startsWith('https:') ?? false, maxAge: 31536000, path: '/' });
    return output;
  } catch { return Response.json({ error: 'Nie udało się połączyć z systemem ocen. Spróbuj ponownie.' }, { status: 503, headers }); }
}
