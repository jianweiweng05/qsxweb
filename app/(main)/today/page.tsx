import { getReportPayload } from "@/app/lib/qsx_api";
import { VIPGate, ProGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const tier = getUserTier();
  
  // FREE 用户显示延迟日报提示
  if (tier === "FREE") {
    return (
      <div className="p-4 text-white min-h-full bg-black/90">
        <h1 className="text-xl font-bold mb-4">今日概览</h1>
        <VIPGate lockedMessage="当日日报需要 VIP 订阅">
          <></>
        </VIPGate>
        <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-2">延迟历史日报</div>
          <div className="text-sm text-white/70">
            免费用户可查看 3-7 天前的历史日报，请访问历史页面。
          </div>
        </div>
      </div>
    );
  }

  // VIP/PRO 用户获取当日数据
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
          <ProGate lockedMessage="策略建议需要 Pro 订阅">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm">Pro 策略建议（占位）</div>
            </div>
          </ProGate>
        </div>

        <div className="space-y-4 mt-4 lg:mt-0">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-sm text-white/50 mb-1">AI 解读</div>
            <div className="text-sm">{oneLiner}</div>
            {marketComment && (
              <div className="text-sm text-white/70 mt-2 lg:line-clamp-none line-clamp-3">
                {marketComment}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
