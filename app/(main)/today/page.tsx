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

  const badgeColorMap: Record<string, string> = {
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    gray: "bg-white/10 text-white/50 border-white/20",
  };

  return (
    <div className="p-4 text-white min-h-full bg-black space-y-4">
      {/* A) Hero - 核心结论卡 */}
      <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs text-white/40">市场状态</div>
            <div className="text-2xl font-bold text-red-400">{weatherTitle}</div>
          </div>
          <div className="text-right text-xs text-white/50">
            <div>更新时间</div>
            <div className="text-white/70">{generatedAt}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-white/5">
            <div className="text-xs text-white/50 mb-1">建议仓位</div>
            <div className="text-xl font-bold text-green-400">
              {riskCap != null ? `≤ ${riskCap}%` : "暂无数据"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-1 text-xs text-white/50 mb-1">
              <span>波动状态</span>
              <span className="text-[10px] text-purple-400">(Gamma视角)</span>
              <span className="px-1 py-0.5 text-[8px] rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">PRO</span>
            </div>
            <ProGate lockedMessage="升级 Pro 查看">
              <div className="text-xl font-bold text-yellow-400">{gammaTitle}</div>
            </ProGate>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/alerts"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
          >
            查看风险
          </Link>
          <Link
            href="/radar"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
          >
            查看数据
          </Link>
        </div>

        <AIInput />
      </div>

      {/* B) AI 解读 - VIP+ */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div className="text-sm font-semibold mb-3">AI 解读</div>
        <VIPGate lockedMessage="AI 解读需要 VIP 订阅">
          <div className="space-y-3">
            <div className="text-sm text-white/90 font-medium">{oneLiner}</div>
            <div className="text-sm text-white/70">{marketComment}</div>
            {(bearish.length > 0 || bullish.length > 0) && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="text-xs text-red-400 mb-2">空方信号</div>
                  {bearish.length > 0 ? (
                    bearish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 mb-1">• {item}</div>
                    ))
                  ) : (
                    <div className="text-xs text-white/50">暂无</div>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-xs text-green-400 mb-2">多方信号</div>
                  {bullish.length > 0 ? (
                    bullish.map((item: string, i: number) => (
                      <div key={i} className="text-xs text-white/70 mb-1">• {item}</div>
                    ))
                  ) : (
                    <div className="text-xs text-white/50">暂无</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </VIPGate>
      </div>

      {/* C) 策略建议 - PRO */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">策略建议</span>
          <span className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
            PRO
          </span>
        </div>
        <ProGate lockedMessage="升级 Pro 解锁策略建议">
          {proStrategyText ? (
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">{proStrategyText}</pre>
          ) : (
            <div className="text-sm text-white/50">暂无在线策略输出</div>
          )}
        </ProGate>
      </div>
    </div>
  );
}
