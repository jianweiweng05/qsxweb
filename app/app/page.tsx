import Link from 'next/link';

export default function AppPage() {
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-16 text-4xl font-bold text-white">
          Dashboard
        </h1>

        <div className="mb-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Market Regime</div>
            <div className="text-3xl font-bold text-white">Neutral</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Risk Level</div>
            <div className="text-3xl font-bold text-white">Medium</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/reports"
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <h3 className="mb-2 text-lg font-semibold text-white">Reports</h3>
              <p className="text-sm text-gray-400">View daily market reports</p>
            </Link>
            <Link
              href="/alerts"
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <h3 className="mb-2 text-lg font-semibold text-white">Alerts</h3>
              <p className="text-sm text-gray-400">Check active alerts</p>
            </Link>
            <Link
              href="/ai"
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <h3 className="mb-2 text-lg font-semibold text-white">AI Assistant</h3>
              <p className="text-sm text-gray-400">Ask market questions</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
