'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { checked, authed, loading } = useAdminAuth()

  // Don't show loading message - middleware handles auth and redirects if needed
  // getSession() is fast (reads from cookies), so loading should be very brief
  // If loading takes too long, middleware will redirect to login
  if (loading && !checked) {
    // Show nothing or a minimal loading state
    // The page will render once auth is verified (very quickly)
    return null
  }

  if (!authed) return null
  return <>{children}</>
}


