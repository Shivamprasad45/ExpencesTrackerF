// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isPremium = request.cookies.get("premium")?.value === "true";

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile");

  if (isProtectedRoute && !token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isProtectedRoutePremium =
    request.nextUrl.pathname.startsWith("/analytics") ||
    request.nextUrl.pathname.startsWith("/leaderboard");

  if (isProtectedRoutePremium && token && !isPremium) {
    // Redirect to upgrade page if not a premium user
    return NextResponse.redirect(new URL("/upgrade", request.url));
  }

  return NextResponse.next();
}

// Limit the middleware to specific paths
export const config = {};
