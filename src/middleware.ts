import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Only protect specific API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Skip auth check for webhook and auth routes
    if (
      request.nextUrl.pathname.startsWith("/api/webhooks") ||
      request.nextUrl.pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // Check for valid session token
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Basic rate limiting - using headers
    const rateLimit = request.headers.get("x-rate-limit");

    if (rateLimit === "exceeded") {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/((?!auth|webhooks).*)", // Protect all API routes except auth and webhooks
  ],
};
