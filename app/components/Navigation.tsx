'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const isAuthPage = pathname === '/login' || pathname === '/signin';
  const links = isAuthPage
    ? [{ href: '/signin', label: 'Sign In' }]
    : [
      { href: '/app', label: 'App' },
      { href: '/reports', label: 'Reports' },
      { href: '/alerts', label: 'Alerts' },
      { href: '/ai', label: 'AI' },
    ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6 md:py-4">
        <Link href="/" className="text-[17px] font-semibold tracking-tight text-white">
          QuantscopeX
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium transition-colors ${active ? 'text-white' : 'text-white/65 hover:text-white'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}