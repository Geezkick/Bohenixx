import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Always allow NextAuth API routes through without any checks
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Skip static assets and other API routes
  const isApiRoute = pathname.startsWith('/api/')
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|webp|ico|html|xml|txt|json|mp4|webm|css|js|woff|woff2|ttf|otf)$/i.test(pathname)

  if (isApiRoute || isStaticAsset) {
    return NextResponse.next()
  }

  // Public paths that don't require authentication
  const publicPaths = ['/', '/products', '/developers', '/apps', '/services', '/sign-in', '/privacy', '/terms']
  const isPublicRoute = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))

  // Try to get the JWT token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // If user is already signed in and tries to access /sign-in, redirect to dashboard
  if (token && pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is NOT signed in and tries to access a protected route, redirect to /sign-in
  if (!token && !isPublicRoute) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Add security headers
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff|woff2|ttf|otf|css|js)$).*)',
  ],
}
