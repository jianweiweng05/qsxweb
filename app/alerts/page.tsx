'use client';

export default function AlertsPage() {
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-[clamp(2rem,4vw,3rem)] font-bold text-white">
          Market Alerts
        </h1>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 backdrop-blur-sm">
            <div className="mb-2 text-sm text-red-300">Critical Alerts</div>
            <div className="mb-4 text-5xl font-bold text-red-400">0</div>
            <div className="text-xs text-red-300/70">Immediate action required</div>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-8 backdrop-blur-sm">
            <div className="mb-2 text-sm text-yellow-300">Warning Alerts</div>
            <div className="mb-4 text-5xl font-bold text-yellow-400">2</div>
            <div className="text-xs text-yellow-300/70">Monitor closely</div>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 backdrop-blur-sm">
            <div className="mb-2 text-sm text-green-300">Info Alerts</div>
            <div className="mb-4 text-5xl font-bold text-green-400">1</div>
            <div className="text-xs text-green-300/70">For your awareness</div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-2xl font-bold text-white">Top Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/20">
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold text-white">Volatility Threshold Exceeded</h3>
                  <span className="text-sm text-gray-400">12 min ago</span>
                </div>
                <p className="mb-2 text-gray-400">
                  BTC 4H realized volatility has exceeded 65% threshold. Consider reducing position sizes or tightening stops.
                </p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="rounded bg-white/10 px-2 py-1">BTC</span>
                  <span className="rounded bg-white/10 px-2 py-1">4H Timeframe</span>
                  <span className="rounded bg-white/10 px-2 py-1">Risk Management</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500/20">
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold text-white">Correlation Breakdown Detected</h3>
                  <span className="text-sm text-gray-400">1 hour ago</span>
                </div>
                <p className="mb-2 text-gray-400">
                  ETH-BTC correlation has dropped below 0.7. Portfolio diversification benefits may be increasing.
                </p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="rounded bg-white/10 px-2 py-1">ETH</span>
                  <span className="rounded bg-white/10 px-2 py-1">BTC</span>
                  <span className="rounded bg-white/10 px-2 py-1">Portfolio</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-green-500/30 bg-green-500/5 p-6">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold text-white">Support Level Confirmed</h3>
                  <span className="text-sm text-gray-400">3 hours ago</span>
                </div>
                <p className="mb-2 text-gray-400">
                  BTC has successfully retested $41,800 support level with strong volume. Bullish structure intact.
                </p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="rounded bg-white/10 px-2 py-1">BTC</span>
                  <span className="rounded bg-white/10 px-2 py-1">Technical</span>
                  <span className="rounded bg-white/10 px-2 py-1">Bullish</span>
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </main>
  );
}
