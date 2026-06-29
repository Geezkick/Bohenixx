import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // Refresh the session if necessary
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // PUBLIC ROUTES — these are the ONLY pages accessible without authentication
  // Everything else is locked behind the portal
  const publicPaths = [
    '/',           // Landing page (has its own client-side lock for scrolling)
    '/dashboard',  // Auth screen lives here — must be accessible to log in
    '/products',   // The products page is a showcase
    '/developers', // Developer portal is informational
  ]

  const isPublicRoute = publicPaths.some(path => pathname === path)
  const isApiRoute = pathname.startsWith('/api')
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|webp|ico|html|xml|txt|json|mp4|webm|css|js|woff|woff2|ttf)$/i.test(pathname)

  // If the user is NOT logged in, and it's NOT a public route, NOT an API route, NOT a static asset
  // → redirect them to /dashboard (which shows the AuthScreen)
  if (!user && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
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
