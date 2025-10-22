'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { sessionIsAdminDb } from '@/lib/isAdmin'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined
    supabase.auth.getSession().then(async ({ data }) => {
      const ok = await sessionIsAdminDb(data.session)
      setAuthed(ok)
      setChecked(true)
      if (!ok) window.location.href = '/9165980203/login'
    })
    // Keep session in sync
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const ok = await sessionIsAdminDb(session)
      setAuthed(ok)
      if (!ok) window.location.href = '/9165980203/login'
    })
    unsub = () => { sub.subscription.unsubscribe() }
    return () => { unsub && unsub() }
  }, [])

  if (!checked) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm text-gray-600">Checking admin session…</div>
      </div>
    )
  }

  if (!authed) return null
  return <>{children}</>
}


