'use client';

interface StageShareTop20 {
  high?: number;
  mid?: number;
  down?: number;
}

interface QsxuItem {
  date: string;
  qsxu_delta: number;
  structure: string;
  stage: string;
  sim: number;
}

interface SimilarityClientProps {
  similarityText?: string;
  finalDecisionText?: string;
  stageShareTop20?: StageShareTop20;
  qsxuTop5?: QsxuItem[];
}

export default function SimilarityClient({
  similarityText,
  finalDecisionText,
  stageShareTop20,
  qsxuTop5
}: SimilarityClientProps) {
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-2">历史相似性分析</h1>
      <p className="text-xs text-white/40 mb-6">Pro 专属</p>

      {/* Top 5 Similar Historical Dates */}
      {qsxuTop5 && qsxuTop5.length > 0 && (
        <div className="mb-6">
          <div className="text-sm text-white/50 mb-3">历史相似度</div>
          <div className="space-y-3">
            {qsxuTop5.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-cyan-400">
                    {item.date}
                  </span>
                  <span className="text-sm text-white/50">
                    相似度: {(item.sim * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/40">结构: </span>
                    <span className="text-white/70">{item.structure}</span>
                  </div>
                  <div>
                    <span className="text-white/40">阶段: </span>
                    <span className="text-white/70">{item.stage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* 使用说明 */}
      <div className="mb-6">
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
      </div>

      {/* 综合决策建议 */}
      {finalDecisionText && (
        <div className="mb-6">
          <div className="text-sm text-white/50 mb-3">综合决策建议</div>
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="text-sm text-amber-300/90">{finalDecisionText}</div>
          </div>
        </div>
      )}

      {/* Top20相似结构阶段分布 */}
      {stageShareTop20 && (
        <div className="mb-6">
          <div className="text-sm text-white/50 mb-3">Top20相似结构阶段分布</div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-3">
              {stageShareTop20.high !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">高位阶段</span>
                  <span className="text-sm font-medium text-cyan-400">{(stageShareTop20.high * 100).toFixed(0)}%</span>
                </div>
              )}
              {stageShareTop20.mid !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">中位阶段</span>
                  <span className="text-sm font-medium text-cyan-400">{(stageShareTop20.mid * 100).toFixed(0)}%</span>
                </div>
              )}
              {stageShareTop20.down !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">下行阶段</span>
                  <span className="text-sm font-medium text-cyan-400">{(stageShareTop20.down * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 风险提示 */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="text-xs text-white/40 mb-1.5">风险提示</div>
        <div className="text-[10px] text-white/30 leading-relaxed">
          本系统为研究型全市场风险分析工具，基于多维历史数据与结构化模型提供风险环境参考，不构成投资建议或收益承诺，所有决策与风险由用户自行承担。
        </div>
      </div>
    </div>
  );
}
