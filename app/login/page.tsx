import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-12 text-center text-4xl font-bold text-white">
          Sign In to QuantscopeX
        </h1>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-sm text-gray-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="mb-2 block text-sm text-gray-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
            />
          </div>
          <Link
            href="/app"
            className="block w-full rounded-lg bg-white py-3 text-center text-lg font-semibold text-black transition-all hover:bg-gray-200"
          >
            Sign In
          </Link>
          <p className="mt-6 text-center text-sm text-gray-500">
            Demo mode - click Sign In to continue
          </p>
        </div>
      </div>
    </main>
  );
}
