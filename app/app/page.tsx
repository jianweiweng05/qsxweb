'use client';

export default function AppPage() {
  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-[clamp(2rem,4vw,3rem)] font-bold text-white">
          Your Daily Risk Dashboard
        </h1>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Market Regime</div>
            <div className="mb-4 text-3xl font-bold text-white">Neutral</div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Risk Cap</div>
            <div className="mb-4 text-3xl font-bold text-white">65%</div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Active Alerts</div>
            <div className="mb-4 text-3xl font-bold text-yellow-400">3</div>
            <div className="text-xs text-gray-500">2 Yellow, 1 Green</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Position Notes</div>
            <div className="mb-4 text-3xl font-bold text-white">12</div>
            <div className="text-xs text-gray-500">Last updated 2h ago</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://qsx-ai.onrender.com/macro/v1/snapshot"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
            >
              View Snapshot
            </a>
            <a
              href="https://qsx-ai.onrender.com/macro/v1/health"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
            >
              Check Health
            </a>
            <a
              href={`https://qsx-ai.onrender.com/macro/v1/reportv2?window_id=${today}@am`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
            >
              Today&apos;s Report
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-bold text-white">Recent Signals</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-yellow-400"></div>
                <div>
                  <div className="font-semibold text-white">Volatility Spike Detected</div>
                  <div className="text-sm text-gray-400">BTC 4H timeframe - 15 min ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-400"></div>
                <div>
                  <div className="font-semibold text-white">Support Level Holding</div>
                  <div className="text-sm text-gray-400">ETH Daily - 1 hour ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-400"></div>
                <div>
                  <div className="font-semibold text-white">Regime Shift to Neutral</div>
                  <div className="text-sm text-gray-400">Market-wide - 3 hours ago</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-bold text-white">Position Recommendations</h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-white">BTC Long</span>
                  <span className="text-sm text-green-400">Active</span>
                </div>
                <div className="text-sm text-gray-400">Size: 40% | Entry: $42,150</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-white">ETH Long</span>
                  <span className="text-sm text-green-400">Active</span>
                </div>
                <div className="text-sm text-gray-400">Size: 25% | Entry: $2,280</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-white">SOL Long</span>
                  <span className="text-sm text-yellow-400">Watching</span>
                </div>
                <div className="text-sm text-gray-400">Target entry: $98.50</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
