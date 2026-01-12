'use client';

import { useState } from 'react';

export default function AIPage() {
  const [input, setInput] = useState('');

  const quickQuestions = [
    'What is the current market regime?',
    'Should I reduce my position sizes?',
    'What are the key risk factors today?',
    'Which assets show the strongest momentum?',
  ];

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-[clamp(2rem,4vw,3rem)] font-bold text-white">
          AI Market Assistant
        </h1>
        <p className="mb-12 text-lg text-gray-400">
          Get instant answers to your market questions powered by our AI analysis engine.
        </p>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <label htmlFor="question" className="mb-2 block text-sm font-semibold text-gray-300">
              Ask a question
            </label>
            <div className="flex gap-3">
              <input
                id="question"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., What's the current BTC trend?"
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm focus:border-purple-500 focus:outline-none"
              />
              <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105">
                Ask
              </button>
            </div>
          </div>

          <div className="mb-4 text-sm font-semibold text-gray-300">Quick questions</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickQuestions.map((question, i) => (
              <button
                key={i}
                onClick={() => setInput(question)}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-left text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/10"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-bold text-white">What can I help you with?</h2>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400"></div>
              <p>Market regime analysis and trend identification</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-purple-400"></div>
              <p>Risk assessment and position sizing recommendations</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-pink-400"></div>
              <p>Technical analysis and support/resistance levels</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400"></div>
              <p>Correlation analysis and portfolio diversification</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-3 text-lg font-bold text-white">Real-time Data</h3>
            <p className="text-sm text-gray-400">
              Responses are based on the latest market data and our continuously updated AI models.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h3 className="mb-3 text-lg font-bold text-white">Context-Aware</h3>
            <p className="text-sm text-gray-400">
              The assistant understands your portfolio context and risk preferences for personalized insights.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4 text-center">
          <p className="text-sm text-yellow-300">
            AI responses are for informational purposes only. Not investment advice.
          </p>
        </div>
      </div>
    </main>
  );
}
