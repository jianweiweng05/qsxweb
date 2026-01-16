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
      <PageGate requiredTier="PRO" title="报警">
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

  const similarityText = payload?.similarity_text;

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">报警</h1>
      <AlertsClient />

      {/* 历史相似性分析 */}
      <div className="mt-8">
        <div className="text-sm text-white/50 mb-3">历史相似性分析</div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          {similarityText ? (
            <pre className="text-sm text-cyan-300/90 whitespace-pre-wrap">{similarityText}</pre>
          ) : (
            <div className="text-white/50">暂无历史相似性数据</div>
          )}
        </div>
      </div>
    </div>
  );
}
