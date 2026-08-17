import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })

          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value)
          })
        },
      },
    },
  )

  const { data } = await supabase.auth.getClaims()
  const pathname = request.nextUrl.pathname

  const isAdminLogin = pathname === '/admin/login'
  const isPasswordRecovery = pathname === '/admin/update-password'

  const isProtectedAdminRoute =
    pathname.startsWith('/admin') &&
    !isAdminLogin &&
    !isPasswordRecovery
  if (!data?.claims && isProtectedAdminRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.search = ''

    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
