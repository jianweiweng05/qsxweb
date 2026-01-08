import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-6 py-40">
        <div className="text-center">
          <h1 className="mb-8 text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[1.1] tracking-tight text-white">
            See Market Risk Before Price Moves
          </h1>
          <p className="mx-auto mb-16 max-w-xl text-xl text-gray-400">
            AI-powered regime detection and risk signals for crypto markets
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
          <p className="mt-12 text-sm text-gray-500">Not investment advice.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-xl font-semibold text-white">Regime First</h3>
            <p className="text-gray-400">Know when the market structure changes</p>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-semibold text-white">Risk Radar</h3>
            <p className="text-gray-400">Dynamic caps based on current volatility</p>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-semibold text-white">Actionable Alerts</h3>
            <p className="text-gray-400">Signals that matter, not noise</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 text-4xl">👁</div>
            <h3 className="mb-2 text-lg font-semibold text-white">Observe</h3>
            <p className="text-sm text-gray-400">Track regime and volatility shifts</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl">🎯</div>
            <h3 className="mb-2 text-lg font-semibold text-white">Decide</h3>
            <p className="text-sm text-gray-400">Get position sizing recommendations</p>
          </div>
          <div className="text-center">
            <div className="mb-4 text-4xl">⚡</div>
            <h3 className="mb-2 text-lg font-semibold text-white">Act</h3>
            <p className="text-sm text-gray-400">Execute with confidence</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-40">
        <div className="text-center">
          <h2 className="mb-8 text-[clamp(2.5rem,5vw,4rem)] font-bold text-white">
            Start with clarity, not noise.
          </h2>
          <Link
            href="/app"
            className="inline-block rounded-lg bg-white px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-gray-200"
          >
            Open Web App
          </Link>
        </div>
      </section>
    </main>
  );
}
