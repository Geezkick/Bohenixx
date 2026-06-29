import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // ─── OAUTH ROUTES — must NEVER be intercepted ──────────────────────────────
  // The Google callback must exchange the code before any session exists.
  // Any redirect here will break the OAuth flow.
  const isOAuthRoute =
    pathname === '/api/auth/callback' ||
    pathname.startsWith('/api/auth/callback') ||
    pathname === '/api/auth/google' ||
    pathname.startsWith('/api/auth/google')

  if (isOAuthRoute) {
    // Still apply security headers but no session gate
    supabaseResponse.headers.set('X-Frame-Options', 'DENY')
    supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
    return supabaseResponse
  }

  // ─── REFRESH SESSION ────────────────────────────────────────────────────────
  // IMPORTANT: Always call getUser() — never getSession() — for server-side validation.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ─── ROUTE PROTECTION ───────────────────────────────────────────────────────
  // PUBLIC ROUTES — accessible without authentication
  const publicPaths = [
    '/',              // Landing page with inline auth form
    '/products',      // Product showcase
    '/developers',    // Developer portal (informational)
    '/apps',          // Apps overview
    '/services',      // Services page
  ]

  const isPublicRoute = publicPaths.some(
    path => pathname === path || pathname.startsWith(path + '/')
  )
  const isApiRoute = pathname.startsWith('/api/')
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|webp|ico|html|xml|txt|json|mp4|webm|css|js|woff|woff2|ttf|otf)$/i.test(pathname)

  // If unauthenticated and not a public/api/static path → redirect to / (auth gate on landing)
  if (!user && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('auth', 'required')
    return NextResponse.redirect(url)
  }

  // ─── SECURITY HEADERS ───────────────────────────────────────────────────────
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public static assets (images, fonts, videos, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff|woff2|ttf|otf|css|js)$).*)',
  ],
}
