/**
 * Simple in-memory rate limiter
 * For production, consider using Redis (Upstash) or a dedicated service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Rate limit check
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param options - Rate limit options
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + options.windowMs
    }
    rateLimitStore.set(identifier, newEntry)
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime: newEntry.resetTime
    }
  }

  // Entry exists and is still valid
  if (entry.count >= options.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(identifier, entry)

  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  return ip
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimitMiddleware(
  options: RateLimitOptions
): (request: Request) => RateLimitResult | null {
  return (request: Request) => {
    const identifier = getClientIdentifier(request)
    const result = checkRateLimit(identifier, options)
    
    if (!result.success) {
      return result
    }
    
    return null
  }
}

