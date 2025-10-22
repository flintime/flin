'use client'

import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function Topbar() {
  return (
    <header className="h-16 w-full border-b border-gray-200 bg-white/70 backdrop-blur-sm">
      <div className="h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/flin.png" alt="Flin" width={28} height={28} className="rounded" />
          <span className="text-sm text-gray-600">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <span>System</span>
            <span className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <button
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/9165980203/login'
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}


