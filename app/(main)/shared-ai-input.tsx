'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SharedAIInput() {
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const handleAsk = () => {
    if (question.trim()) {
      router.push(`/ai?q=${encodeURIComponent(question)}`);
    }
  };

  return (
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
  );
}
