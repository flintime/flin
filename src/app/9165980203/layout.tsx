'use client'

import { usePathname } from 'next/navigation'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import AuthGate from '@/components/admin/AuthGate'
import Breadcrumbs from '@/components/admin/Breadcrumbs'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/9165980203/login'

  // Don't wrap login page with AuthGate to avoid redirect loop
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AdminAuthProvider>
      <AuthGate>
        <div className="min-h-screen bg-white text-gray-900">
          <Topbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 pt-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumbs />
                {children}
              </div>
            </main>
          </div>
        </div>
      </AuthGate>
    </AdminAuthProvider>
  )
}


