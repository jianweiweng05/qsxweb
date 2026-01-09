'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  const isLoggedIn = pathname !== '/login' && pathname !== '/signin';

  const publicLinks = [
    { href: '/login', label: 'Sign In' },
  ];

  const appLinks = [
    { href: '/app', label: 'App' },
    { href: '/reports', label: 'Reports' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/ai', label: 'AI' },
  ];

  const links = isLoggedIn ? appLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          QuantscopeX
        </Link>
        <div className="flex gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
