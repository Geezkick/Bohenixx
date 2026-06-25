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

  // IMPORTANT: Always call getUser() to refresh the session token.
  // Do NOT use getSession() here — it does not validate server-side.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // PUBLIC ROUTES — accessible without authentication
  const publicPaths = [
    '/',  // Landing page with inline auth form
  ]

  const isPublicRoute = publicPaths.some(path => pathname === path)
  const isApiRoute = pathname.startsWith('/api')
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|webp|ico|html|xml|txt|json|mp4|webm|css|js|woff|woff2|ttf)$/i.test(pathname)

  // If unauthenticated and not a public/api/static path → redirect to / (auth gate)
  if (!user && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Add security headers to every response
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
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|xml|txt|json)$).*)',
  ],
}
