'use client';

import { useState } from 'react';

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const [period, setPeriod] = useState<'am' | 'pm'>('am');
  const today = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-12 text-[clamp(2rem,4vw,3rem)] font-bold text-white">
          Daily Reports
        </h1>

        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setPeriod('am')}
            className={`rounded-lg px-6 py-3 font-semibold transition-all ${
              period === 'am'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'border border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:text-white'
            }`}
          >
            Today AM
          </button>
          <button
            onClick={() => setPeriod('pm')}
            className={`rounded-lg px-6 py-3 font-semibold transition-all ${
              period === 'pm'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'border border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:text-white'
            }`}
          >
            Today PM
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-white">Report Window Rules</h2>
          <div className="space-y-3 text-gray-400">
            <p>
              <span className="font-semibold text-white">AM Window:</span> Covers market activity from 00:00 UTC to 12:00 UTC
            </p>
            <p>
              <span className="font-semibold text-white">PM Window:</span> Covers market activity from 12:00 UTC to 23:59 UTC
            </p>
            <p className="text-sm text-gray-500">
              Reports are generated with comprehensive analysis of price action, volume patterns, and risk metrics for the specified window.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {period === 'am' ? 'Morning Report' : 'Afternoon Report'}
            </h3>
            <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-gray-300">
              {today}
            </span>
          </div>
          <p className="mb-6 text-gray-400">
            Click below to view the full {period === 'am' ? 'morning' : 'afternoon'} report with detailed market analysis, risk assessments, and position recommendations.
          </p>
          <a
            href={`https://qsx-ai.onrender.com/macro/v1/reportv2?window_id=${today}@${period}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            Open {period.toUpperCase()} Report
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Report Sections</div>
            <div className="mb-4 text-2xl font-bold text-white">8</div>
            <div className="text-xs text-gray-500">Market overview, technicals, risk, positions</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Assets Covered</div>
            <div className="mb-4 text-2xl font-bold text-white">15+</div>
            <div className="text-xs text-gray-500">Major crypto assets and indices</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-2 text-sm text-gray-400">Update Frequency</div>
            <div className="mb-4 text-2xl font-bold text-white">2x</div>
            <div className="text-xs text-gray-500">Daily AM and PM reports</div>
          </div>
        </div>
      </div>
    </main>
  );
}
