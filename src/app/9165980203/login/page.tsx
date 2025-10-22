'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { sessionIsAdminDb, isAdminByUserId } from '@/lib/isAdmin'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (await sessionIsAdminDb(data.session)) router.replace('/9165980203')
    })
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMsg(error.message)
      return
    }
    const userId = data.session?.user?.id || ''
    const allowed = await isAdminByUserId(userId)
    if (!allowed) {
      await supabase.auth.signOut()
      setMsg('Admin access required')
      return
    }
    router.replace('/9165980203')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 border border-black/10 rounded-xl p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input type="email" className="border rounded px-3 py-2 w-full" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="border rounded px-3 py-2 w-full" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-black text-white rounded px-4 py-2 w-full disabled:opacity-50" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </form>
    </div>
  )
}


