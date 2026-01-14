import { getReportPayload } from "@/app/lib/qsx_api";
import { PageGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const tier = getUserTier();

  // 非 Pro 用户显示锁定页面
  if (tier !== "PRO") {
    return (
      <PageGate requiredTier="PRO" title="报警">
        <></>
      </PageGate>
    );
  }

  // Pro 用户获取数据
  let payload;
  try {
    payload = await getReportPayload();
  } catch {
    return (
      <div className="p-4 text-white min-h-full bg-black/90">
        <h1 className="text-xl font-bold mb-4">报警</h1>
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50">
          <div className="text-red-400 font-semibold mb-2">⚠️ 当前数据不可用</div>
          <div className="text-sm text-white/60">请稍后刷新</div>
        </div>
      </div>
    );
  }

  const redCount = payload.red_summary?.red_count ?? 0;

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">报警</h1>
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">红色警报数量</div>
          <div className="text-2xl font-bold text-red-400">{redCount}</div>
        </div>
        <div className="mt-4 lg:mt-0 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm text-white/50 mb-1">警报说明</div>
          <div className="text-sm text-white/70">桌面端可查看详细警报列表</div>
        </div>
      </div>
    </div>
  );
}
