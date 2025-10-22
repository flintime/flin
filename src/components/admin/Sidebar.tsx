'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon?: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/9165980203', label: 'Dashboard', icon: '📊' },
  { href: '/9165980203/brand-builder', label: 'Brand Builder', icon: '🏷️' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="h-16 px-4 flex items-center border-b border-gray-200">
        <Link href="/9165980203" className="text-xl font-semibold text-gray-900">
          Admin
        </Link>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/9165980203' && pathname?.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ` +
                    (isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100')
                  }
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        © 2025 Flin.college
      </div>
    </aside>
  )
}


