'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TopNav() {
  const pathname = usePathname()
  if (pathname?.startsWith('/landing')) return null

  return (
    <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <div style={{ fontWeight: 600 }}>QuantscopeX</div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 18, opacity: 0.9 }}>
        <Link href="/app">App</Link>
        <Link href="/reports">Reports</Link>
        <Link href="/alerts">Alerts</Link>
        <Link href="/ai">AI</Link>
      </div>
    </div>
  )
}