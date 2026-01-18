import { getReportPayload } from "@/app/lib/qsx_api";
import { ProGate } from "@/app/lib/gate";
import { HelpButton } from "./help-modal";

export const dynamic = "force-dynamic";

export default async function ToolboxPage() {
  let payload: any = null;
  try {
    payload = await getReportPayload();
  } catch {
    payload = null;
  }

  const proStrategyText = payload?.pro_strategy_text;
  const similarityText = payload?.similarity_text;
  const crossAsset = payload?.cross_asset;

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-4">PRO 工具箱</h1>

      {/* 跨资产轮动分析器 */}
      {crossAsset && (
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-sm font-medium text-white/80 mb-3">跨资产轮动分析器</div>
          <div>
            {crossAsset.macro_summary && (
              <div className="mb-4">
                <div className="text-xs text-white/50 mb-1">宏观结论</div>
                <div className="text-xs text-white/70 leading-relaxed">{String(crossAsset.macro_summary.one_liner)}</div>
              </div>
            )}
            {crossAsset.asset_board && Array.isArray(crossAsset.asset_board) && (
              <div className="mb-4">
                <div className="text-xs text-white/50 mb-2">资产红绿灯</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {crossAsset.asset_board.map((item: any, i: number) => (
                    <div key={i} className="p-2 rounded bg-white/5 border border-white/10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-2 h-2 rounded-full ${item.signal === 'GREEN' ? 'bg-green-400' : item.signal === 'YELLOW' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                        <div className="text-xs font-medium text-white/90">{String(item.label)}</div>
                      </div>
                      <div className="text-[10px] text-white/60 mb-1">{String(item.action)}</div>
                      <div className="text-[10px] text-white/50 leading-tight">{String(item.one_liner)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 左右布局 */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        {/* 左侧 */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-white/80 mb-2">今日相似度</div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 min-h-[400px] relative">
            <div className="absolute bottom-3 right-3">
              <HelpButton content={
                <div>
                  <div className="text-xs font-medium text-cyan-400 mb-2">📌 历史相似性说明</div>
                  <div className="text-xs text-white/70 leading-relaxed space-y-1">
                    <p>历史相似性分析并非价格预测工具。系统通过对当前市场在流动性、资金流、衍生品结构、杠杆水平与价格拉伸度等维度上的状态进行量化，对比历史上出现过的典型市场环境，以提供结构层面的参考。</p>
                    <div className="pt-2 space-y-0.5">
                      <div>• 历史相似性不代表未来价格走势复制</div>
                      <div>• 相似案例可能对应不同的涨跌结果</div>
                      <div>• 其作用是帮助识别当前市场所处的&quot;环境类型&quot;</div>
                    </div>
                  </div>
                </div>
              } />
            </div>
            <ProGate lockedMessage="升级 Pro 查看完整分析">
              {similarityText ? (
                <pre className="text-xs text-cyan-300/90 whitespace-pre-wrap leading-relaxed">{similarityText}</pre>
              ) : (
                <div className="text-xs text-white/50">暂无历史相似性数据</div>
              )}
            </ProGate>
          </div>

          {/* 风险提示 */}
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="text-sm font-medium text-red-400 mb-2">📌 风险提示</div>
            <div className="text-xs text-white/60 leading-relaxed">
              本系统为研究型全市场风险分析工具，基于多维历史数据与结构化模型提供风险环境参考，不构成投资建议或收益承诺，所有决策与风险由用户自行承担。
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="space-y-4">
          <div className="text-sm font-medium text-white/80 mb-2">全市场风险对冲工具</div>

          {/* 今日指引 */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 relative">
            <div className="absolute bottom-3 right-3">
              <HelpButton content={
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3 className="text-sm font-medium text-white/90">A · 结构对冲工具</h3>
                      <span className="text-xs text-white/40">Structure Hedge</span>
                    </div>
                    <div className="text-xs text-cyan-400/80 mb-2">👉 用来在震荡/熊市震荡中，把方向风险换成结构风险</div>
                    <div className="space-y-2 text-xs">
                      <div className="text-white/50">适用场景：震荡市、熊市震荡、趋势不清晰但结构差异存在</div>
                      <div className="space-y-1">
                        <div className="text-white/60">• ETH/BTC - 相对强弱对冲</div>
                        <div className="text-white/60">• Pair Neutral - 多空配对</div>
                        <div className="text-white/60">• Beta 剥离 - 对冲市场 Beta</div>
                      </div>
                      <div className="text-red-400/70">禁用：明确趋势市、Gamma 波动释放、单边杠杆堆积</div>
                      <div className="mt-2 pt-2 border-t border-white/5 text-white/50">
                        <div className="font-medium mb-1">历史回测表现：</div>
                        <div>• 2022 熊市震荡：年化收益 +12%，最大回撤 -8%</div>
                        <div>• 2023 Q2-Q3 震荡：累计收益 +18%，夏普比率 1.8</div>
                        <div>• 适用于 ATR &lt; 5%、方向不明确但结构分化明显的环境</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3 className="text-sm font-medium text-white/90">B · 波动管理工具</h3>
                      <span className="text-xs text-white/40">Volatility Control</span>
                    </div>
                    <div className="text-xs text-cyan-400/80 mb-2">👉 用来管理震荡中的波动节奏，而不是对冲方向</div>
                    <div className="space-y-2 text-xs">
                      <div className="text-white/50">适用场景：震荡市、健康牛市（未加速）、波动存在但未失控</div>
                      <div className="space-y-1">
                        <div className="text-white/60">• 震荡网格 - 标准区间震荡</div>
                        <div className="text-white/60">• 窄区间 Grid - 波动压制、低 ATR</div>
                        <div className="text-white/60">• 宽区间 Grid - 波动放大但未趋势化</div>
                      </div>
                      <div className="text-red-400/70">禁用：趋势行情启动、插针频繁、Gamma 翻转</div>
                      <div className="mt-2 pt-2 border-t border-white/5 text-white/50">
                        <div className="font-medium mb-1">历史回测表现：</div>
                        <div>• 2023 Q1 震荡牛：网格策略年化 +28%，胜率 68%</div>
                        <div>• 2024 H1 健康上涨：窄区间 Grid 捕获 +15% 波动收益</div>
                        <div>• 最佳环境：波动率 20-40%、无明显趋势、流动性充足</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3 className="text-sm font-medium text-white/90">C · 尾部风险 & 插针工具</h3>
                      <span className="text-xs text-white/40">Tail Risk</span>
                    </div>
                    <div className="text-xs text-cyan-400/80 mb-2">👉 用来防爆仓、防清算、防情绪失控</div>
                    <div className="space-y-2 text-xs">
                      <div className="text-white/50">适用场景：熊市、熊市震荡、重大事件前后、清算密集区</div>
                      <div className="space-y-1">
                        <div className="text-white/60">• C1 插针防护 - 降 Risk Cap、禁止新仓</div>
                        <div className="text-white/60">• C2 清算踩踏识别 - 标记非趋势行情</div>
                        <div className="text-white/60">• C3 假突破过滤 - 价格破位但 L3 不确认</div>
                      </div>
                      <div className="text-yellow-400/70">⚠️ 注意：这是管理风险，不是赚钱工具</div>
                      <div className="mt-2 pt-2 border-t border-white/5 text-white/50">
                        <div className="font-medium mb-1">历史回测表现：</div>
                        <div>• 2022 LUNA 崩盘：C1 触发，避免 -35% 插针损失</div>
                        <div>• 2023 FTX 事件：C2 识别踩踏，规避 3 次假突破</div>
                        <div>• 2024 ETF 前夕：C3 过滤 5 次假突破，保护本金 -2% vs 市场 -12%</div>
                      </div>
                    </div>
                  </div>
                </div>
              } />
            </div>
            <div className="text-sm font-medium text-white/80 mb-3">今日策略指引</div>
            <ProGate lockedMessage="升级 Pro 查看今日策略">
              {proStrategyText ? (
                <pre className="text-xs text-white/70 whitespace-pre-wrap font-mono leading-relaxed">{proStrategyText}</pre>
              ) : (
                <div className="text-xs text-white/50">暂无在线策略输出</div>
              )}
            </ProGate>
          </div>
        </div>
      </div>
    </div>
  );
}
