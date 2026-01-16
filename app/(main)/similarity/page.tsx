import { PageGate } from "@/app/lib/gate";
import { getUserTier } from "@/app/lib/entitlements";
import { getReportPayload } from "@/app/lib/qsx_api";

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

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-2">历史相似性分析</h1>
      <p className="text-xs text-white/40 mb-6">Pro 专属</p>

      {/* 使用说明 */}
      <div className="mb-6 space-y-4">
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <div className="text-sm font-medium text-cyan-400 mb-2">📌 历史相似性说明（必读）</div>
          <div className="text-xs text-white/70 leading-relaxed space-y-2">
            <p>历史相似性分析并非价格预测工具。系统通过对当前市场在 流动性、资金流、衍生品结构、杠杆水平与价格拉伸度 等维度上的状态进行量化，对比历史上出现过的典型市场环境，以提供结构层面的参考。</p>
            <div className="pt-2 space-y-1">
              <div>• 历史相似性不代表未来价格走势复制</div>
              <div>• 相似案例可能对应不同的涨跌结果</div>
              <div>• 其作用是帮助识别当前市场所处的"环境类型"</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm font-medium text-white/80 mb-2">📌 如何正确使用历史相似性</div>
          <div className="text-xs text-white/70 leading-relaxed space-y-3">
            <div>
              <div className="text-white/50 mb-1">历史相似性适合回答的问题：</div>
              <div className="space-y-1 pl-2">
                <div>• 当前市场更像"趋势启动"还是"高位消耗"？</div>
                <div>• 当前风险来自流动性、杠杆还是情绪？</div>
                <div>• 在类似环境中，哪些策略更稳健 / 更脆弱？</div>
              </div>
            </div>
            <div>
              <div className="text-white/50 mb-1">历史相似性不适合回答的问题：</div>
              <div className="space-y-1 pl-2">
                <div>• 明天涨还是跌？</div>
                <div>• 具体涨跌幅是多少？</div>
                <div>• 单一交易点位判断</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 相似性数据 */}
      <div className="mb-6">
        <div className="text-sm text-white/50 mb-3">当前市场相似性分析</div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          {similarityText ? (
            <pre className="text-sm text-cyan-300/90 whitespace-pre-wrap leading-relaxed">{similarityText}</pre>
          ) : (
            <div className="text-white/50">暂无历史相似性数据</div>
          )}
        </div>
      </div>

      {/* 风险提示 */}
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <div className="text-sm font-medium text-red-400 mb-2">📌 风险提示</div>
        <div className="text-xs text-white/60 leading-relaxed">
          本系统提供的所有内容均为市场研究与风险分析参考，不构成任何形式的投资建议或收益承诺。数字资产价格波动剧烈，请用户根据自身风险承受能力独立决策。
        </div>
      </div>
    </div>
  );
}
