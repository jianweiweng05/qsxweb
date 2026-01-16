'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimilarityClient({ similarityText }: { similarityText?: string }) {
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const handleAsk = () => {
    if (question.trim()) {
      router.push(`/ai?q=${encodeURIComponent(question)}`);
    }
  };

  return (
    <div className="p-4 text-white min-h-full bg-black/90">
      <h1 className="text-xl font-bold mb-2">历史相似性分析</h1>
      <p className="text-xs text-white/40 mb-6">Pro 专属</p>

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

      {/* AI 问答 */}
      <div className="mb-6">
        <div className="text-sm text-white/50 mb-3">AI 问答</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="输入问题，跳转到 AI 页面..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
          />
          <button
            onClick={handleAsk}
            className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 transition"
          >
            提问
          </button>
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
          本系统提供的所有内容均为市场研究与风险分析参考，不构成任何形式的投资建议或收益承诺。数字资产价格波动剧烈，请用户根据自身风险承受能力独立决策。
        </div>
      </div>
    </div>
  );
}
