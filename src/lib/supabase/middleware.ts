import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'
import { getCsrfToken, setCsrfCookie } from '@/lib/csrf'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it so the user is
  // never redirected, which can cause issues.

  // This will automatically refresh the session if expired using the refresh token
  // Supabase SSR handles session refresh automatically via cookies
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated but not an admin, and accessing admin area,
  // redirect to admin login (prevents non-admins from loading the admin shell)
  if (
    user &&
    request.nextUrl.pathname.startsWith('/9165980203') &&
    !request.nextUrl.pathname.startsWith('/9165980203/login')
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    if (!profile?.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/9165980203/login'
      return NextResponse.redirect(url)
    }
  }

  // If no user and we're on a protected route, redirect to login
  // This handles expired sessions and users who aren't logged in
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/9165980203/login') &&
    request.nextUrl.pathname.startsWith('/9165980203')
  ) {
    // Session expired or no session - redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/9165980203/login'
    return NextResponse.redirect(url)
  }

  // Session is valid (or was refreshed automatically)
  // The supabaseResponse contains updated cookies with refreshed session

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  // Ensure CSRF cookie exists for all browser requests
  const existingCsrf = request.cookies.get('csrf-token')?.value
  if (!existingCsrf) {
    const token = await getCsrfToken(request)
    setCsrfCookie(supabaseResponse, token)
  }

  return supabaseResponse
}

