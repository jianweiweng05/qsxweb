import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-32">
      <div className="max-w-4xl text-center">
        <h1 className="mb-16 text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-[1.15] tracking-tight text-white">
          See Market Risk<br />Before Price Moves
        </h1>
        <p className="mb-20 text-[clamp(1.125rem,2vw,1.375rem)] text-gray-400">
          AI-powered regime detection for crypto markets
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/app"
            className="rounded-lg bg-white px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-gray-200"
          >
            Open Web App
          </Link>
          <Link
            href="/reports"
            className="rounded-lg border border-white/20 px-10 py-4 text-lg font-semibold text-white transition-all hover:border-white/40"
          >
            View Today&apos;s Report
          </Link>
        </div>
        <p className="mt-20 text-xs text-gray-600">Not investment advice.</p>
      </div>
    </main>
  );
}
