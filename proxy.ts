import { type NextRequest } from 'next/server'
import { buildContentSecurityPolicy, createNonce } from '@/lib/security/csp'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  const nonce = createNonce()
  const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(
    request.nextUrl.hostname,
  )
  const contentSecurityPolicy = buildContentSecurityPolicy(
    nonce,
    process.env.NODE_ENV !== 'development' && !isLocalhost,
    request.nextUrl.searchParams.get('cms-preview') === '1',
  )
  const requestHeaders = new Headers(request.headers)

  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy)

  const response = await updateSession(request, requestHeaders)
  response.headers.set('Content-Security-Policy', contentSecurityPolicy)

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
