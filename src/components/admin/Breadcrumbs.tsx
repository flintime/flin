'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/').filter(Boolean)

  const parts = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/')
    const label = seg === '9165980203' ? 'Dashboard' : seg === 'brand-builder' ? 'Brand Builder' : decodeURIComponent(seg)
    return { href, label }
  })

  if (parts.length <= 1) return null

  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link className="hover:underline" href="/9165980203">Dashboard</Link>
        </li>
        {parts.slice(1).map((p, i) => (
          <li key={p.href} className="flex items-center gap-2">
            <span className="text-gray-400">/</span>
            {i < parts.length - 2 ? (
              <Link className="hover:underline" href={p.href}>{p.label}</Link>
            ) : (
              <span className="text-gray-900 font-medium">{p.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}


