// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function runs before requests are completed
export function middleware(request: NextRequest) {
  // Don't process non-API requests
  if (!request.nextUrl.pathname.startsWith("/api/v1")) {
    return NextResponse.next();
  }

  // Get the API URL from environment variables or use default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = new URL(request.nextUrl.pathname, apiUrl);

  // Copy all search parameters
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    url.searchParams.set(key, value);
  }

  // Special handling for multipart/form-data requests (like audio uploads)
  if (request.headers.get("content-type")?.includes("multipart/form-data")) {
    // For multipart requests, we need to proxy the entire request
    // without modifying headers to preserve the boundary
    return NextResponse.rewrite(url);
  }

  // For all other API requests
  return NextResponse.rewrite(url);
}

// Configure which paths this middleware runs on
export const config = {
  matcher: ["/api/v1/:path*"],
};
