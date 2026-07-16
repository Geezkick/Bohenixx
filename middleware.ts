import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── 1. Always allow NextAuth API routes through ────────────────────────────
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // ── 2. Allow static assets & all other API routes ─────────────────────────
  const isApiRoute = pathname.startsWith("/api/");
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|webp|ico|html|xml|txt|json|mp4|webm|css|js|woff|woff2|ttf|otf)$/i.test(pathname);
  if (isApiRoute || isStaticAsset) {
    return NextResponse.next();
  }

  // ── 3. Public paths – anyone can access these, no auth needed ─────────────
  const publicPaths = [
    "/",
    "/flow-ai",
    "/pricing",
    "/sign-in",
    "/privacy",
    "/terms",
    "/security",
    "/products",
    "/services",
  ];
  const isPublicRoute = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // ── 4. Everything else is protected – require a valid JWT ──────────────────
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Not authenticated → redirect to sign-in
  if (!token) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Already signed in and hitting /sign-in → send to dashboard
  if (token && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 5. Authenticated – add security headers and continue ──────────────────
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff|woff2|ttf|otf|css|js)$).*)",
  ],
};
