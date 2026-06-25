import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'bohenix_secret_key_for_jwt_auth';
const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // PUBLIC ROUTES — these are the ONLY pages accessible without authentication
  // Everything else is locked behind the portal
  const publicPaths = [
    '/',           // Landing page (has its own client-side lock for scrolling)
    '/dashboard',  // Auth screen lives here — must be accessible to log in
  ];

  const isPublicRoute = publicPaths.some(path => pathname === path);
  const isApiRoute = pathname.startsWith('/api');
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|webp|ico|html|xml|txt|json|mp4|webm|css|js|woff|woff2|ttf)$/i.test(pathname);

  // Skip auth check for public routes, API routes, and static assets
  if (isPublicRoute || isApiRoute || isStaticAsset) {
    const response = NextResponse.next();
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  // Check for JWT token in cookie
  const token = request.cookies.get('bx_token')?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, encodedKey);
      isAuthenticated = true;
    } catch {
      // Token is invalid or expired
    }
  }

  // If not authenticated → redirect to /dashboard (which shows AuthScreen)
  if (!isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  // Add security headers to every response
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|xml|txt|json)$).*)',
  ],
}
