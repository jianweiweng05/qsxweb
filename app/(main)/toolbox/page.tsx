import { PageGate } from "@/app/lib/gate";
import { getReportPayload } from "@/app/lib/qsx_api";

export const dynamic = "force-dynamic";

export default async function ToolboxPage() {
  let payload: any = null;
  try {
    payload = await getReportPayload();
  } catch {
    payload = null;
  }

  const proStrategyText = payload?.pro_strategy_text;

  return (
    <PageGate
      requiredTier="PRO"
      title="工具箱"
      unlockConfig={{
        title: "全市场风险对冲工具箱",
        description: "专业级风险管理工具集，帮助您在不同市场环境下有效对冲风险，保护投资组合。",
        features: [
          "结构对冲工具 - ETH/BTC、Pair Neutral、Beta 剥离",
          "波动管理工具 - 震荡网格、窄/宽区间 Grid",
          "尾部风险 & 插针工具 - 清算踩踏识别、假突破过滤"
        ]
      }}
    >
      <div className="p-4 text-white min-h-full bg-black/90">
        <h1 className="text-xl font-bold mb-2">🧰 全市场风险对冲工具箱</h1>
        <p className="text-xs text-white/40 mb-6">Pro 专属</p>

        {/* ToolBox A: 结构对冲工具 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-base font-semibold">🧰 结构对冲工具</h2>
            <span className="text-xs text-white/40">ToolBox A</span>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-3">
            <div className="text-xs text-white/50 mb-2">适用场景</div>
            <div className="text-sm text-white/70">震荡 / 熊市震荡</div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-xs text-white/50 mb-2">今日策略建议</div>
            {proStrategyText ? (
              <pre className="text-xs text-white/70 whitespace-pre-wrap font-mono leading-relaxed">
                {proStrategyText}
              </pre>
            ) : (
              <div className="text-xs text-white/40">暂无在线策略输出</div>
            )}
          </div>
          <div className="mt-3 space-y-2">
            <div className="text-xs text-white/50">工具列表：</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-white/60">ETH/BTC</span>
              <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-white/60">Pair Neutral</span>
              <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-white/60">Beta 剥离</span>
            </div>
          </div>
        </div>

        {/* ToolBox B: 波动管理工具 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-base font-semibold">🧰 波动管理工具</h2>
            <span className="text-xs text-white/40">ToolBox B</span>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-3">
            <div className="text-xs text-white/50 mb-2">适用场景</div>
            <div className="text-sm text-white/70">震荡 / 健康牛市</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-white/50">工具列表：</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-white/60">震荡网格</span>
              <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-white/60">窄区间 Grid</span>
              <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-white/60">宽区间 Grid</span>
            </div>
          </div>
        </div>

        {/* ToolBox C: 尾部风险 & 插针工具 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-base font-semibold">🧰 尾部风险 & 插针工具</h2>
            <span className="text-xs text-white/40">ToolBox C</span>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-3">
            <div className="text-xs text-yellow-400/90">⚠️ 注意：这是"管理风险"，不是赚钱工具</div>
          </div>

          <div className="space-y-3">
            {/* C1: 插针防护 */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium text-white/80 mb-2">C1｜插针防护（Spike Guard）</div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-white/50">条件：</span>
                  <span className="text-white/70">L3 清算异常、RR25 急变</span>
                </div>
                <div>
                  <span className="text-white/50">行为：</span>
                  <span className="text-white/70">降 Risk Cap、禁止新仓</span>
                </div>
              </div>
            </div>

            {/* C2: 清算踩踏识别 */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium text-white/80 mb-2">C2｜清算踩踏识别（Liquidation Watch）</div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-white/50">条件：</span>
                  <span className="text-white/70">单边清算、LS 极端</span>
                </div>
                <div>
                  <span className="text-white/50">行为：</span>
                  <span className="text-white/70">标记「非趋势行情」、所有策略降权</span>
                </div>
              </div>
            </div>

            {/* C3: 假突破过滤 */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm font-medium text-white/80 mb-2">C3｜假突破过滤（False Break Filter）</div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-white/50">条件：</span>
                  <span className="text-white/70">价格破位、L3 不确认</span>
                </div>
                <div>
                  <span className="text-white/50">行为：</span>
                  <span className="text-white/70">明确写：不跟单</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageGate>
  );
}
