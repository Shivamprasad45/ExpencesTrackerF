// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile");

  if (isProtectedRoute && !token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Limit the middleware to specific paths
export const config = {};
