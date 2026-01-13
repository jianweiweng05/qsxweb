import { getReportPayload } from "@/app/lib/qsx_api";
import { getUserTier } from "@/app/lib/entitlements";
import Link from "next/link";

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
  const tier = getUserTier();

  const macroState = payload.macro_state || "unknown";
  const riskCap = ((payload.risk_cap || 0) * 100).toFixed(2);
  const oneLiner = payload.ai_json?.one_liner || "暂无数据";
  const marketComment = payload.ai_json?.market_comment || "";

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">今日概览</h1>

      <div className="space-y-4">
        {/* 市场状态 */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">市场状态</div>
          <div className="text-lg font-semibold">{macroState}</div>
        </div>

        {/* 仓位上限 */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">仓位上限</div>
          <div className="text-lg font-semibold">{riskCap}%</div>
        </div>

        {/* 解读 */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">解读</div>
          <div className="text-sm">{oneLiner}</div>
          {marketComment && (
            <div className="text-sm text-white/70 mt-2 line-clamp-3">
              {marketComment}
            </div>
          )}
        </div>

        {/* 策略建议 - 门禁控制 */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">策略建议</div>
          {tier === "PRO" ? (
            <div className="text-sm">Pro 策略建议（占位）</div>
          ) : (
            <div className="text-center py-4">
              <div className="text-white/50 mb-2">🔒 升级 Pro 查看策略</div>
              <Link
                href="/pricing"
                className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-sm"
              >
                升级
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
