"use client";

import { PageGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";
import SimilarityClient from "./client";
import { useReport } from "../report-provider";

export default function SimilarityPage() {
  const tier = getUserTier();
  const { data: payload } = useReport();

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

  const similarityText = payload?.similarity_text;
  const finalDecisionText = payload?.final_decision_text;
  const stageShareTop20 = payload?.pro_strategy?.stage_share_top20;
  const qsxuTop5 = payload?.similarity?.qsxu_top10?.slice(0, 5) || [];

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('[SimilarityPage] payload.similarity:', payload?.similarity);
    console.log('[SimilarityPage] qsxu_top10:', payload?.similarity?.qsxu_top10);
    console.log('[SimilarityPage] qsxuTop5:', qsxuTop5);
  }

  return (
    <SimilarityClient
      similarityText={similarityText}
      finalDecisionText={finalDecisionText}
      stageShareTop20={stageShareTop20}
      qsxuTop5={qsxuTop5}
    />
  );
}
