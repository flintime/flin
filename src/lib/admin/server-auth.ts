import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/error-logger'

/**
 * Server-side admin verification utility
 * This should ONLY be used in API routes and server components
 */
export async function verifyAdminServer(request?: NextRequest): Promise<{ isAdmin: boolean; userId?: string; email?: string }> {
  try {
    let supabaseClient
    
    if (request) {
      // Use request cookies for API routes
      const cookieStore = await cookies()
      supabaseClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll() {
              // In API routes, we can't set cookies directly
              // This is handled by middleware
            },
          },
        }
      )
    } else {
      // Use server-side supabase client
      supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      if (userError) {
        logger.debug('Admin verification failed - no user', { error: userError })
      }
      return { isAdmin: false }
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      if (profileError) {
        logger.debug('Admin verification failed - profile error', { error: profileError, userId: user.id })
      }
      return { isAdmin: false }
    }

    return {
      isAdmin: true,
      userId: user.id,
      email: user.email
    }
  } catch (error) {
    logger.error('Admin verification error', error)
    return { isAdmin: false }
  }
}

/**
 * Middleware to protect admin API routes
 */
export async function requireAdmin(request: NextRequest) {
  const adminCheck = await verifyAdminServer(request)
  
  if (!adminCheck.isAdmin) {
    return {
      error: true,
      response: new Response(
        JSON.stringify({ error: 'Unauthorized. Admin access required.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return {
    error: false,
    admin: adminCheck
  }
}

