"use client";

export default function AIPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: "url(/bg-stars.jpg)" }}
    >
      {/* Overlay with refined gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 30%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative flex-1 flex flex-col px-5 py-4 max-w-[420px] w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-start py-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] backdrop-blur-md border border-white/[0.06] active:scale-95 transition-transform">
            <svg
              width="17"
              height="11"
              viewBox="0 0 17 11"
              fill="none"
              className="text-white/60"
            >
              <path
                d="M1 1h15M1 5.5h15M1 10h15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[200px]" />

        {/* Cards Row */}
        <div className="flex gap-3 mb-3">
          {/* Market Weather Card */}
          <div
            className="flex-1 rounded-[24px] p-4 backdrop-blur-xl border border-emerald-500/30"
            style={{
              background:
                "linear-gradient(165deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.03) 40%, rgba(0,0,0,0.5) 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div className="text-[9px] text-white/35 uppercase tracking-[0.2em] mb-1.5 font-medium">
              Market Weather
            </div>
            <div className="text-[17px] font-semibold text-emerald-400 mb-0.5 tracking-tight">
              健康牛市
            </div>
            <div className="text-[10px] text-white/40 mb-1">建议仓位</div>
            <div className="text-[28px] font-bold text-white tracking-tight leading-none mb-1">
              60%-80%
            </div>
            <div className="text-[10px] text-white/30 leading-relaxed">当前趋势稳定，波动可控</div>
          </div>

          {/* Upgrade Card */}
          <div
            className="flex-1 rounded-[24px] p-4 backdrop-blur-xl border border-white/[0.05]"
            style={{
              background: "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div className="text-[11px] text-white/55 mb-2.5 leading-relaxed font-medium">
              解锁更多市场风险洞察
            </div>
            <ul className="text-[10px] text-white/40 space-y-1.5 mb-2.5">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                风险预警
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                历史对比
              </li>
            </ul>
            {/* Mini Chart */}
            <div className="flex justify-end mb-2.5">
              <svg width="52" height="26" viewBox="0 0 52 26" fill="none">
                <path
                  d="M2 22 L13 17 L24 19 L35 10 L44 5 L50 3"
                  stroke="url(#chartGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="50" cy="3" r="3" fill="#10b981" />
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="52" y2="0">
                    <stop offset="0%" stopColor="#4b5563" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-white text-black active:scale-[0.98] transition-transform">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="flex gap-2.5 mb-3">
          <button
            className="flex-1 px-4 py-3 rounded-[18px] text-[12px] text-white/45 text-left backdrop-blur-xl border border-white/[0.05] active:scale-[0.98] transition-transform"
            style={{ background: "rgba(255,255,255,0.025)" }}
          >
            <span className="text-white/30">为什么</span> 是健康牛市？
          </button>
          <button
            className="flex-1 px-4 py-3 rounded-[18px] text-[12px] text-white/45 text-left backdrop-blur-xl border border-white/[0.05] active:scale-[0.98] transition-transform"
            style={{ background: "rgba(255,255,255,0.025)" }}
          >
            仓位为什么不是100%？
          </button>
        </div>

        {/* Input Area */}
        <div
          className="rounded-[20px] px-4 py-3 backdrop-blur-xl border border-white/[0.06] flex items-center gap-3 mb-10"
          style={{
            background: "rgba(255,255,255,0.035)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <input
            type="text"
            placeholder="问问当前市场风险..."
            className="flex-1 bg-transparent text-[14px] text-white/90 placeholder:text-white/25 outline-none"
          />
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white active:scale-95 transition-transform flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H10M17 7V14" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
