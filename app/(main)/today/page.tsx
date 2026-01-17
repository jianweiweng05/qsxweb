import { getReportPayload } from "@/app/lib/qsx_api";
import { VIPGate, ProGate } from "@/app/lib/gate";

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
    ? new Date(payload.generated_at).toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
    })
    : "暂无数据";
  const riskCap =
    payload?.risk_cap != null
      ? Math.round(payload.risk_cap * 100 * 10) / 10
      : null;
  const gammaTitle = payload?.gamma?.title || "暂无数据";

  // B) AI 解读
  const oneLiner = payload?.ai_json?.one_liner || "暂无数据";
  const marketComment = payload?.ai_json?.market_comment || "暂无数据";
  const bearish = payload?.ai_json?.collision?.bearish_2 || [];
  const bullish = payload?.ai_json?.collision?.bullish_2 || [];

  return (
    <div className="py-6 pb-24 text-white">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="text-xl font-semibold">今日概览</h1>
        <span className="text-xs text-white/40">{generatedAt}</span>
      </div>

      {/* KPI Row - 第一屏：3块等高等宽，只有建议仓位高亮 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {/* 市场状态 */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/40 mb-2">市场状态</div>
          <div className="text-2xl font-semibold text-white/90">
            {weatherTitle}
          </div>
        </div>

        {/* 建议仓位 - 唯一高亮 */}
        <div className="p-5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
          <div className="text-xs text-white/50 mb-2">建议仓位</div>
          <div className="text-3xl font-bold text-cyan-400">
            {riskCap != null ? `≤ ${riskCap}%` : "—"}
          </div>
        </div>

        {/* 波动状态 */}
        <div className="p-5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-white/40 mb-2">
            <span>波动状态</span>
            <span className="text-[9px] text-white/30">(Gamma)</span>
            <span className="px-1 py-0.5 text-[8px] rounded bg-white/5 text-white/40 border border-white/10">
              PRO
            </span>
          </div>
          <ProGate
            lockedMessage="升级 Pro 查看"
            unlockConfig={{
              title: "波动状态监控",
              description: "实时追踪市场波动率变化，帮助您把握市场节奏，优化进出场时机。",
              features: [
                "Gamma 波动率实时监控",
                "市场情绪波动预警",
                "历史波动率对比分析"
              ]
            }}
          >
            <div className="text-2xl font-semibold text-white/90">
              {gammaTitle}
            </div>
          </ProGate>
        </div>
      </div>

      {/* AI 解读区 - 独立一块，中性背景 */}
      <div className="rounded-lg bg-white/6 border border-white/10 p-5 mt-8">
        <div className="text-sm font-medium text-white/60 mb-4">机构分析师观点</div>
        <VIPGate
          lockedMessage="AI 解读需要 VIP 订阅"
          unlockConfig={{
            title: "AI 市场解读",
            description: "基于多维度数据分析，为您提供专业的市场解读和投资建议。",
            features: [
              "每日市场核心观点总结",
              "多空信号智能识别",
              "关键风险点提示"
            ]
          }}
        >
          <div className="space-y-3">
            <div className="text-sm text-white/95 font-medium leading-relaxed">
              {oneLiner}
            </div>
            <div className="text-sm text-white/70 leading-relaxed">
              {marketComment}
            </div>
          </div>
        </VIPGate>
      </div>

      {/* 多空信号区 - 降低透明度 */}
      {(bearish.length > 0 || bullish.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-red-500/8 border border-red-500/15">
            <div className="text-xs text-red-400/80 mb-2">空方信号</div>
            <VIPGate lockedMessage="VIP 可见">
              {bearish.length > 0 ? (
                bearish.map((item: string, i: number) => (
                  <div
                    key={i}
                    className="text-xs text-white/70 mb-1 leading-relaxed"
                  >
                    • {item}
                  </div>
                ))
              ) : (
                <div className="text-xs text-white/40">暂无</div>
              )}
            </VIPGate>
          </div>

          <div className="p-4 rounded-lg bg-green-500/8 border border-green-500/15">
            <div className="text-xs text-green-400/80 mb-2">多方信号</div>
            <VIPGate lockedMessage="VIP 可见">
              {bullish.length > 0 ? (
                bullish.map((item: string, i: number) => (
                  <div
                    key={i}
                    className="text-xs text-white/70 mb-1 leading-relaxed"
                  >
                    • {item}
                  </div>
                ))
              ) : (
                <div className="text-xs text-white/40">暂无</div>
              )}
            </VIPGate>
          </div>
        </div>
      )}

      {/* 风险提示 */}
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mt-6">
        <div className="text-sm font-medium text-red-400 mb-2">📌 风险提示</div>
        <div className="text-xs text-white/60 leading-relaxed">
          本系统提供的所有内容均为市场研究与风险分析参考，不构成任何形式的投资建议或收益承诺。数字资产价格波动剧烈，请用户根据自身风险承受能力独立决策。
        </div>
      </div>

    </div>
  );
}