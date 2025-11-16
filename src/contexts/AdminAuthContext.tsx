'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { sessionIsAdminDb } from '@/lib/isAdmin'

interface AdminAuthContextType {
  checked: boolean
  authed: boolean
  loading: boolean
  user: { id: string; email?: string } | null
  // Session timeout helpers
  expiresAt?: number | null
  secondsUntilTimeout?: number | null
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  checked: false,
  authed: false,
  loading: true,
  user: null,
  expiresAt: null,
  secondsUntilTimeout: null,
})

// Cache auth state across component mounts - persists across page navigations
let cachedAuthState: { checked: boolean; authed: boolean; user: { id: string; email?: string } | null; expiresAt?: number | null } | null = null
let authCheckPromise: Promise<{ ok: boolean; user: { id: string; email?: string } | null; expiresAt?: number | null }> | null = null
let authStateChangeSubscription: { subscription: { unsubscribe: () => void } } | null = null
const stateChangeCallbacks: Set<() => void> = new Set()

// Notify all mounted components of auth state change
function notifyStateChange() {
  stateChangeCallbacks.forEach(cb => cb())
}

// Initialize auth state check once - runs silently in background
// Optimized: Use getSession() first (reads from cookies, faster than getUser())
function initializeAuthCheck() {
  if (authCheckPromise) return authCheckPromise

  // Use getSession() first - it reads from cookies and is faster than getUser()
  // This prevents showing "checking admin session" unnecessarily
  authCheckPromise = supabase.auth.getSession().then(async ({ data: sessionData }) => {
    const session = sessionData.session
    
    if (session?.user) {
      // We have a session! Verify admin status
      const ok = await sessionIsAdminDb(session)
      const user = {
        id: session.user.id,
        email: session.user.email
      }
      const expiresAt = session.expires_at ? session.expires_at * 1000 : null
      cachedAuthState = { checked: true, authed: ok, user: ok ? user : null, expiresAt }
      authCheckPromise = null
      return { ok, user: ok ? user : null, expiresAt }
    } else {
      // No session found
      cachedAuthState = { checked: true, authed: false, user: null, expiresAt: null }
      authCheckPromise = null
      return { ok: false, user: null, expiresAt: null }
    }
  })

  // Set up auth state change listener only once
  // This listener will automatically update when auth state changes
  if (!authStateChangeSubscription) {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const ok = await sessionIsAdminDb(session)
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email
      } : null
      const expiresAt = session?.expires_at ? session.expires_at * 1000 : null
      cachedAuthState = { checked: true, authed: ok, user, expiresAt }
      notifyStateChange()
      if (!ok && _event !== 'SIGNED_OUT') {
        // Only redirect if not already signing out
        window.location.href = '/9165980203/login'
      }
    })
    authStateChangeSubscription = sub
  }

  return authCheckPromise
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // For admin-only routes (all non-login admin pages), the middleware already
  // ensured that only authenticated admins can reach this layout.
  // So when we DON'T have any cached auth state yet, we can safely assume the
  // user is authenticated for the initial render and verify in the background.
  // This avoids a blank screen on the first load of `/9165980203`.
  const [checked, setChecked] = useState(cachedAuthState?.checked ?? false)
  const [authed, setAuthed] = useState(
    cachedAuthState?.authed ??
      true // optimistic: middleware already filtered out non-admins
  )
  const [user, setUser] = useState<{ id: string; email?: string } | null>(cachedAuthState?.user ?? null)
  const [expiresAt, setExpiresAt] = useState<number | null>(cachedAuthState?.expiresAt ?? null)
  const [secondsUntilTimeout, setSecondsUntilTimeout] = useState<number | null>(null)
  // Start with loading: false - getSession() is fast (reads from cookies)
  // Middleware already refreshed the session, so this should be instant
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Callback to update state when cached state changes
    const updateState = () => {
      if (cachedAuthState) {
        setChecked(cachedAuthState.checked)
        setAuthed(cachedAuthState.authed)
        setUser(cachedAuthState.user)
        setExpiresAt(cachedAuthState.expiresAt ?? null)
        setLoading(false)
      }
    }
    
    stateChangeCallbacks.add(updateState)

    // If we have cached state (user already authenticated), use it immediately
    if (cachedAuthState) {
      setChecked(cachedAuthState.checked)
      setAuthed(cachedAuthState.authed)
      setUser(cachedAuthState.user)
      setExpiresAt(cachedAuthState.expiresAt ?? null)
      setLoading(false)
      if (!cachedAuthState.authed) {
        window.location.href = '/9165980203/login'
        return () => {
          stateChangeCallbacks.delete(updateState)
        }
      }
      // Still verify in background silently, but don't block UI
      initializeAuthCheck().then(({ ok, user, expiresAt }) => {
        cachedAuthState = { checked: true, authed: ok, user, expiresAt }
        setChecked(true)
        setAuthed(ok)
        setUser(user)
        setExpiresAt(expiresAt ?? null)
        notifyStateChange()
      }).catch(() => {
        // Silent failure - if check fails, auth state change listener will handle it
      })
      return () => {
        stateChangeCallbacks.delete(updateState)
      }
    }

    // No cached state - check session immediately (fast, reads from cookies)
    // getSession() is fast because middleware already refreshed the session
    // Start check immediately without showing loading
    initializeAuthCheck().then(({ ok, user, expiresAt }) => {
      cachedAuthState = { checked: true, authed: ok, user, expiresAt }
      setChecked(true)
      setAuthed(ok)
      setUser(user)
      setExpiresAt(expiresAt ?? null)
      setLoading(false)
      notifyStateChange()
      if (!ok) {
        window.location.href = '/9165980203/login'
      }
    }).catch(() => {
      // If check fails, set loading to false so page can render
      // Middleware will handle redirect if needed
      setLoading(false)
      setChecked(true)
    })

    return () => {
      stateChangeCallbacks.delete(updateState)
    }
  }, [])

  // Derive countdown for session timeout and auto-logout a bit after expiry
  useEffect(() => {
    if (!expiresAt) {
      setSecondsUntilTimeout(null)
      return
    }

    const updateCountdown = () => {
      const now = Date.now()
      const diffMs = expiresAt - now
      const diffSeconds = Math.floor(diffMs / 1000)
      setSecondsUntilTimeout(diffSeconds > 0 ? diffSeconds : 0)

      // If already expired, force redirect to login
      if (diffSeconds <= 0 && authed) {
        window.location.href = '/9165980203/login'
      }
    }

    updateCountdown()
    const id = setInterval(updateCountdown, 1000)
    return () => clearInterval(id)
  }, [expiresAt, authed])

  return (
    <AdminAuthContext.Provider value={{ checked, authed, loading, user, expiresAt, secondsUntilTimeout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

