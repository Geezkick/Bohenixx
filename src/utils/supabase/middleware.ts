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

  // Protected routes — unauthenticated users get redirected to /dashboard (which shows AuthScreen)
  const protectedPaths = ['/dashboard', '/command-center', '/products', '/services', '/apps']
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    // Don't redirect if already on /dashboard (to avoid infinite loop — AuthScreen handles this)
    if (request.nextUrl.pathname !== '/dashboard') {
      return NextResponse.redirect(url)
    }
  }

  // Add security headers to every response
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')

  return supabaseResponse
}
