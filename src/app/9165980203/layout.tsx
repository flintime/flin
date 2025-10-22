import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import AuthGate from '@/components/admin/AuthGate'
import Breadcrumbs from '@/components/admin/Breadcrumbs'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


