import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isOAuthRoute = pathname.startsWith('/api/auth/')
  if (isOAuthRoute) {
    const res = NextResponse.next({ request })
    res.headers.set('X-Frame-Options', 'DENY')
    return res
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  const publicPaths = ['/', '/products', '/developers', '/apps', '/services']
  const isPublicRoute = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))
  const isApiRoute = pathname.startsWith('/api/')
  const isStaticAsset = /\.(svg|png|jpg|jpeg|gif|webp|ico|html|xml|txt|json|mp4|webm|css|js|woff|woff2|ttf|otf)$/i.test(pathname)

  if (!token && !isPublicRoute && !isApiRoute && !isStaticAsset) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('auth', 'required')
    return NextResponse.redirect(url)
  }

  const res = NextResponse.next({ request })
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
