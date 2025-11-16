import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { logger } from '@/lib/error-logger'

/**
 * Creates a Supabase client with service role key (bypasses RLS)
 * WARNING: Only use this in server-side API routes with proper authentication checks
 * Never expose the service role key to the client
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (!supabaseServiceKey) {
    // Log warning but don't throw - allow fallback for development
    logger.warn('SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key. RLS policies will still apply.', {
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
    
    // Fallback to anon key if service role key is not set
    const fallbackKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!fallbackKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
    }
    
    return createClient<Database>(supabaseUrl, fallbackKey)
  }
  
  // Verify it's actually a service role key (starts with 'eyJ' and is longer than anon key)
  // Service role keys are typically longer JWT tokens
  if (supabaseServiceKey.length < 100) {
    logger.warn('SUPABASE_SERVICE_ROLE_KEY appears to be invalid (too short). Service role keys are typically long JWT tokens.', {
      keyLength: supabaseServiceKey.length
    })
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

