import { PageGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";
import AlertsClient from "./client";

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

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">报警</h1>
      <AlertsClient />
    </div>
  );
}
