'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface NavItem {
  href: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/9165980203', label: 'Dashboard' },
  { href: '/9165980203/brand-builder', label: 'Brand Builder' },
  { href: '/9165980203/local-offers-builder', label: 'Local Offers Builder' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 bg-white/80 backdrop-blur-sm h-screen fixed left-0 top-0 z-30">
      <div className="h-16 px-4 flex items-center border-b border-gray-200 shrink-0">
        <a href="/9165980203" className="flex items-center gap-3">
          <Image src="/flin.png" alt="Flin" width={40} height={40} className="rounded" />
          <span className="text-xl font-semibold text-gray-900">Admin</span>
        </a>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/9165980203' && pathname?.startsWith(item.href))
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ` +
                    (isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100')
                  }
                >
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500 shrink-0 mt-auto">
        © {new Date().getFullYear()} Flin
      </div>
    </aside>
  )
}


