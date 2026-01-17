"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "./ai/chat-panel";

const PAGE_SUGGESTIONS: Record<string, string[]> = {
  today: [
    "今天的建议仓位是多少？为什么？",
    "当前市场状态下应该采取什么策略？",
    "多空信号分别指向什么？"
  ],
  radar: [
    "如何解读当前的市场数据？",
    "哪些指标值得重点关注？",
    "数据显示的趋势是什么？"
  ],
  toolbox: [
    "今日相似度分析说明了什么？",
    "策略指引建议如何操作？",
    "如何使用这些工具优化决策？"
  ],
  alerts: [
    "当前有哪些重要的风险信号？",
    "报警级别如何判断？",
    "历史报警数据显示什么规律？"
  ],
  ai: [
    "如何分析当前市场环境？",
    "有什么投资建议？",
    "风险点在哪里？"
  ]
};

export function FloatingAIBubble({
  messages,
  setMessages,
}: {
  messages: { role: "user" | "ai"; text: string }[];
  setMessages: (msgs: { role: "user" | "ai"; text: string }[] | ((prev: { role: "user" | "ai"; text: string }[]) => { role: "user" | "ai"; text: string }[])) => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getContext = () => {
    const parts = pathname.split("/").filter(Boolean);
    const page = parts[parts.length - 1] || "today";
    return { from: `/${page}`, suggestions: PAGE_SUGGESTIONS[page] || PAGE_SUGGESTIONS.today };
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg"
        style={{
          bottom: "calc(72px + env(safe-area-inset-bottom) + 16px)",
          right: "16px",
          background: "rgba(10,14,20,0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(0,229,255,0.3)"
        }}
        aria-label="AI助手"
      >
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          {/* 外层能量环 */}
          <circle cx="16" cy="16" r="14" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.4" />
          <circle cx="16" cy="16" r="12" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.6" />

          {/* 中心核心 */}
          <circle cx="16" cy="16" r="6" fill="url(#grad2)" opacity="0.9" />
          <circle cx="16" cy="16" r="4" fill="#00E5FF" opacity="0.6" />
          <circle cx="16" cy="16" r="2" fill="#fff" opacity="0.8" />

          {/* 渐变定义 */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#4F9CFF" />
            </linearGradient>
            <radialGradient id="grad2">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4F9CFF" stopOpacity="0.3" />
            </radialGradient>
          </defs>
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 bg-black/40 z-50 hidden lg:block" onClick={() => setOpen(false)} />

          <div
            className="fixed z-50 bg-[#0a0e14]/95 backdrop-blur-md border-white/10 shadow-2xl
                       bottom-0 left-0 right-0 h-[80vh] rounded-t-2xl border-t border-l border-r
                       lg:bottom-auto lg:top-0 lg:left-auto lg:right-0 lg:h-full lg:w-[480px] lg:rounded-none lg:border-l lg:border-t-0 lg:border-r-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/80 text-sm font-medium">AI 助手</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/40 hover:text-white/80 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatPanel messages={messages} setMessages={setMessages} context={getContext()} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
