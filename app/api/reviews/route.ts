import { getGoogleReviews } from "@/lib/luzik-reviews-server";
import { isSameOriginRequest } from "@/lib/request-origin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff" };
  if (!isSameOriginRequest(request, false)) {
    return Response.json({ available: false }, { status: 403, headers });
  }
  // The caller cannot choose a business, field mask, or upstream URL.
  const reviews = await getGoogleReviews();
  return Response.json(reviews ?? { available: false }, { status: reviews ? 200 : 503, headers });
}
