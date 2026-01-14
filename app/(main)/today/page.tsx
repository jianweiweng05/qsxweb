import Link from "next/link";
import { getReportPayload } from "@/app/lib/qsx_api";
import { VIPGate, ProGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const tier = getUserTier();

  // 获取数据（所有用户都尝试获取，用于 Hero 区展示）
  let payload;
  try {
    payload = await getReportPayload();
  } catch {
    payload = null;
  }

  const macroState = payload?.macro_state || "未知";
  const riskCap = payload?.risk_cap ? (payload.risk_cap * 100).toFixed(0) : "—";
  const riskLevel = payload?.risk_level || 3;
  const aiPoints = payload?.ai_json?.key_points || [];
  const strategySuggestion = payload?.ai_json?.strategy_suggestion || "当前市场存在结构性策略机会";

  // 市场状态映射
  const stateConfig: Record<string, { label: string; color: string }> = {
    bear_panic: { label: "熊市恐慌", color: "text-red-500" },
    bear: { label: "熊市", color: "text-red-400" },
    neutral: { label: "震荡", color: "text-yellow-400" },
    bull: { label: "牛市", color: "text-green-400" },
    bull_euphoria: { label: "牛市狂热", color: "text-green-500" },
    unknown: { label: "未知", color: "text-white/50" },
  };
  const state = stateConfig[macroState] || stateConfig.unknown;

  return (
    <div className="p-4 text-white min-h-full bg-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-xs text-white/40 tracking-widest">QUANTSCOPEX</div>
          <h1 className="text-2xl font-bold">今日决策</h1>
        </div>
        <div className="text-right text-xs text-white/50">
          <div>更新时间</div>
          <div className="text-white/70">09:30 CST</div>
        </div>
      </div>

      {/* Hero Card - 所有用户可见 */}
      <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 mb-4">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-xs rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            核心结论
          </span>
          <span className="text-xs text-white/50">今日唯一判断</span>
        </div>

        {/* 市场状态 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-white/50">市场状态</div>
            <div className={`text-2xl font-bold ${state.color}`}>{state.label}</div>
          </div>
        </div>

        {/* 仓位 & 风险 */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <div className="text-xs text-white/50 mb-1">建议仓位</div>
            <div className="flex items-center gap-1">
              <span className="text-green-400 text-lg">≤</span>
              <span className="text-2xl font-bold text-green-400">{riskCap}%</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">风险等级</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-5 rounded-sm ${i <= riskLevel ? "bg-red-500" : "bg-white/20"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-white/50">{riskLevel}/5</span>
            </div>
          </div>
        </div>

        {/* 警告提示 */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-5">
          <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm text-yellow-200/80">市场处于高风险区间，建议保守操作</span>
        </div>

        {/* 按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/radar"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            查看风险
          </Link>
          <Link
            href="/history"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            查看数据
          </Link>
        </div>
      </div>

      {/* AI 解读区 - VIP/PRO 可见 */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="font-semibold">AI 解读</span>
        </div>
        <VIPGate lockedMessage="AI 解读需要 VIP 订阅">
          <div className="space-y-3">
            {aiPoints.length > 0 ? (
              aiPoints.map((point: string, idx: number) => (
                <div key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 text-xs flex items-center justify-center text-white/50">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-white/80">{point}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 text-xs flex items-center justify-center text-white/50">1</span>
                  <span className="text-sm text-white/80">VIX 指数连续 3 日上行，隐含波动率处于 85 分位</span>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 text-xs flex items-center justify-center text-white/50">2</span>
                  <span className="text-sm text-white/80">美债收益率倒挂加深，衰退概率模型输出 67%</span>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 text-xs flex items-center justify-center text-white/50">3</span>
                  <span className="text-sm text-white/80">资金净流出加密市场，稳定币占比升至 42%</span>
                </div>
              </>
            )}
          </div>
        </VIPGate>
      </div>

      {/* 策略建议区 - 仅 PRO 可见 */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-semibold">策略建议</span>
          </div>
          <span className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
            PRO 专属
          </span>
        </div>
        <ProGate lockedMessage="升级 Pro 解锁完整策略判断">
          <div className="text-sm text-white/80">{strategySuggestion}</div>
        </ProGate>
      </div>
    </div>
  );
}
