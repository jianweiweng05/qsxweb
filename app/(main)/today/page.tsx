import Link from "next/link";
import { getReportPayload } from "@/app/lib/qsx_api";
import { VIPGate, ProGate } from "@/app/lib/gate";
import { AIInput } from "./ai-input";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  let payload: any = null;
  try {
    payload = await getReportPayload();
  } catch {
    payload = null;
  }

  // A) Hero 字段
  const weatherTitle = payload?.weather?.title || "暂无数据";
  const generatedAt = payload?.generated_at
    ? new Date(payload.generated_at).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
    : "暂无数据";
  const riskCap = payload?.risk_cap != null ? Math.round(payload.risk_cap * 100 * 10) / 10 : null;
  const gammaTitle = payload?.gamma?.title || "暂无数据";

  // B) AI 解读
  const oneLiner = payload?.ai_json?.one_liner || "暂无数据";
  const marketComment = payload?.ai_json?.market_comment || "暂无数据";
  const bearish = payload?.ai_json?.collision?.bearish_2 || [];
  const bullish = payload?.ai_json?.collision?.bullish_2 || [];

  // C) 策略建议 - 使用 pro_strategy_text 字段
  const proStrategyText = payload?.pro_strategy_text;

  return (
    <div className="w-full min-h-full bg-black pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 text-white">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="text-xl font-semibold">今日概览</h1>
          <span className="text-xs text-white/40">{generatedAt}</span>
        </div>

        {/* KPI Row - 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* 建议仓位 - 视觉最强 */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30">
            <div className="text-xs text-white/50 mb-1">建议仓位</div>
            <div className="text-3xl font-bold text-cyan-400">
              {riskCap != null ? `≤ ${riskCap}%` : "—"}
            </div>
          </div>
          {/* 市场状态 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-white/50 mb-1">市场状态</div>
            <div className="text-2xl font-semibold text-red-400">{weatherTitle}</div>
          </div>
          {/* 波动状态 */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-1">
              <span>波动状态</span>
              <span className="text-[10px] text-purple-400/70">(Gamma)</span>
              <span className="px-1 py-0.5 text-[8px] rounded bg-purple-500/20 text-purple-400/80 border border-purple-500/20">PRO</span>
            </div>
            <ProGate lockedMessage="升级 Pro 查看">
              <div className="text-2xl font-semibold text-yellow-400">{gammaTitle}</div>
            </ProGate>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <Link
            href="/alerts"
            className="flex items-center justify-center py-3 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
          >
            查看风险
          </Link>
          <Link
            href="/radar"
            className="flex items-center justify-center py-3 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
          >
            查看数据
          </Link>
        </div>

        <AIInput />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Left: AI 解读 */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="text-sm font-semibold mb-4">AI 解读</div>
            <VIPGate lockedMessage="AI 解读需要 VIP 订阅">
              <div className="space-y-3 max-w-prose">
                <div className="text-sm text-white/90 font-medium leading-relaxed">{oneLiner}</div>
                <div className="text-sm text-white/70 leading-relaxed">{marketComment}</div>
              </div>
            </VIPGate>
          </div>

          {/* Right: 多空信号 */}
          {(bearish.length > 0 || bullish.length > 0) && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="text-xs text-red-400 mb-2">空方信号</div>
                <VIPGate lockedMessage="VIP 可见">
                  {bearish.length > 0 ? (
                    bearish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 mb-1 leading-relaxed">• {item}</div>
                    ))
                  ) : (
                    <div className="text-xs text-white/40">暂无</div>
                  )}
                </VIPGate>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-green-400 mb-2">多方信号</div>
                <VIPGate lockedMessage="VIP 可见">
                  {bullish.length > 0 ? (
                    bullish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 mb-1 leading-relaxed">• {item}</div>
                    ))
                  ) : (
                    <div className="text-xs text-white/40">暂无</div>
                  )}
                </VIPGate>
              </div>
            </div>
          )}
        </div>

        {/* 策略建议 */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-5 mt-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">策略建议</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-400/80 border border-purple-500/20">
              PRO
            </span>
          </div>
          <ProGate lockedMessage="升级 Pro 解锁策略建议">
            {proStrategyText ? (
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed max-w-prose">{proStrategyText}</pre>
            ) : (
              <div className="text-sm text-white/40">暂无在线策略输出</div>
            )}
          </ProGate>
        </div>
      </div>
    </div>
  );
}
