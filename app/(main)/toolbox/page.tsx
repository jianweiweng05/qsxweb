import { PageGate } from "@/app/lib/gate";
import { getReportPayload } from "@/app/lib/qsx_api";
import { SharedAIInput } from "../shared-ai-input";

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

        <SharedAIInput />

        {/* ToolBox A: 结构对冲工具 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-base font-semibold">🧰 结构对冲工具</h2>
            <span className="text-xs text-white/40">ToolBox A · Structure Hedge</span>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <div className="text-xs text-cyan-400/90">👉 用来在震荡 / 熊市震荡中，把方向风险换成结构风险</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* 左侧：工具说明 */}
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">适用场景</div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• 震荡市</div>
                  <div>• 熊市震荡</div>
                  <div>• 趋势不清晰，但结构差异存在</div>
                </div>
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
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40">
                  说明：该工具用于震荡区间内的结构性波动捕捉，不押方向，依赖价格回归与区间有效性。
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-white/50">工具列表（A 组）</div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">• ETH/BTC</span>
                    <span className="text-xs text-white/40 ml-2">→ 相对强弱对冲，降低单边风险</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">• Pair Neutral</span>
                    <span className="text-xs text-white/40 ml-2">→ 多空配对，压缩净敞口</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">• Beta 剥离</span>
                    <span className="text-xs text-white/40 ml-2">→ 对冲市场 Beta，仅保留 Alpha/结构差</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-xs text-red-400/90 mb-2 font-medium">禁止使用（ToolBox A 统一规则）</div>
                <div className="text-xs text-white/60 space-y-1">
                  <div>• 明确趋势市</div>
                  <div>• Gamma 进入「波动释放」</div>
                  <div>• 单边资金/杠杆明显堆积</div>
                  <div className="pt-2 text-white/50">触发以上任一条 → A 组全部不使用</div>
                </div>
              </div>
            </div>

            {/* 右侧：历史表现 */}
            <div className="space-y-3">
              <div className="text-xs text-white/50 mb-2">📊 历史表现参考</div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">适用环境（样本筛选条件）</div>
                <div className="text-xs text-white/70 space-y-1">
                  <div>• 市场状态：震荡 / 熊市震荡</div>
                  <div>• MacroCoef ≤ 0</div>
                  <div>• L3（衍生品层）≤ 0（杠杆失真或偏弱）</div>
                  <div>• Gamma：压制或切换前</div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
                  统计周期：持有周期 5–21 天 / 样本来源：历史震荡 & 熊市震荡阶段
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-3">📈 典型环境表现区间</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-white/50 mb-1">胜率</div>
                    <div className="text-white/80 font-medium">58% – 66%</div>
                  </div>
                  <div>
                    <div className="text-white/50 mb-1">年化区间</div>
                    <div className="text-white/80 font-medium">10% – 22%</div>
                  </div>
                  <div>
                    <div className="text-white/50 mb-1">最大回撤</div>
                    <div className="text-white/80 font-medium">4% – 9%</div>
                  </div>
                  <div>
                    <div className="text-white/50 mb-1">Calmar</div>
                    <div className="text-white/80 font-medium">1.6 – 2.4</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
                  主要功能：降低组合波动 / Beta 中性
                </div>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-xs text-cyan-400/90">
                  解读要点：收益来源于结构错配修复而非方向判断 / 在趋势行情中胜率显著下降
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ToolBox B: 波动管理工具 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-base font-semibold">🧰 波动管理工具</h2>
            <span className="text-xs text-white/40">ToolBox B · Volatility Control</span>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <div className="text-xs text-cyan-400/90">👉 用来管理震荡中的波动节奏，而不是对冲方向</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* 左侧：工具说明 */}
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">适用场景</div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• 震荡市</div>
                  <div>• 健康牛市（未加速）</div>
                  <div>• 波动存在，但未失控</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-white/50">工具列表（B 组）</div>
                <div className="space-y-2">
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">• 震荡网格</span>
                    <span className="text-xs text-white/40 ml-2">→ 标准区间震荡</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">• 窄区间 Grid</span>
                    <span className="text-xs text-white/40 ml-2">→ 波动压制、低 ATR</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">• 宽区间 Grid</span>
                    <span className="text-xs text-white/40 ml-2">→ 波动放大但未趋势化</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-xs text-red-400/90 mb-2 font-medium">禁止使用（ToolBox B 统一规则）</div>
                <div className="text-xs text-white/60 space-y-1">
                  <div>• 趋势行情启动</div>
                  <div>• 插针频繁、Gamma 翻转</div>
                  <div>• L3 出现连续极端信号</div>
                  <div className="pt-2 text-white/50">一句话原则：B 组只吃"有节奏的波动"，不吃"失控的波动"</div>
                </div>
              </div>
            </div>

            {/* 右侧：历史表现 */}
            <div className="space-y-3">
              <div className="text-xs text-white/50 mb-2">📊 历史表现参考</div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">适用环境</div>
                <div className="text-xs text-white/70 space-y-1">
                  <div>• 市场状态：震荡 / 健康牛市</div>
                  <div>• Gamma：压制</div>
                  <div>• 无趋势突破（L6 ≠ 明确趋势）</div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
                  统计周期：持有周期 3–14 天 / 样本来源：震荡市 + 低波动阶段
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-3">📈 典型环境表现区间</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-white/50 mb-1">胜率</div>
                    <div className="text-white/80 font-medium">63% – 72%</div>
                  </div>
                  <div>
                    <div className="text-white/50 mb-1">年化区间</div>
                    <div className="text-white/80 font-medium">18% – 35%</div>
                  </div>
                  <div>
                    <div className="text-white/50 mb-1">最大回撤</div>
                    <div className="text-white/80 font-medium">6% – 12%</div>
                  </div>
                  <div>
                    <div className="text-white/50 mb-1">Calmar</div>
                    <div className="text-white/80 font-medium">1.8 – 2.6</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
                  主要功能：震荡收益 / 波动收割
                </div>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-xs text-cyan-400/90">
                  解读要点：胜率高但对环境依赖极强 / Gamma 释放时需立即停用
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ToolBox C: 尾部风险 & 插针工具 */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-base font-semibold">🧰 尾部风险 & 插针工具</h2>
            <span className="text-xs text-white/40">ToolBox C · Tail Risk</span>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <div className="text-xs text-cyan-400/90">👉 用来防爆仓、防清算、防情绪失控</div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-3">
            <div className="text-xs text-yellow-400/90">⚠️ 注意：这是"管理风险"，不是赚钱工具</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* 左侧：工具说明 */}
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">适用场景</div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• 熊市</div>
                  <div>• 熊市震荡</div>
                  <div>• 重大事件前后</div>
                  <div>• 清算密集区</div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">工具类型（C 组）</div>
                <div className="text-sm text-white/70 space-y-1">
                  <div>• 防插针结构</div>
                  <div>• 尾部风险对冲</div>
                  <div>• 极端波动缓冲工具</div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40">
                  说明：C 组工具不追求收益，唯一目标是：活下来、别被打穿
                </div>
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

              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-xs text-red-400/90 mb-2 font-medium">禁止使用（ToolBox C 统一规则）</div>
                <div className="text-xs text-white/60 space-y-1">
                  <div>• 已进入趋势行情</div>
                  <div>• 波动已经充分释放</div>
                  <div>• 风险事件结束后继续硬抗</div>
                </div>
              </div>
            </div>

            {/* 右侧：历史表现 */}
            <div className="space-y-3">
              <div className="text-xs text-white/50 mb-2">📊 历史表现参考</div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-2">适用环境</div>
                <div className="text-xs text-white/70 space-y-1">
                  <div>• 熊市震荡 / 恐慌前兆</div>
                  <div>• Gamma 快速切换</div>
                  <div>• L3 杠杆清算风险抬升</div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50">
                  统计说明：该工具不以收益为目标，不展示年化或胜率
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-white/50 mb-3">📉 风险缓释效果（定性统计）</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50">最大回撤抑制</span>
                    <span className="text-white/80">显著</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">波动暴露</span>
                    <span className="text-white/80">明显下降</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">收益表现</span>
                    <span className="text-white/80">不适用 / 次要</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">核心价值</span>
                    <span className="text-white/80">保护组合生存率</span>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-xs text-cyan-400/90">
                  解读要点：属于保险型工具 / 长期使用会拉低收益，但能显著降低极端风险
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 统一底线 */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/50 mb-2">⚠️ 风险提示</div>
          <div className="text-xs text-white/70 leading-relaxed space-y-2">
            <div>• 以上数据基于特定历史环境的统计结果</div>
            <div>• 工具仅在匹配环境中具备统计优势</div>
            <div>• 市场结构变化时，应立即停止使用</div>
            <div>• 本系统不提供买卖点、不承诺收益</div>
          </div>
        </div>
      </div>
    </PageGate>
  );
}
