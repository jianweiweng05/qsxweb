'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const pathname = usePathname()

  // Landing 页面不显示导航
  if (pathname === '/landing') return null

  return (
    <nav
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        background: '#000',
        color: '#fff',
        gap: 16,
      }}
    >
      <strong>QuantscopeX</strong>
      <Link href="/app">App</Link>
      <Link href="/reports">Reports</Link>
      <Link href="/alerts">Alerts</Link>
      <Link href="/ai">AI</Link>
    </nav>
  )
}