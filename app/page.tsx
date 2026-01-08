'use client';

import Link from 'next/link';

export default function HomePage() {
  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen pt-20">
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="text-center">
          <h1 className="mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-[clamp(2.5rem,6vw,5rem)] font-bold leading-tight text-transparent">
            AI-Powered Market Intelligence
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] text-gray-400">
            Real-time risk monitoring and actionable insights for crypto markets. Stay ahead with QuantscopeX.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/app"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              Open Web App
            </Link>
            <a
              href={`https://qsx-ai.onrender.com/macro/v1/reportv2?window_id=${today}@am`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white/40 hover:bg-white/10"
            >
              View Today&apos;s Report
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Real-Time Monitoring',
              desc: 'Track market regimes and risk levels across multiple timeframes with AI-powered analysis.',
            },
            {
              title: 'Smart Alerts',
              desc: 'Get notified instantly when critical market conditions emerge or risk thresholds are breached.',
            },
            {
              title: 'Daily Reports',
              desc: 'Comprehensive morning and afternoon reports with actionable insights and position recommendations.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <h3 className="mb-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="space-y-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-bold text-white">
                Market Regime Detection
              </h2>
              <p className="mb-6 text-lg text-gray-400">
                Our AI continuously analyzes market conditions to identify regime shifts before they impact your portfolio.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-12 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="h-3 w-3/4 rounded bg-blue-400/30"></div>
                <div className="h-3 w-full rounded bg-purple-400/30"></div>
                <div className="h-3 w-5/6 rounded bg-pink-400/30"></div>
              </div>
            </div>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-12 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="h-3 w-full rounded bg-purple-400/30"></div>
                  <div className="h-3 w-4/5 rounded bg-pink-400/30"></div>
                  <div className="h-3 w-5/6 rounded bg-blue-400/30"></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-bold text-white">
                Risk Management
              </h2>
              <p className="mb-6 text-lg text-gray-400">
                Dynamic risk caps and position sizing recommendations based on current market volatility and your risk profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { metric: '24/7', label: 'Market Monitoring' },
            { metric: '<100ms', label: 'Alert Latency' },
            { metric: '99.9%', label: 'Uptime SLA' },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
            >
              <div className="mb-2 text-4xl font-bold text-white">{item.metric}</div>
              <div className="text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 p-16 text-center backdrop-blur-sm">
          <h2 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-bold text-white">
            Ready to elevate your trading?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
            Join sophisticated traders using AI-powered insights to navigate volatile markets with confidence.
          </p>
          <Link
            href="/app"
            className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Get Started Now
          </Link>
          <p className="mt-8 text-sm text-gray-500">Not investment advice.</p>
        </div>
      </section>
    </main>
  );
}
