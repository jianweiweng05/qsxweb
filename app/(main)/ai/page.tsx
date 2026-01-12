"use client";

export default function AIPage() {
  return (
    <div
      className="h-screen bg-cover bg-center relative flex flex-col overflow-hidden"
      style={{ backgroundImage: "url(/bg-stars.jpg)" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 30%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col px-4 max-w-[420px] w-full mx-auto">
        {/* Status Bar - iOS style */}
        <div className="flex items-center justify-between pt-3 pb-2 text-white text-[14px] font-medium">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
              <rect x="0" y="4" width="3" height="8" rx="1" opacity="0.3"/>
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" opacity="0.5"/>
              <rect x="9" y="1" width="3" height="11" rx="1" opacity="0.7"/>
              <rect x="13.5" y="0" width="3" height="12" rx="1"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 2.4c2.7 0 5.2 1.1 7 2.9l-1.4 1.4c-1.4-1.4-3.4-2.3-5.6-2.3s-4.2.9-5.6 2.3L1 5.3c1.8-1.8 4.3-2.9 7-2.9zm0 3c1.8 0 3.4.7 4.6 1.9l-1.4 1.4c-.8-.8-2-1.3-3.2-1.3s-2.4.5-3.2 1.3L3.4 7.3C4.6 6.1 6.2 5.4 8 5.4zm0 3c.9 0 1.7.4 2.3 1l-2.3 2.6-2.3-2.6c.6-.6 1.4-1 2.3-1z"/>
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
              <rect x="0" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
              <rect x="21.5" y="4" width="1.5" height="4" rx="0.5" opacity="0.4"/>
              <rect x="2" y="3" width="17" height="6" rx="1" fill="#34D399"/>
            </svg>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center pt-8">
          {/* Two Column Layout */}
          <div className="flex gap-4 mb-8 items-start">
            {/* Left Card - Status */}
            <div
              className="flex-1 rounded-[20px] p-5 backdrop-blur-xl border border-emerald-500/20"
              style={{
                background:
                  "linear-gradient(160deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 40%, rgba(0,0,0,0.5) 100%)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  当前状态
                </span>
              </div>
              <div className="text-[28px] font-bold text-emerald-400 mb-1">
                健康牛市
              </div>
              <div className="text-[12px] text-white/40 mb-5">
                当前趋势稳定，波动可控
              </div>
              <div className="text-[10px] text-white/30 mb-2">建议仓位</div>
              <div className="text-[36px] font-bold text-white leading-none">
                60%-80%
              </div>
            </div>

            {/* Right Card - Upgrade */}
            <div
              className="w-[136px] rounded-[20px] p-4 backdrop-blur-xl border border-white/10 flex flex-col"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-3">
                解锁更多
              </div>
              <div className="space-y-2.5 text-[12px] text-white/50 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>风险预警</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>实时分析</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span>
                  <span>专属策略</span>
                </div>
              </div>
              <button className="mt-4 w-full py-2.5 rounded-xl bg-white/10 text-[11px] text-white/70 font-medium">
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              className="w-full px-4 py-3 rounded-[14px] text-[13px] text-white/50 text-left backdrop-blur-xl border border-white/[0.06] active:scale-[0.98] transition-transform"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              为什么现在是健康牛市？
            </button>
            <button
              className="w-full px-4 py-3 rounded-[14px] text-[13px] text-white/50 text-left backdrop-blur-xl border border-white/[0.06] active:scale-[0.98] transition-transform"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              仓位为什么不是100%？
            </button>
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="pb-6 pt-4">
          <div
            className="rounded-[16px] px-4 py-3 backdrop-blur-xl border border-white/[0.08] flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-[12px] text-emerald-400 font-medium">
              N
            </div>
            <input
              type="text"
              placeholder="问问当前市场风险..."
              className="flex-1 bg-transparent text-[14px] text-white/90 placeholder:text-white/30 outline-none"
            />
            <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 active:scale-95 transition-transform flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H10M17 7V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
