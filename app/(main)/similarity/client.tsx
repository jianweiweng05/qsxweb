'use client';

export default function SimilarityClient({ similarityText }: { similarityText?: string }) {
  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-2">历史相似性分析</h1>
      <p className="text-xs text-white/40 mb-6">Pro 专属</p>

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

      {/* 风险提示 */}
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <div className="text-sm font-medium text-red-400 mb-2">📌 风险提示</div>
        <div className="text-xs text-white/60 leading-relaxed">
          本系统为研究型全市场风险分析工具，基于多维历史数据与结构化模型提供风险环境参考，不构成投资建议或收益承诺，所有决策与风险由用户自行承担。
        </div>
      </div>
    </div>
  );
}
