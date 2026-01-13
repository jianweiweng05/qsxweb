import { getReportPayload } from "@/app/lib/qsx_api";
import { ProGate } from "@/app/lib/gate";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  let payload;
  try {
    payload = await getReportPayload();
  } catch {
    return (
      <div className="p-4 text-white min-h-full bg-black/90">
        <h1 className="text-xl font-bold mb-4">今日概览</h1>
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50">
          <div className="text-red-400 font-semibold mb-2">⚠️ 当前市场数据不可用或延迟</div>
          <div className="text-sm text-white/60">请稍后刷新或检查系统状态</div>
        </div>
      </div>
    );
  }

  const macroState = payload.macro_state || "unknown";
  const riskCap = ((payload.risk_cap || 0) * 100).toFixed(2);
  const oneLiner = payload.ai_json?.one_liner || "暂无数据";
  const marketComment = payload.ai_json?.market_comment || "";

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">今日概览</h1>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        {/* 左列：主决策数据 */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-sm text-white/50 mb-1">市场状态</div>
            <div className="text-lg font-semibold">{macroState}</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-sm text-white/50 mb-1">仓位上限</div>
            <div className="text-lg font-semibold">{riskCap}%</div>
          </div>
          <div className="text-sm text-white/50 mb-2">策略建议</div>
          <ProGate>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm">Pro 策略建议（占位）</div>
            </div>
          </ProGate>
        </div>
        {/* 右列：解释/详情 */}
        <div className="space-y-4 mt-4 lg:mt-0">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-sm text-white/50 mb-1">解读</div>
            <div className="text-sm">{oneLiner}</div>
            {marketComment && (
              <div className="text-sm text-white/70 mt-2 lg:line-clamp-none line-clamp-3">
                {marketComment}
              </div>
            )}
          </div>
          <div className="hidden lg:block p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-sm text-white/50 mb-1">详细分析</div>
            <div className="text-sm text-white/70">桌面端可查看更多市场分析详情</div>
          </div>
        </div>
      </div>
    </div>
  );
}
