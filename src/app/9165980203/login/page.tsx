'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { sessionIsAdminDb } from '@/lib/isAdmin'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [msgType, setMsgType] = useState<'error' | 'success'>('error')
  const [loading, setLoading] = useState(false)

  function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift()
    }
    return undefined
  }

  useEffect(() => {
    // Use getUser() for better performance - reads from cookies directly
    supabase.auth.getUser().then(async ({ data: userData }) => {
      if (userData.user) {
        const { data: sessionData } = await supabase.auth.getSession()
        if (await sessionIsAdminDb(sessionData.session)) {
          router.replace('/9165980203')
        }
      }
    })
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    
    try {
      // Use API route with rate limiting and server-side validation
      const csrfToken = getCookie('csrf-token')

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setMsg(`Too many login attempts. Please try again in ${Math.ceil((data.retryAfter || 900) / 60)} minutes.`)
        } else {
          setMsg(data.error || 'Login failed. Please try again.')
        }
        setMsgType('error')
        setLoading(false)
        return
      }

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('admin_remember_me', 'true')
      }

      setMsg('Login successful! Redirecting...')
      setMsgType('success')
      
      // Wait for session to be established, then redirect
      // Give cookies time to be set by the response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verify session before redirecting
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        // Session is established, redirect
        window.location.href = '/9165980203'
      } else {
        // Session not established yet, try again
        setMsg('Session not established. Please wait...')
        setTimeout(() => {
          window.location.href = '/9165980203'
        }, 1000)
      }
    } catch {
      setMsg('An unexpected error occurred. Please try again.')
      setMsgType('error')
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setMsg('Please enter your email address first.')
      setMsgType('error')
      return
    }

    setLoading(true)
    setMsg(null)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/9165980203/reset-password`,
      })

      if (error) {
        setMsg(error.message)
        setMsgType('error')
      } else {
        setMsg('Password reset email sent! Check your inbox.')
        setMsgType('success')
      }
    } catch {
      setMsg('Failed to send reset email. Please try again.')
      setMsgType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors pr-10"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.29 3.29L12 12m-6.59-6.59l3.29 3.29M12 12l3.29 3.29m0 0a9.97 9.97 0 005.12 2.12m-3.29-3.29L12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-black hover:underline focus:outline-none"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white rounded-lg px-4 py-2.5 font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            {msg && (
              <div className={`p-3 rounded-lg text-sm ${
                msgType === 'error' 
                  ? 'bg-red-50 text-red-800 border border-red-200' 
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {msg}
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Secure admin access • Protected by authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


