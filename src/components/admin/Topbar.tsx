'use client'

import { supabase } from '@/lib/supabase/client'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export default function Topbar() {
  const { user, authed, secondsUntilTimeout } = useAdminAuth()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/9165980203/login'
  }

  return (
    <header className="h-16 border-b border-gray-200 bg-white/70 backdrop-blur-sm fixed top-0 left-0 md:left-64 right-0 z-40 overflow-hidden">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {user?.email && (
            <span className="hidden lg:block text-sm text-gray-600 truncate max-w-[160px]">{user.email}</span>
          )}
          {typeof secondsUntilTimeout === 'number' && secondsUntilTimeout <= 300 && secondsUntilTimeout > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full flex-shrink-0">
              <span>Session expires in {Math.max(1, Math.floor(secondsUntilTimeout / 60))} min</span>
            </div>
          )}
          <button
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors text-gray-700 whitespace-nowrap flex-shrink-0"
            onClick={handleLogout}
            disabled={!authed}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}


