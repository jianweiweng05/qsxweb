import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="flex min-h-screen items-center justify-center px-6 py-32">
        <div className="max-w-4xl text-center">
          <h1 className="mb-16 text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-[1.15] tracking-tight text-white">
            See Market Risk<br />Before Price Moves
          </h1>
          <p className="mb-20 text-[clamp(1.125rem,2vw,1.375rem)] text-gray-400">
            AI-powered regime detection for crypto markets
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-white px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-gray-200"
            >
              Sign In
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-white/20 px-10 py-4 text-lg font-semibold text-white transition-all hover:border-white/40"
            >
              Open App
            </Link>
          </div>
          <p className="mt-20 text-xs text-gray-600">Not investment advice.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Regime First</h3>
            <p className="text-gray-400">Know when market structure changes</p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Risk Radar</h3>
            <p className="text-gray-400">Dynamic caps based on volatility</p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-semibold text-white">Actionable Alerts</h3>
            <p className="text-gray-400">Signals that matter, not noise</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <Link
          href="/login"
          className="inline-block rounded-lg bg-white px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-gray-200"
        >
          Sign In to App
        </Link>
      </section>
    </main>
  );
}
