import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { logger } from '@/lib/error-logger'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifyCsrfToken } from '@/lib/csrf'

const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required')
})

// Rate limiting: 5 attempts per 15 minutes per IP
const RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5
}

export async function POST(request: NextRequest) {
  try {
    // CSRF protection (double submit): if a CSRF cookie exists, require a matching header.
    // This avoids blocking first-time requests before the cookie has been issued.
    const csrfCookie = request.cookies.get('csrf-token')?.value
    if (csrfCookie) {
      const csrfOk = await verifyCsrfToken(request)
      if (!csrfOk) {
        return NextResponse.json(
          { error: 'Invalid or missing CSRF token' },
          { status: 403 }
        )
      }
    }

    // Rate limiting check
    const identifier = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(`login:${identifier}`, RATE_LIMIT_OPTIONS)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 900),
            'X-RateLimit-Limit': String(RATE_LIMIT_OPTIONS.maxRequests),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Invalid request' },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Create Supabase client with cookie handling for API routes
    const cookieStore = await cookies()
    
    // Store cookies that Supabase sets during login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookiesToSet: Array<{ name: string; value: string; options?: any }> = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSetArray) {
            cookiesToSetArray.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
              // Store cookies to add to response
              cookiesToSet.push({ name, value, options })
            })
          },
        },
      }
    )

    // Attempt login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (authError) {
      // Don't reveal whether email exists or not (security best practice)
      logger.warn('Failed login attempt', authError, {
        email: email,
        ip: identifier
      })
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Verify admin status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      // Sign out the user if they're not an admin
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Create JSON response with user data
    const jsonResponse = NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    })

    // Set all cookies that Supabase created during login
    // These are the session cookies needed for authentication
    cookiesToSet.forEach(({ name, value, options }) => {
      jsonResponse.cookies.set(name, value, options)
    })

    return jsonResponse

  } catch (error) {
    logger.error('Login API error', error, {
      endpoint: '/api/admin/login',
      method: 'POST',
      ip: getClientIdentifier(request)
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

