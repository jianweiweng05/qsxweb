import { PageGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";
import { getReportPayload } from "@/app/lib/qsx_api";
import AlertsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const tier = getUserTier();

  // 非 Pro 用户显示锁定页面
  if (tier !== "PRO") {
    return (
      <PageGate
        requiredTier="PRO"
        title="报警"
        unlockConfig={{
          title: "实时报警系统",
          description: "7x24 小时监控市场异常信号，第一时间发现风险和机会。",
          features: [
            "多层级风险监控",
            "历史报警回溯分析",
            "关键指标异常提醒"
          ]
        }}
      >
        <></>
      </PageGate>
    );
  }

  let payload: any = null;
  try {
    payload = await getReportPayload();
  } catch {
    payload = null;
  }

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">报警</h1>
      <AlertsClient />
    </div>
  );
}
