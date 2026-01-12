"use client";

export default function AIPage() {
  return (
    <div className="min-h-screen bg-cover bg-center relative flex flex-col" style={{ backgroundImage: "url(/bg-stars.jpg)" }}>
      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%)" }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col px-4 py-4 max-w-[420px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 backdrop-blur">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="opacity-70">
              <path d="M1 1h18M1 7h18M1 13h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="text-sm font-semibold tracking-tight opacity-50">QuantscopeX</div>
          <div className="w-10" />
        </div>

        {/* Main Info Area */}
        <div className="flex-1 flex flex-col gap-4 pt-4">
          {/* Market Status Card */}
          <div className="rounded-2xl p-5 backdrop-blur" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
            <div className="text-xs opacity-50 uppercase tracking-wide mb-3">Market Weather</div>
            <div className="text-2xl font-semibold tracking-tight text-amber-400 mb-3">震荡市</div>
            <div className="text-sm opacity-70 leading-relaxed mb-4">市场波动加剧，建议控制仓位，等待明确方向。</div>
            <div className="flex items-center gap-3">
              <span className="text-xs opacity-50">建议仓位</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-amber-400/80" style={{ width: "35%" }} />
              </div>
              <span className="text-xs opacity-70">30-40%</span>
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="rounded-2xl p-5 backdrop-blur" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
            <div className="text-xs opacity-50 uppercase tracking-wide mb-3">Upgrade</div>
            <ul className="text-sm opacity-70 space-y-2 mb-4">
              <li>• 实时风险预警推送</li>
              <li>• 多币种深度分析</li>
              <li>• 机构级仓位建议</li>
            </ul>
            <div className="flex gap-3">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/90 text-black">Upgrade to Pro</button>
              <button className="px-4 py-2.5 rounded-xl text-sm opacity-60 bg-white/5">View Plans</button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="flex flex-col gap-2 pt-2">
            {["今天适合加仓吗？", "ETH 当前风险如何？", "BTC 趋势分析"].map((q) => (
              <button key={q} className="text-left px-4 py-3 rounded-xl text-sm opacity-60 bg-white/5 backdrop-blur active:bg-white/10 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
