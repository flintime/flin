import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const CSRF_TOKEN_COOKIE = 'csrf-token'
const CSRF_TOKEN_HEADER = 'x-csrf-token'
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Get or create CSRF token for a request.
 * NOTE: When generating a new token on the server, you are responsible
 * for setting the cookie on the response with `setCsrfCookie`.
 */
export async function getCsrfToken(request?: NextRequest): Promise<string> {
  if (request) {
    // Check cookie from request
    const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE)?.value
    if (cookieToken) {
      return cookieToken
    }
  } else {
    // Check server-side cookies
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value
    if (cookieToken) {
      return cookieToken
    }
  }

  // Generate new token
  return generateCsrfToken()
}

/**
 * Verify CSRF token from request
 */
export async function verifyCsrfToken(request: NextRequest): Promise<boolean> {
  const tokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER)
  const tokenFromCookie = request.cookies.get(CSRF_TOKEN_COOKIE)?.value

  if (!tokenFromHeader || !tokenFromCookie) {
    return false
  }

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(tokenFromHeader),
    Buffer.from(tokenFromCookie)
  )
}

/**
 * Set CSRF token header on a Response (for debugging / non-browser clients)
 */
export function setCsrfTokenHeader(response: Response, token: string): void {
  response.headers.set(CSRF_TOKEN_HEADER, token)
}

/**
 * Set CSRF token cookie on a NextResponse.
 * This should be called from server-side handlers when issuing a new token.
 */
export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_TOKEN_COOKIE, token, {
    // Not httpOnly so that client-side code can read it and send it in a header
    // for double-submit CSRF protection. Security relies on SameSite + origin,
    // not on the token being httpOnly.
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: CSRF_TOKEN_EXPIRY / 1000,
    path: '/',
  })
}

