import { PageGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";
import { getReportPayload } from "@/app/lib/qsx_api";
import SimilarityClient from "./client";

export const dynamic = "force-dynamic";

export default async function SimilarityPage() {
  const tier = getUserTier();

  if (tier !== "PRO") {
    return (
      <PageGate
        requiredTier="PRO"
        title="历史相似性"
        unlockConfig={{
          title: "历史相似性分析",
          description: "基于历史数据，识别当前市场与过去相似的行情模式，帮助您预判市场走向。",
          features: [
            "历史行情模式匹配",
            "相似度量化分析",
            "历史走势参考对比"
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

  const similarityText = payload?.similarity_text;

  return <SimilarityClient similarityText={similarityText} />;
}
