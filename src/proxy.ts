import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const token = request.cookies.get('bx_token')?.value
  let user = null

  if (token) {
    user = await verifyToken(token)
  }

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
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  return response
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
