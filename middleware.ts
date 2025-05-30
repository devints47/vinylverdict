import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add security headers to all responses
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Handle authentication-protected routes
  const protectedRoutes = ['/dashboard', '/login', '/callback', '/share']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Add noindex headers for protected routes
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex')
    
    // Check if it's a bot/crawler
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent)
    
    if (isBot) {
      // Return 404 for bots trying to access protected routes
      return new NextResponse('Not Found', { status: 404 })
    }
  }

  // Handle share routes specifically (they require authentication)
  if (pathname.startsWith('/s/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    
    // Allow social media crawlers for share previews
    const userAgent = request.headers.get('user-agent') || ''
    const isSocialBot = /facebookexternalhit|twitterbot|linkedinbot|whatsapp/i.test(userAgent)
    
    if (!isSocialBot) {
      const isBot = /bot|crawler|spider|crawling/i.test(userAgent)
      if (isBot) {
        return new NextResponse('Not Found', { status: 404 })
      }
    }
  }

  // Add cache headers for static assets
  if (pathname.startsWith('/_next/static/') || pathname.includes('.')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Add SEO-friendly headers for public pages
  if (pathname === '/' || pathname.startsWith('/privacy') || pathname.startsWith('/terms')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 